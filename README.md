# Clauding 🕹️

A retro arcade VS Code extension featuring warm Claude terracotta aesthetics, fluid ambient gradients, and classic mini-games to play while Claude or other AI agents execute long-running coding tasks.

---

## ✨ Features

- **Cinematic 4-Second Intro**:
  - An animated Claude star logo that spins and rolls across into the glowing **Clauding.** title.
  - Concludes with an atmospheric blur-zoom transition unveiling the Choose Game arcade menu.
  - Re-triggerable anytime simply by clicking the Clauding header logo.

- **Warm Claude Aesthetic**:
  - Fluid animated terracotta background gradients (`#d97757` & `#c15f3e`).
  - Cohesive styling inspired by the Claude brand, featuring a matched-width `ARCADE GAMES` subtitle.

- **Built-in Games**:
  - 🐍 **Pixel Snake**:
    - Relaxed **10×10** grid layout with large 32px pixel blocks and smooth ~215ms tick pace.
    - Minecraft-style pixelated snake and apple art.
    - **Continuous edge screen wrapping**: glide from left-to-right or top-to-bottom without border collision. The game only ends if the snake bites itself!
  - 🚀 **Block Invaders**:
    - High-performance 60 FPS `requestAnimationFrame` loop with delta-time physics (zero lag or jitter).
    - **Keyboard-only controls** (`A`/`D` or `←`/`→` to navigate; automatic rapid-fire blaster).
    - Battle through scrolling star dust, destructible asteroid fields, and agile enemy starfighters.

- **In-Game Pause & Exit**:
  - Press `Tab` or click the **Pause** button at any time.
  - Clean pause overlay with **Resume** and **Exit Game** options.

- **Smooth Ambient Sound Engine**:
  - Built-in Web Audio API synthesizer playing smooth lofi chord progressions (`C maj9`, `A min7`, `D min9`, `G add9`).
  - Plays softly on home and menu screens, and **automatically silences during active gameplay** so you can focus.
  - Retro sound effects for eating, turns, blaster shots, and explosions without loading external MP3 files.

- **Instant Zero-Friction Play**:
  - Single username entry with instant local high score tracking per game.
  - No unnecessary menus, signups, or heavy online dependencies.

---

## 🎮 Controls

| Action | Control |
|---|---|
| **Pause / Resume** | `Tab` key or Pause icon button |
| **Pixel Snake Move** | `Arrow Keys` or `W`, `A`, `S`, `D` |
| **Block Invaders Move** | `Arrow Left` / `Arrow Right` or `A` / `D` |
| **Block Invaders Fire** | Automatic continuous rapid-fire blaster |
| **Replay Intro** | Click the Claude logo in the top-left header |

---

## 🚀 Getting Started

### Installation & Development

1. Clone or open the repository:
   ```bash
   git clone https://github.com/pathik455/Clauding.git
   cd Clauding
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension bundle:
   ```bash
   npm run build
   ```

4. Press `F5` in VS Code to launch the Extension Development Host, or click the **Clauding** icon (`$(game)`) in the editor status bar / title bar!
