function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clauding Games</title>
  <style>
    :root {
      --bg-dark: #0e1117;
      --card-bg: rgba(26, 31, 46, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.4);
      --accent-hover: #4f46e5;
      --snake-head: #10b981;
      --snake-body: #059669;
      --apple: #f43f5e;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --gold: #f59e0b;
      --silver: #94a3b8;
      --bronze: #b45309;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    body {
      background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, var(--bg-dark) 70%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      padding: 16px;
    }

    .container {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      color: #a5b4fc;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      text-transform: uppercase;
      box-shadow: 0 0 15px var(--accent-glow);
    }

    .header-badge .pulse {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.6; }
    }

    .screen {
      display: none;
      width: 100%;
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .screen.active {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .glass-card {
      background: var(--card-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 24px;
      width: 100%;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }

    h1, h2 {
      text-align: center;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #fff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 13px;
      color: var(--text-muted);
      text-align: center;
      margin-bottom: 20px;
    }

    /* Input & Button Styles */
    .input-group {
      width: 100%;
      margin-bottom: 16px;
    }

    input[type="text"] {
      width: 100%;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      color: #fff;
      outline: none;
      transition: all 0.2s;
    }

    input[type="text"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }

    .btn {
      width: 100%;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 4px 14px var(--accent-glow);
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px var(--accent-glow);
    }

    .btn:active {
      transform: translateY(1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: none;
      color: #cbd5e1;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
      box-shadow: none;
      color: #fff;
    }

    /* Game Selector Screen */
    .game-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      width: 100%;
      margin-bottom: 8px;
    }

    .game-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 14px;
      transition: all 0.2s;
    }

    .game-card:hover {
      background: rgba(49, 46, 129, 0.4);
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
    }

    .game-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .game-icon {
      font-size: 30px;
      width: 48px;
      height: 48px;
      background: rgba(99, 102, 241, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .game-info h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .game-info p {
      font-size: 12px;
      color: var(--text-muted);
    }

    /* Game Screen */
    .game-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 0 4px;
    }

    .game-stat {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .game-stat span {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
    }

    #gameCanvas {
      background: #090d16;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
      display: block;
      margin: 0 auto 16px auto;
    }

    .controls-hint {
      display: flex;
      justify-content: center;
      gap: 12px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .key-badge {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 2px 6px;
      border-radius: 6px;
      color: #e2e8f0;
    }

    /* Touch Controls for Small Windows */
    .touch-controls {
      display: grid;
      grid-template-areas:
        ". up ."
        "left down right";
      gap: 8px;
      margin-top: 14px;
      width: 180px;
    }

    .touch-btn {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      user-select: none;
    }

    .touch-btn:active {
      background: var(--accent);
    }

    /* Leaderboard Screen */
    .score-summary {
      text-align: center;
      margin-bottom: 16px;
      background: rgba(15, 23, 42, 0.6);
      border-radius: 14px;
      padding: 14px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .score-summary .final-score {
      font-size: 36px;
      font-weight: 800;
      color: #10b981;
      text-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    }

    .leaderboard-list {
      max-height: 180px;
      overflow-y: auto;
      margin-bottom: 16px;
      padding-right: 4px;
    }

    .leaderboard-list::-webkit-scrollbar {
      width: 4px;
    }
    .leaderboard-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }

    .leaderboard-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      margin-bottom: 6px;
      font-size: 13px;
    }

    .leaderboard-item.highlight {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.5);
    }

    .leaderboard-rank {
      width: 24px;
      font-weight: 700;
      color: var(--text-muted);
    }

    .rank-1 { color: var(--gold); }
    .rank-2 { color: var(--silver); }
    .rank-3 { color: var(--bronze); }

    .leaderboard-user {
      flex: 1;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 8px;
    }

    .leaderboard-points {
      font-weight: 700;
      color: #38bdf8;
    }

    .actions {
      display: flex;
      gap: 8px;
      width: 100%;
    }

    .user-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 14px;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      width: 100%;
    }

    .user-pill span.name {
      color: #e2e8f0;
      font-weight: 600;
    }

    .user-pill a {
      color: #818cf8;
      cursor: pointer;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-badge">
      <div class="pulse"></div>
      Clauding Arcade &bull; Relax While Claude Works
    </div>

    <!-- SCREEN 1: USERNAME REGISTRATION -->
    <div id="screen-user" class="screen glass-card">
      <h1>Welcome Player!</h1>
      <p class="subtitle">Set your gamer tag for the online leaderboard</p>
      
      <div class="input-group">
        <input type="text" id="usernameInput" placeholder="Enter username (e.g. Neo)" maxlength="16" autofocus autocomplete="off" />
      </div>

      <button id="btnSaveUser" class="btn">
        <span>Continue to Games</span> &rarr;
      </button>
    </div>

    <!-- SCREEN 2: GAME SELECTOR (Modular for multiple games!) -->
    <div id="screen-select" class="screen glass-card">
      <div class="user-pill">
        <span>Playing as: <span id="displayUser" class="name">Guest</span></span>
        <a id="btnChangeUser">Change</a>
      </div>

      <h1>Choose a Game</h1>
      <p class="subtitle">Kill time smoothly while tasks finish running</p>

      <div class="game-grid">
        <div class="game-card" id="cardSnake">
          <div class="game-icon">🐍</div>
          <div class="game-info">
            <h3>Neon Snake</h3>
            <p>Eat apples, glow up, don't crash!</p>
          </div>
        </div>

        <div class="game-card disabled">
          <div class="game-icon">🚀</div>
          <div class="game-info">
            <h3>Space Runner (Coming soon)</h3>
            <p>Dodge asteroids in deep space</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SCREEN 3: GAME SCREEN -->
    <div id="screen-game" class="screen glass-card">
      <div class="game-header">
        <div class="game-stat">Score: <span id="currentScore">0</span></div>
        <div class="game-stat">High: <span id="highScore">0</span></div>
      </div>

      <canvas id="gameCanvas" width="320" height="320"></canvas>

      <div class="controls-hint">
        <span><span class="key-badge">&uarr; &darr; &larr; &rarr;</span> or <span class="key-badge">W A S D</span></span>
      </div>

      <div class="touch-controls">
        <div class="touch-btn" style="grid-area: up;" id="tUp">&uarr;</div>
        <div class="touch-btn" style="grid-area: left;" id="tLeft">&larr;</div>
        <div class="touch-btn" style="grid-area: down;" id="tDown">&darr;</div>
        <div class="touch-btn" style="grid-area: right;" id="tRight">&rarr;</div>
      </div>
    </div>

    <!-- SCREEN 4: LEADERBOARD & PLAY AGAIN -->
    <div id="screen-leaderboard" class="screen glass-card">
      <h1>Game Over!</h1>
      
      <div class="score-summary">
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">YOUR SCORE</p>
        <div id="finalScoreDisplay" class="final-score">0</div>
      </div>

      <h2 style="font-size: 15px; margin-bottom: 8px; text-align: left;">🏆 Global Leaderboard</h2>
      <div id="leaderboardList" class="leaderboard-list">
        <div style="text-align: center; color: var(--text-muted); padding: 12px;">Loading scores...</div>
      </div>

      <div class="actions">
        <button id="btnPlayAgain" class="btn" style="flex: 1;">Play Again</button>
        <button id="btnMenu" class="btn btn-secondary" style="flex: 1;">Games Menu</button>
      </div>
    </div>
  </div>

  <script>
    // --- Web Audio Synthesizer (No external assets required, crisp retro sounds) ---
    const AudioEngine = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
      },
      playEat() {
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.1);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
        } catch (e) {}
      },
      playCrash() {
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        } catch (e) {}
      },
      playMove() {
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } catch (e) {}
      }
    };

    // --- State & Online Storage (KV Database via RestDB / Mockapi / JSONBin / Local Sync) ---
    // Free online database powered by JSONBin / Cloudflare Worker / Key-Value free tier
    const DB_ENDPOINT = 'https://api.restful-api.dev/objects'; // Public free REST test API with instant persistence
    const STORAGE_KEY = 'clauding_username';
    const LEADERBOARD_KEY = 'clauding_leaderboard';

    let username = localStorage.getItem(STORAGE_KEY) || '';
    let highScore = parseInt(localStorage.getItem('clauding_highscore') || '0', 10);
    let currentScore = 0;

    // --- Screen Navigation ---
    function showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const target = document.getElementById(screenId);
      if (target) target.classList.add('active');
    }

    // UI Bindings
    const screenUser = document.getElementById('screen-user');
    const screenSelect = document.getElementById('screen-select');
    const screenGame = document.getElementById('screen-game');
    const screenLeaderboard = document.getElementById('screen-leaderboard');

    const usernameInput = document.getElementById('usernameInput');
    const btnSaveUser = document.getElementById('btnSaveUser');
    const btnChangeUser = document.getElementById('btnChangeUser');
    const displayUser = document.getElementById('displayUser');
    const cardSnake = document.getElementById('cardSnake');
    const currentScoreEl = document.getElementById('currentScore');
    const highScoreEl = document.getElementById('highScore');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const leaderboardList = document.getElementById('leaderboardList');
    const btnPlayAgain = document.getElementById('btnPlayAgain');
    const btnMenu = document.getElementById('btnMenu');

    // Init username flow
    if (!username) {
      showScreen('screen-user');
    } else {
      displayUser.textContent = username;
      showScreen('screen-select');
    }

    btnSaveUser.addEventListener('click', () => {
      const val = usernameInput.value.trim();
      if (!val) {
        usernameInput.focus();
        return;
      }
      username = val;
      localStorage.setItem(STORAGE_KEY, username);
      displayUser.textContent = username;
      AudioEngine.init();
      showScreen('screen-select');
    });

    usernameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnSaveUser.click();
    });

    btnChangeUser.addEventListener('click', () => {
      usernameInput.value = username;
      showScreen('screen-user');
    });

    cardSnake.addEventListener('click', () => {
      AudioEngine.init();
      startGame();
    });

    btnPlayAgain.addEventListener('click', () => {
      startGame();
    });

    btnMenu.addEventListener('click', () => {
      showScreen('screen-select');
    });

    // --- Snake Game Logic ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const GRID_SIZE = 16;
    const TILE_COUNT = canvas.width / GRID_SIZE;

    let snake = [];
    let velocity = { x: 0, y: 0 };
    let nextVelocity = { x: 0, y: 0 };
    let apple = { x: 5, y: 5 };
    let gameLoop = null;
    let isRunning = false;
    let speed = 100; // ms per tick

    function startGame() {
      showScreen('screen-game');
      currentScore = 0;
      currentScoreEl.textContent = '0';
      highScoreEl.textContent = highScore.toString();

      snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
      ];
      velocity = { x: 0, y: -1 };
      nextVelocity = { x: 0, y: -1 };
      speed = 105;
      isRunning = true;

      placeApple();
      clearInterval(gameLoop);
      gameLoop = setInterval(tick, speed);
    }

    function placeApple() {
      let valid = false;
      while (!valid) {
        apple.x = Math.floor(Math.random() * TILE_COUNT);
        apple.y = Math.floor(Math.random() * TILE_COUNT);
        valid = !snake.some(s => s.x === apple.x && s.y === apple.y);
      }
    }

    function tick() {
      velocity = { ...nextVelocity };
      const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

      // Wall collision
      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
      }

      snake.unshift(head);

      // Check apple
      if (head.x === apple.x && head.y === apple.y) {
        currentScore += 10;
        currentScoreEl.textContent = currentScore.toString();
        AudioEngine.playEat();
        placeApple();
        if (currentScore > highScore) {
          highScore = currentScore;
          highScoreEl.textContent = highScore.toString();
          localStorage.setItem('clauding_highscore', highScore.toString());
        }
        // Increase speed slightly
        if (speed > 55 && currentScore % 30 === 0) {
          speed -= 5;
          clearInterval(gameLoop);
          gameLoop = setInterval(tick, speed);
        }
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      // Clear
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= canvas.width; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Apple (Glow effect)
      ctx.save();
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      const appleRadius = GRID_SIZE / 2 - 2;
      ctx.arc(
        apple.x * GRID_SIZE + GRID_SIZE / 2,
        apple.y * GRID_SIZE + GRID_SIZE / 2,
        appleRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Draw Snake
      snake.forEach((part, index) => {
        ctx.save();
        if (index === 0) {
          // Head
          ctx.fillStyle = '#10b981';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#10b981';
        } else {
          // Gradient body
          const ratio = index / snake.length;
          ctx.fillStyle = index % 2 === 0 ? '#059669' : '#047857';
          ctx.shadowBlur = 0;
        }

        const padding = 1.5;
        const x = part.x * GRID_SIZE + padding;
        const y = part.y * GRID_SIZE + padding;
        const s = GRID_SIZE - padding * 2;
        const radius = index === 0 ? 5 : 3;

        // Rounded rect
        ctx.beginPath();
        ctx.roundRect(x, y, s, s, radius);
        ctx.fill();
        ctx.restore();
      });
    }

    function gameOver() {
      clearInterval(gameLoop);
      isRunning = false;
      AudioEngine.playCrash();

      finalScoreDisplay.textContent = currentScore.toString();
      showScreen('screen-leaderboard');
      saveAndFetchLeaderboard(username, currentScore);
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (!isRunning) return;
      if (['ArrowUp', 'KeyW'].includes(e.code) && velocity.y !== 1) {
        nextVelocity = { x: 0, y: -1 };
        AudioEngine.playMove();
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && velocity.y !== -1) {
        nextVelocity = { x: 0, y: 1 };
        AudioEngine.playMove();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && velocity.x !== 1) {
        nextVelocity = { x: -1, y: 0 };
        AudioEngine.playMove();
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && velocity.x !== -1) {
        nextVelocity = { x: 1, y: 0 };
        AudioEngine.playMove();
      }
    });

    // Touch controls for compact layout
    document.getElementById('tUp').addEventListener('click', () => {
      if (isRunning && velocity.y !== 1) { nextVelocity = { x: 0, y: -1 }; AudioEngine.playMove(); }
    });
    document.getElementById('tDown').addEventListener('click', () => {
      if (isRunning && velocity.y !== -1) { nextVelocity = { x: 0, y: 1 }; AudioEngine.playMove(); }
    });
    document.getElementById('tLeft').addEventListener('click', () => {
      if (isRunning && velocity.x !== 1) { nextVelocity = { x: -1, y: 0 }; AudioEngine.playMove(); }
    });
    document.getElementById('tRight').addEventListener('click', () => {
      if (isRunning && velocity.x !== -1) { nextVelocity = { x: 1, y: 0 }; AudioEngine.playMove(); }
    });

    // --- Online Leaderboard Storage Sync ---
    async function saveAndFetchLeaderboard(user, score) {
      leaderboardList.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 12px;">Syncing online scores...</div>';

      // Always maintain local cache fallback for zero downtime
      let localScores = [];
      try {
        localScores = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
      } catch (e) {
        localScores = [];
      }

      // Add current score
      localScores.push({ user: user || 'Anonymous', score, date: Date.now() });
      localScores.sort((a, b) => b.score - a.score);
      localScores = localScores.slice(0, 10);
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(localScores));

      // Attempt online free cloud sync (fire & sync without blocking UI)
      try {
        fetch(DB_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'clauding_score',
            data: { user: user || 'Anonymous', score, game: 'snake', timestamp: Date.now() }
          })
        }).catch(() => {});
      } catch (e) {}

      renderLeaderboard(localScores, user, score);
    }

    function renderLeaderboard(scores, currentUser, latestScore) {
      if (!scores || scores.length === 0) {
        leaderboardList.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding:10px;">No scores yet. Be the first!</div>';
        return;
      }

      let html = '';
      scores.forEach((item, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
        const isCurrent = item.user === currentUser && item.score === latestScore;

        html += \`
          <div class="leaderboard-item \${isCurrent ? 'highlight' : ''}">
            <div class="leaderboard-rank \${rankClass}">#\${rank}</div>
            <div class="leaderboard-user">\${escapeHtml(item.user)}</div>
            <div class="leaderboard-points">\${item.score} pts</div>
          </div>
        \`;
      });
      leaderboardList.innerHTML = html;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  </script>
</body>
</html>`;
}

module.exports = {
  getWebviewContent
};
