const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crcVal = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crcVal, 8 + len);
    return buf;
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLength);
  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLength] = 0; // filter None
    rgbaBuffer.copy(rawData, y * scanlineLength + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatChunk = makeChunk('IDAT', zlib.deflateSync(rawData));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const W = 256;
const H = 256;
const buffer = Buffer.alloc(W * H * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) * 4;
  // Blend with existing alpha
  const curA = buffer[idx + 3] / 255;
  const srcA = a / 255;
  const outA = srcA + curA * (1 - srcA);
  if (outA > 0) {
    buffer[idx] = Math.round((r * srcA + buffer[idx] * curA * (1 - srcA)) / outA);
    buffer[idx + 1] = Math.round((g * srcA + buffer[idx + 1] * curA * (1 - srcA)) / outA);
    buffer[idx + 2] = Math.round((b * srcA + buffer[idx + 2] * curA * (1 - srcA)) / outA);
    buffer[idx + 3] = Math.round(outA * 255);
  }
}

// Background: rounded dark metallic squircle with glowing terracotta border
const cornerRadius = 48;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    // Check squircle distance
    const dx = Math.max(0, Math.abs(x - 128) - (128 - cornerRadius));
    const dy = Math.max(0, Math.abs(y - 128) - (128 - cornerRadius));
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= cornerRadius) {
      // Radial glow gradient from center
      const centerDist = Math.hypot(x - 128, y - 128) / 128;
      const r = Math.round(26 + (1 - centerDist) * 35);
      const g = Math.round(18 + (1 - centerDist) * 16);
      const b = Math.round(16 + (1 - centerDist) * 12);

      // Border highlight
      const borderDist = cornerRadius - dist;
      if (borderDist < 5) {
        // Outer border terracotta
        setPixel(x, y, 217, 119, 87, 255);
      } else if (borderDist < 8) {
        setPixel(x, y, 242, 139, 85, 230);
      } else {
        setPixel(x, y, r, g, b, 255);
      }
    }
  }
}

// Draw Claude 8-pointed star in the center
const cx = 128;
const cy = 112; // slightly elevated to leave room for arcade buttons/d-pad below

function drawRotatedArm(angleDeg, length, width, r, g, b) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  for (let t = 0; t <= length; t += 0.5) {
    const armW = width * (1 - (t / length) * 0.45);
    for (let w = -armW; w <= armW; w += 0.5) {
      const px = Math.round(cx + t * cos - w * sin);
      const py = Math.round(cy + t * sin + w * cos);
      setPixel(px, py, r, g, b, 255);
    }
  }
}

// 8 star rays (0, 45, 90, 135, 180, 225, 270, 315)
const angles = [0, 45, 90, 135, 180, 225, 270, 315];
angles.forEach((deg, idx) => {
  const isDiag = idx % 2 !== 0;
  const len = isDiag ? 48 : 56;
  const w = isDiag ? 6 : 7;
  drawRotatedArm(deg, len, w, 217, 119, 87);
});

// Center hub glow
for (let y = cy - 20; y <= cy + 20; y++) {
  for (let x = cx - 20; x <= cx + 20; x++) {
    const d = Math.hypot(x - cx, y - cy);
    if (d <= 18) {
      setPixel(x, y, 242, 139, 85, 255);
    }
  }
}

// Inner star core
for (let y = cy - 10; y <= cy + 10; y++) {
  for (let x = cx - 10; x <= cx + 10; x++) {
    const d = Math.hypot(x - cx, y - cy);
    if (d <= 9) {
      setPixel(x, y, 255, 230, 215, 255);
    }
  }
}

// Arcade D-pad on lower-left
const dpadX = 76;
const dpadY = 196;
const dpadArm = 14;
const dpadW = 10;
// Cross
for (let y = dpadY - dpadArm; y <= dpadY + dpadArm; y++) {
  for (let x = dpadX - dpadW / 2; x <= dpadX + dpadW / 2; x++) {
    setPixel(Math.round(x), y, 234, 138, 104, 255);
  }
}
for (let y = dpadY - dpadW / 2; y <= dpadY + dpadW / 2; y++) {
  for (let x = dpadX - dpadArm; x <= dpadX + dpadArm; x++) {
    setPixel(x, Math.round(y), 234, 138, 104, 255);
  }
}

// Arcade A & B action buttons on lower-right
const btnBX = 162;
const btnBY = 202;
const btnAX = 186;
const btnAY = 190;
const btnR = 10;

function drawCircle(centerX, centerY, radius, r, g, b) {
  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      const d = Math.hypot(x - centerX, y - centerY);
      if (d <= radius) {
        setPixel(x, y, r, g, b, 255);
      }
    }
  }
}

drawCircle(btnBX, btnBY, btnR, 217, 119, 87);
drawCircle(btnBX, btnBY, btnR - 3, 242, 139, 85);

drawCircle(btnAX, btnAY, btnR, 239, 68, 68);
drawCircle(btnAX, btnAY, btnR - 3, 248, 113, 113);

// Center start/select retro pill
for (let x = 118; x <= 138; x++) {
  for (let y = 194; y <= 198; y++) {
    setPixel(x, y, 163, 155, 148, 255);
  }
}

const mediaDir = path.join(__dirname, '..', 'media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const pngData = writePNG(W, H, buffer);
fs.writeFileSync(path.join(mediaDir, 'icon.png'), pngData);
fs.writeFileSync(path.join(__dirname, '..', 'icon.png'), pngData);

console.log('Icon generated successfully at media/icon.png and icon.png');
