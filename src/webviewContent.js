function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Clauding</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0d0a08;
      --claude-orange: #d97757;
      --claude-orange-dark: #cc5e39;
      --claude-orange-light: #ea8a68;
      --claude-amber: #f28b55;
      --claude-surface: rgba(26, 21, 19, 0.92);
      --claude-border: rgba(217, 119, 87, 0.25);
      --claude-border-subtle: rgba(255, 255, 255, 0.08);
      --text-main: #f8fafc;
      --text-muted: #a39b94;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-drag: none;
    }

    /* Fixed Viewport: No scrollbars */
    html, body {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(6px, 1.5vh, 16px);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Ambient Ultra-Smooth Fluid Background Canvas */
    #ambientCanvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      opacity: 0.92;
      filter: blur(65px);
    }

    .container {
      width: 100%;
      max-width: 420px;
      height: 100%;
      max-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    /* ==============================================================
       4-SECOND FULL-SCREEN CINEMATIC LOGO INTRO OVERLAY
       Phase 1 (0.0s - 1.2s): Big Claude Star in center glows & expands
       Phase 2 (1.2s - 2.8s): Wheel rolls directly into "Clauding" title
       Phase 3 (2.8s - 4.0s): Atmospheric radial zoom blur transition into hero
       ============================================================== */
    #introOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle at center, #1c1410 0%, #0d0a08 80%);
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: all;
    }

    #introOverlay.zoom-fade-out {
      animation: introZoomBlurOut 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      pointer-events: none;
    }

    @keyframes introZoomBlurOut {
      0% {
        opacity: 1;
        filter: blur(0px) brightness(1);
        transform: scale(1);
      }
      45% {
        opacity: 0.85;
        filter: blur(12px) brightness(1.35);
        transform: scale(1.6);
      }
      100% {
        opacity: 0;
        filter: blur(36px) brightness(1.8);
        transform: scale(2.8);
        visibility: hidden;
      }
    }

    .intro-center-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Big Claude Star in the center */
    .intro-big-logo {
      width: 96px;
      height: 96px;
      filter: drop-shadow(0 0 35px rgba(217, 119, 87, 0.7));
      margin-bottom: 20px;
    }

    .intro-big-logo.animating {
      animation: introLogoWheelRoll 2.6s cubic-bezier(0.25, 1, 0.35, 1) forwards;
    }

    @keyframes introLogoWheelRoll {
      0% {
        transform: scale(0.6) rotate(-90deg);
        opacity: 0;
        filter: drop-shadow(0 0 10px rgba(217, 119, 87, 0.2));
      }
      22% {
        transform: scale(1.15) rotate(0deg);
        opacity: 1;
        filter: drop-shadow(0 0 45px rgba(217, 119, 87, 0.95));
      }
      45% {
        transform: scale(1) rotate(25deg);
        opacity: 1;
      }
      /* Wheel rolls forward into the text */
      68% {
        transform: scale(0.92) rotate(380deg) translateY(14px);
        filter: drop-shadow(0 0 55px rgba(242, 139, 85, 0.9));
      }
      100% {
        transform: scale(1.05) rotate(720deg) translateY(0px);
        filter: drop-shadow(0 0 40px rgba(217, 119, 87, 0.8));
      }
    }

    .intro-title-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .intro-title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.8px;
      color: #ffffff;
      display: flex;
      align-items: baseline;
      opacity: 0;
    }

    .intro-title .orange-dot {
      color: var(--claude-orange);
      font-size: 1.2em;
    }

    .intro-title.animating {
      animation: introTitleReveal 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes introTitleReveal {
      0%, 35% {
        opacity: 0;
        transform: translateY(18px) scale(0.92);
        filter: blur(8px);
      }
      65% {
        opacity: 0.9;
        transform: translateY(-2px) scale(1.04);
        filter: blur(0px);
        text-shadow: 0 0 24px rgba(217, 119, 87, 0.7);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        text-shadow: 0 0 16px rgba(217, 119, 87, 0.4);
      }
    }

    .intro-subtitle {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--claude-orange);
      letter-spacing: 4.8px;
      margin-top: 6px;
      opacity: 0;
    }

    .intro-subtitle.animating {
      animation: introSubReveal 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes introSubReveal {
      0%, 45% {
        opacity: 0;
        transform: translateY(8px);
      }
      80%, 100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Top Claude Header on Game Screen */
    .brand-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: clamp(6px, 1.2vh, 12px);
      padding: 0 4px;
      flex-shrink: 0;
    }

    .brand-left {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .claude-logo-icon {
      width: clamp(28px, 4.8vw, 36px);
      height: clamp(28px, 4.8vw, 36px);
      flex-shrink: 0;
      filter: drop-shadow(0 2px 8px rgba(217, 119, 87, 0.45));
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .claude-logo-icon:hover {
      transform: rotate(15deg) scale(1.06);
    }

    .brand-text-block {
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
      position: relative;
    }

    .brand-title {
      font-size: clamp(21px, 3.8vw, 25px);
      font-weight: 800;
      letter-spacing: -0.6px;
      color: #ffffff;
      display: flex;
      align-items: baseline;
    }

    .brand-title .orange-dot {
      color: var(--claude-orange);
      line-height: 0;
    }

    /* Subtitle 'Arcade Games' matching length of 'Clauding.' */
    .brand-subtitle {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--claude-orange);
      letter-spacing: 2.7px;
      text-align: justify;
      text-align-last: justify;
      display: block;
      width: 100%;
      margin-top: 3px;
    }

    .sound-toggle-btn {
      background: rgba(217, 119, 87, 0.14);
      border: 1px solid rgba(217, 119, 87, 0.35);
      border-radius: 20px;
      padding: clamp(4px, 0.8vh, 6px) clamp(8px, 1.5vw, 12px);
      font-size: 11.5px;
      font-weight: 600;
      color: #fde8e1;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      backdrop-filter: blur(8px);
      flex-shrink: 0;
    }

    .sound-toggle-btn:hover {
      background: rgba(217, 119, 87, 0.24);
      border-color: var(--claude-orange);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .sound-toggle-btn.muted {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
    }

    /* Screens: 1=Select, 2=Username, 3=Game, 4=Game Over */
    .screen {
      display: none;
      width: 100%;
      animation: smoothAppear 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: calc(100vh - 65px);
      flex-direction: column;
      align-items: center;
    }

    .screen.active {
      display: flex;
    }

    @keyframes smoothAppear {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .surface-card {
      background: var(--claude-surface);
      backdrop-filter: blur(28px) saturate(160%);
      -webkit-backdrop-filter: blur(28px) saturate(160%);
      border: 1px solid var(--claude-border);
      border-radius: 18px;
      padding: clamp(14px, 2.2vh, 22px);
      width: 100%;
      box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.65),
                  0 0 0 1px rgba(217, 119, 87, 0.1) inset;
    }

    h1 {
      font-size: clamp(17px, 2.8vw, 21px);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.4px;
      text-align: center;
      margin-bottom: 4px;
    }

    .subtitle {
      font-size: clamp(11px, 1.8vw, 12.5px);
      color: var(--text-muted);
      text-align: center;
      margin-bottom: clamp(12px, 2vh, 18px);
      line-height: 1.4;
    }

    .input-group {
      width: 100%;
      margin-bottom: 14px;
    }

    input[type="text"] {
      width: 100%;
      background: rgba(15, 12, 11, 0.85);
      border: 1px solid rgba(217, 119, 87, 0.35);
      border-radius: 12px;
      padding: 11px 14px;
      font-size: 13.5px;
      color: #f8fafc;
      outline: none;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    input[type="text"]:focus {
      border-color: var(--claude-orange);
      box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.25);
    }

    .btn {
      width: 100%;
      background: linear-gradient(180deg, #e0744f 0%, #c85a34 100%);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 12px;
      padding: 11px;
      font-size: 13.5px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      transition: all 0.18s ease;
      box-shadow: 0 4px 14px rgba(200, 90, 52, 0.4);
    }

    .btn:hover {
      background: linear-gradient(180deg, #ea8360 0%, #d2653f 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(217, 119, 87, 0.5);
    }

    .btn:active {
      transform: translateY(1px);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(217, 119, 87, 0.2);
      box-shadow: none;
      color: #d1c7bd;
    }

    .btn-secondary:hover {
      background: rgba(217, 119, 87, 0.12);
      border-color: rgba(217, 119, 87, 0.4);
      color: #ffffff;
    }

    /* Screen 1: Game Cards */
    .game-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      margin-bottom: 6px;
    }

    .game-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(217, 119, 87, 0.2);
      border-radius: 14px;
      padding: 14px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .game-card:hover {
      background: rgba(217, 119, 87, 0.12);
      border-color: var(--claude-orange);
      transform: translateY(-2px);
    }

    .game-card-left {
      display: flex;
      align-items: center;
      gap: 13px;
    }

    .game-icon-box {
      font-size: 24px;
      width: 44px;
      height: 44px;
      background: rgba(217, 119, 87, 0.15);
      border: 1px solid rgba(217, 119, 87, 0.3);
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .game-info h3 {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 2px;
    }

    .game-info p {
      font-size: 11.5px;
      color: var(--text-muted);
    }

    .game-best-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .game-best-badge .label {
      font-size: 9.5px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .game-best-badge .val {
      font-size: 15px;
      font-weight: 700;
      color: var(--claude-orange-light);
      font-family: 'JetBrains Mono', monospace;
    }

    /* Screen 3: Game Header with Exit & Pause */
    .game-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: clamp(6px, 1.2vh, 10px);
      padding: 0 2px;
    }

    .stat-pill {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-size: 11.5px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .stat-pill .num {
      color: var(--claude-orange-light);
      font-size: 15px;
      font-weight: 700;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .icon-btn {
      background: rgba(217, 119, 87, 0.14);
      border: 1px solid rgba(217, 119, 87, 0.3);
      border-radius: 8px;
      color: #fbeae5;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .icon-btn:hover, .icon-btn.active {
      background: rgba(217, 119, 87, 0.3);
      border-color: var(--claude-orange);
      color: #fff;
    }

    .btn-exit {
      background: rgba(239, 68, 68, 0.12);
      border-color: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .btn-exit:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: #ef4444;
      color: #fff;
    }

    /* Pixel Canvas */
    .canvas-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      max-width: 100%;
    }

    #gameCanvas {
      width: 300px;
      height: 300px;
      max-width: min(78vw, calc(100vh - 190px));
      max-height: min(78vw, calc(100vh - 190px));
      aspect-ratio: 1 / 1;
      background: #090706;
      border: 2px solid rgba(217, 119, 87, 0.35);
      border-radius: 10px;
      box-shadow: inset 0 0 16px rgba(0, 0, 0, 0.9);
      display: block;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;
      image-rendering: crisp-edges;
    }

    /* Pause Overlay */
    .pause-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(13, 10, 8, 0.88);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border-radius: 10px;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      z-index: 2;
    }

    .pause-overlay.visible {
      display: flex;
    }

    .pause-overlay h2 {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
    }

    .pause-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 150px;
      margin-top: 6px;
    }

    /* Screen 4: Game Over & High Score Screen */
    .score-summary {
      text-align: center;
      margin-bottom: 16px;
      background: rgba(217, 119, 87, 0.08);
      border-radius: 14px;
      padding: 16px;
      border: 1px solid rgba(217, 119, 87, 0.25);
    }

    .score-summary .final-score {
      font-size: 42px;
      font-weight: 800;
      color: var(--claude-orange);
      font-family: 'JetBrains Mono', monospace;
      text-shadow: 0 0 20px rgba(217, 119, 87, 0.45);
      margin-bottom: 10px;
    }

    .high-score-record {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #f5ede6;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(217, 119, 87, 0.2);
      padding: 5px 12px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
    }

    .actions {
      display: flex;
      gap: 8px;
      width: 100%;
    }
  </style>
</head>
<body>
  <!-- Ambient Smooth Fluid Background Canvas -->
  <canvas id="ambientCanvas"></canvas>

  <!-- 4-Second Cinematic Intro Overlay: Big Center Star, Wheels into Title, Blur Zoom to Hero -->
  <div id="introOverlay">
    <div class="intro-center-stage">
      <svg id="introLogo" class="intro-big-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C12.5523 2 13 2.44772 13 3V9.58579L17.6569 4.92893C18.0474 4.53841 18.6805 4.53841 19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315L14.4142 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H14.4142L19.0711 17.6569C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711C18.6805 19.4616 18.0474 19.4616 17.6569 19.0711L13 14.4142V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V14.4142L6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569L9.58579 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H9.58579L4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893L11 9.58579V3C11 2.44772 11.4477 2 12 2Z" fill="#D97757"/>
      </svg>
      <div class="intro-title-wrapper">
        <div id="introTitle" class="intro-title">Clauding<span class="orange-dot">.</span></div>
        <div id="introSubtitle" class="intro-subtitle">ARCADE GAMES</div>
      </div>
    </div>
  </div>

  <div class="container">
    <!-- Top Header -->
    <div class="brand-header">
      <div class="brand-left">
        <svg id="claudeLogo" class="claude-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="Click to replay 4-second cinematic intro">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C12.5523 2 13 2.44772 13 3V9.58579L17.6569 4.92893C18.0474 4.53841 18.6805 4.53841 19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315L14.4142 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H14.4142L19.0711 17.6569C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711C18.6805 19.4616 18.0474 19.4616 17.6569 19.0711L13 14.4142V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V14.4142L6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569L9.58579 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H9.58579L4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893L11 9.58579V3C11 2.44772 11.4477 2 12 2Z" fill="#D97757"/>
        </svg>
        <div class="brand-text-block">
          <div class="brand-title">Clauding<span class="orange-dot">.</span></div>
          <span class="brand-subtitle">ARCADE GAMES</span>
        </div>
      </div>
      <button id="soundToggleBtn" class="sound-toggle-btn" title="Toggle Background Sound">
        <span id="soundIcon">🔊</span>
        <span id="soundLabel">Background sound</span>
      </button>
    </div>

    <!-- SCREEN 1: GAME SELECTION -->
    <div id="screen-select" class="screen surface-card">
      <h1>Choose Game</h1>
      <p class="subtitle">Relax while Claude completes your background tasks</p>

      <div class="game-grid">
        <div class="game-card" id="cardSnake">
          <div class="game-card-left">
            <div class="game-icon-box">🟩</div>
            <div class="game-info">
              <h3>Pixel Snake</h3>
              <p>Relaxed 10×10 grid with seamless wraparound</p>
            </div>
          </div>
          <div class="game-best-badge">
            <span class="label">BEST</span>
            <span id="cardSnakeBest" class="val">0</span>
          </div>
        </div>

        <div class="game-card" id="cardInvaders">
          <div class="game-card-left">
            <div class="game-icon-box">🚀</div>
            <div class="game-info">
              <h3>Block Invaders</h3>
              <p>Keyboard-only rocket space defense</p>
            </div>
          </div>
          <div class="game-best-badge">
            <span class="label">BEST</span>
            <span id="cardInvadersBest" class="val">0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SCREEN 2: INITIAL USERNAME SETUP (1st launch only) -->
    <div id="screen-user" class="screen surface-card">
      <h1>Welcome Player</h1>
      <p class="subtitle">Set your gamer tag to store your high scores</p>
      
      <div class="input-group">
        <input type="text" id="usernameInput" placeholder="Enter gamer tag (e.g. Red, Neo)" maxlength="16" autofocus autocomplete="off" />
      </div>

      <button id="btnSaveUser" class="btn">
        <span>Enter Arcade</span> &rarr;
      </button>
    </div>

    <!-- SCREEN 3: GAMEPLAY SCREEN -->
    <div id="screen-game" class="screen surface-card">
      <div class="game-header">
        <div class="stat-pill">SCORE <span id="currentScore" class="num">0</span></div>
        <div class="header-actions">
          <button id="pauseBtn" class="icon-btn" title="Pause Game (Tab)">
            <span id="pauseIcon">⏸</span>
            <span id="pauseText">Pause</span>
          </button>
          <button id="exitGameBtn" class="icon-btn btn-exit" title="Exit to Menu">
            <span>✕ Exit</span>
          </button>
        </div>
        <div class="stat-pill">BEST <span id="highScore" class="num">0</span></div>
      </div>

      <div class="canvas-container">
        <canvas id="gameCanvas" width="320" height="320"></canvas>
        <div id="pauseOverlay" class="pause-overlay">
          <h2>Paused</h2>
          <div class="pause-actions">
            <button id="overlayResumeBtn" class="btn" style="padding: 8px;">Resume (Tab)</button>
            <button id="overlayExitBtn" class="btn btn-secondary" style="padding: 8px;">Exit Game</button>
          </div>
        </div>
      </div>
    </div>

    <!-- SCREEN 4: GAME OVER & HIGH SCORE SCREEN -->
    <div id="screen-leaderboard" class="screen surface-card">
      <h1 id="gameOverTitle">Game Over</h1>
      <p class="subtitle" style="margin-bottom: 12px;">Great run! Keep challenging your record.</p>
      
      <div class="score-summary">
        <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 2px; letter-spacing: 0.5px;">YOUR SCORE</p>
        <div id="finalScoreDisplay" class="final-score">0</div>
        <div class="high-score-record">
          <span>🏆 ALL-TIME BEST:</span>
          <span id="finalHighScoreDisplay" style="color: var(--claude-orange);">0</span>
        </div>
      </div>

      <div class="actions">
        <button id="btnPlayAgain" class="btn" style="flex: 1;">Play Again</button>
        <button id="btnMenu" class="btn btn-secondary" style="flex: 1;">Games Menu</button>
      </div>
    </div>
  </div>

  <script>
    // --- 0. 4-SECOND FULL-SCREEN CINEMATIC INTRO ---
    const introOverlay = document.getElementById('introOverlay');
    const introLogo = document.getElementById('introLogo');
    const introTitle = document.getElementById('introTitle');
    const introSubtitle = document.getElementById('introSubtitle');

    function run4SecondCinematicIntro() {
      introOverlay.style.display = 'flex';
      introOverlay.classList.remove('zoom-fade-out');

      introLogo.classList.remove('animating');
      introTitle.classList.remove('animating');
      introSubtitle.classList.remove('animating');
      void introLogo.offsetWidth; // trigger reflow

      // Phase 1 & 2: Big Star Rolls into Clauding Title (0 - 2.8s)
      introLogo.classList.add('animating');
      introTitle.classList.add('animating');
      introSubtitle.classList.add('animating');

      // Phase 3: At ~2.9s, start the blur zoom outward into the choose game hero page
      setTimeout(() => {
        introOverlay.classList.add('zoom-fade-out');
      }, 2900);

      // At 4.0s: fully completed, hide overlay
      setTimeout(() => {
        introOverlay.style.display = 'none';
      }, 4000);
    }

    // Run automatically on launch / reopen
    run4SecondCinematicIntro();

    // Replay anytime if user clicks the header logo
    document.getElementById('claudeLogo').addEventListener('click', run4SecondCinematicIntro);


    // --- 1. Organic Smooth Fluid Gradient Simulation ---
    const fluidCanvas = document.getElementById('ambientCanvas');
    const fCtx = fluidCanvas.getContext('2d');
    let fluidPoints = [];

    function resizeFluid() {
      fluidCanvas.width = window.innerWidth;
      fluidCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeFluid);
    resizeFluid();

    const fluidColors = [
      { r: 217, g: 119, b: 87 },  // Claude Terracotta
      { r: 170, g: 65, b: 35 },   // Warm Umber
      { r: 242, g: 139, b: 85 },  // Amber Glow
      { r: 194, g: 90, b: 52 },   // Coral
      { r: 140, g: 45, b: 25 },   // Deep Rust
      { r: 234, g: 145, b: 110 }  // Soft Peach
    ];

    for (let i = 0; i < 6; i++) {
      fluidPoints.push({
        baseX: Math.random() * fluidCanvas.width,
        baseY: Math.random() * fluidCanvas.height,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.002 + Math.random() * 0.003,
        speedY: 0.002 + Math.random() * 0.003,
        ampX: 180 + Math.random() * 120,
        ampY: 180 + Math.random() * 120,
        radius: Math.min(fluidCanvas.width, fluidCanvas.height) * (0.6 + Math.random() * 0.3),
        color: fluidColors[i % fluidColors.length]
      });
    }

    let fluidTime = 0;
    function renderFluid() {
      fluidTime += 1;
      fCtx.fillStyle = '#090706';
      fCtx.fillRect(0, 0, fluidCanvas.width, fluidCanvas.height);

      fluidPoints.forEach(p => {
        const x = p.baseX + Math.sin(p.phaseX + fluidTime * p.speedX) * p.ampX;
        const y = p.baseY + Math.cos(p.phaseY + fluidTime * p.speedY) * p.ampY;

        const grad = fCtx.createRadialGradient(x, y, 0, x, y, p.radius);
        grad.addColorStop(0, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ', 0.65)');
        grad.addColorStop(0.5, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ', 0.2)');
        grad.addColorStop(1, 'rgba(9, 7, 6, 0)');

        fCtx.fillStyle = grad;
        fCtx.beginPath();
        fCtx.arc(x, y, p.radius, 0, Math.PI * 2);
        fCtx.fill();
      });

      requestAnimationFrame(renderFluid);
    }
    requestAnimationFrame(renderFluid);


    // --- 2. Smooth Ambient Chime & Warm Pad Synthesizer ---
    const SmoothAudioEngine = {
      ctx: null,
      masterGain: null,
      musicGain: null,
      sfxGain: null,
      isPlayingMusic: false,
      isMuted: false,
      ambientTimer: null,

      init() {
        if (!this.ctx) {
          try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            this.sfxGain.connect(this.masterGain);
          } catch (e) {
            console.error('Audio init error', e);
            return;
          }
        }

        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      },

      toggleMute() {
        this.init();
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime, 0.08);
        }
        return this.isMuted;
      },

      startSmoothTheme() {
        this.init();
        if (this.isPlayingMusic || !this.ctx) return;
        this.isPlayingMusic = true;

        const chordSets = [
          [130.81, 196.00, 261.63, 329.63, 392.00], // C maj9
          [110.00, 164.81, 220.00, 261.63, 329.63], // A min7
          [146.83, 220.00, 293.66, 349.23, 440.00], // D min9
          [123.47, 196.00, 246.94, 293.66, 392.00]  // G add9
        ];

        let idx = 0;

        const playWarmPad = () => {
          if (!this.ctx || !this.isPlayingMusic) return;
          if (this.ctx.state === 'suspended') this.ctx.resume();

          const now = this.ctx.currentTime;
          const freqs = chordSets[idx];
          const duration = 5.2;

          if (!this.isMuted) {
            freqs.forEach((freq, i) => {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              const filter = this.ctx.createBiquadFilter();

              osc.type = i === 0 ? 'sine' : 'triangle';
              osc.frequency.setValueAtTime(freq, now);
              osc.detune.setValueAtTime((Math.random() - 0.5) * 4, now);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(450, now);
              filter.Q.setValueAtTime(1.0, now);

              gain.gain.setValueAtTime(0.001, now);
              gain.gain.linearRampToValueAtTime(0.09 / (i + 1), now + 1.8);
              gain.gain.linearRampToValueAtTime(0.001, now + duration);

              osc.connect(filter);
              filter.connect(gain);
              gain.connect(this.musicGain);

              osc.start(now);
              osc.stop(now + duration + 0.5);
            });
          }

          idx = (idx + 1) % chordSets.length;
          this.ambientTimer = setTimeout(playWarmPad, 4600);
        };

        playWarmPad();
      },

      stopSmoothTheme() {
        this.isPlayingMusic = false;
        if (this.ambientTimer) {
          clearTimeout(this.ambientTimer);
          this.ambientTimer = null;
        }
      },

      playLaser() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.08);
        } catch (e) {}
      },

      playExplosion() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(25, now + 0.28);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.28);
        } catch (e) {}
      },

      playEat() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.08);
        } catch (e) {}
      },

      playTurn() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          gain.gain.setValueAtTime(0.02, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.03);
        } catch (e) {}
      }
    };

    // Unlock audio on first interaction
    const unlockAudio = () => {
      SmoothAudioEngine.init();
      if (currentScreenId === 'screen-select' || currentScreenId === 'screen-user') {
        SmoothAudioEngine.startSmoothTheme();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Audio Toggle Button
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = document.getElementById('soundLabel');
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const muted = SmoothAudioEngine.toggleMute();
      if (muted) {
        soundToggleBtn.classList.add('muted');
        soundIcon.textContent = '🔇';
        soundLabel.textContent = 'Background sound';
      } else {
        soundToggleBtn.classList.remove('muted');
        soundIcon.textContent = '🔊';
        soundLabel.textContent = 'Background sound';
      }
    });

    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    }, { passive: false });

    // --- State & Navigation ---
    const STORAGE_KEY = 'clauding_username';
    let username = localStorage.getItem(STORAGE_KEY) || '';
    let currentScore = 0;
    let activeGameType = 'snake';
    let isGameRunning = false;
    let isGamePaused = false;
    let animFrameId = null;
    let currentScreenId = 'screen-select';

    function getHighScoreKey() {
      return 'clauding_highscore_' + activeGameType;
    }

    function refreshBestScoresUI() {
      const snakeBest = localStorage.getItem('clauding_highscore_snake') || '0';
      const invadersBest = localStorage.getItem('clauding_highscore_invaders') || '0';
      document.getElementById('cardSnakeBest').textContent = snakeBest;
      document.getElementById('cardInvadersBest').textContent = invadersBest;
    }

    function showScreen(screenId) {
      currentScreenId = screenId;
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const target = document.getElementById(screenId);
      if (target) target.classList.add('active');

      if (screenId === 'screen-select' || screenId === 'screen-user') {
        refreshBestScoresUI();
        SmoothAudioEngine.startSmoothTheme();
      } else {
        SmoothAudioEngine.stopSmoothTheme();
      }
    }

    const usernameInput = document.getElementById('usernameInput');
    const btnSaveUser = document.getElementById('btnSaveUser');
    const cardSnake = document.getElementById('cardSnake');
    const cardInvaders = document.getElementById('cardInvaders');
    const currentScoreEl = document.getElementById('currentScore');
    const highScoreEl = document.getElementById('highScore');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const finalHighScoreDisplay = document.getElementById('finalHighScoreDisplay');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const btnPlayAgain = document.getElementById('btnPlayAgain');
    const btnMenu = document.getElementById('btnMenu');
    const pauseBtn = document.getElementById('pauseBtn');
    const exitGameBtn = document.getElementById('exitGameBtn');
    const pauseOverlay = document.getElementById('pauseOverlay');
    const pauseIcon = document.getElementById('pauseIcon');
    const pauseText = document.getElementById('pauseText');
    const overlayResumeBtn = document.getElementById('overlayResumeBtn');
    const overlayExitBtn = document.getElementById('overlayExitBtn');

    if (!username) {
      showScreen('screen-user');
    } else {
      showScreen('screen-select');
    }

    btnSaveUser.addEventListener('click', () => {
      const val = usernameInput.value.trim();
      username = val || 'Player';
      localStorage.setItem(STORAGE_KEY, username);
      showScreen('screen-select');
    });

    usernameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnSaveUser.click();
    });

    // Launch Games
    cardSnake.addEventListener('click', () => {
      activeGameType = 'snake';
      startSnakeGame();
    });

    cardInvaders.addEventListener('click', () => {
      activeGameType = 'invaders';
      startInvadersGame();
    });

    btnPlayAgain.addEventListener('click', () => {
      if (activeGameType === 'snake') startSnakeGame();
      else startInvadersGame();
    });

    btnMenu.addEventListener('click', () => {
      exitActiveGame();
    });

    function exitActiveGame() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      isGameRunning = false;
      isGamePaused = false;
      updatePauseUI();
      showScreen('screen-select');
    }

    exitGameBtn.addEventListener('click', () => exitActiveGame());
    overlayExitBtn.addEventListener('click', () => exitActiveGame());

    function togglePause() {
      if (!isGameRunning) return;
      isGamePaused = !isGamePaused;
      updatePauseUI();
    }

    function updatePauseUI() {
      if (isGamePaused) {
        pauseOverlay.classList.add('visible');
        pauseBtn.classList.add('active');
        pauseIcon.textContent = '▶';
        pauseText.textContent = 'Resume';
      } else {
        pauseOverlay.classList.remove('visible');
        pauseBtn.classList.remove('active');
        pauseIcon.textContent = '⏸';
        pauseText.textContent = 'Pause';
      }
    }

    pauseBtn.addEventListener('click', () => togglePause());
    overlayResumeBtn.addEventListener('click', () => togglePause());

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const WIDTH = 320;
    const HEIGHT = 320;

    // ==========================================
    // GAME 1: PIXEL SNAKE (10x10 Grid, Slower Pacing)
    // ==========================================
    const TILE_COUNT = 10;
    const GRID_SIZE = WIDTH / TILE_COUNT; // 32px

    let snake = [];
    let snakeVelocity = { x: 0, y: 0 };
    let snakeNextVelocity = { x: 0, y: 0 };
    let apple = { x: 3, y: 3 };
    let snakeLastTick = 0;
    let snakeTickInterval = 215;

    function startSnakeGame() {
      showScreen('screen-game');
      currentScore = 0;
      currentScoreEl.textContent = '0';
      const best = parseInt(localStorage.getItem(getHighScoreKey()) || '0', 10);
      highScoreEl.textContent = best.toString();

      snake = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 }
      ];
      snakeVelocity = { x: 0, y: -1 };
      snakeNextVelocity = { x: 0, y: -1 };
      snakeTickInterval = 215;
      isGameRunning = true;
      isGamePaused = false;
      snakeLastTick = performance.now();
      updatePauseUI();

      placeApple();
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(snakeLoop);
    }

    function placeApple() {
      let valid = false;
      while (!valid) {
        apple.x = Math.floor(Math.random() * TILE_COUNT);
        apple.y = Math.floor(Math.random() * TILE_COUNT);
        valid = !snake.some(s => s.x === apple.x && s.y === apple.y);
      }
    }

    function snakeLoop(timestamp) {
      if (!isGameRunning) return;

      if (!isGamePaused) {
        if (timestamp - snakeLastTick >= snakeTickInterval) {
          snakeLastTick = timestamp;
          tickSnake();
        }
        drawSnake();
      }

      if (isGameRunning) {
        animFrameId = requestAnimationFrame(snakeLoop);
      }
    }

    function tickSnake() {
      snakeVelocity = { ...snakeNextVelocity };

      let newX = snake[0].x + snakeVelocity.x;
      let newY = snake[0].y + snakeVelocity.y;

      if (newX < 0) newX = TILE_COUNT - 1;
      else if (newX >= TILE_COUNT) newX = 0;

      if (newY < 0) newY = TILE_COUNT - 1;
      else if (newY >= TILE_COUNT) newY = 0;

      const head = { x: newX, y: newY };

      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver('Snake Bit Itself!');
        return;
      }

      snake.unshift(head);

      if (head.x === apple.x && head.y === apple.y) {
        currentScore += 10;
        currentScoreEl.textContent = currentScore.toString();
        SmoothAudioEngine.playEat();
        placeApple();

        const best = parseInt(localStorage.getItem(getHighScoreKey()) || '0', 10);
        if (currentScore > best) {
          localStorage.setItem(getHighScoreKey(), currentScore.toString());
          highScoreEl.textContent = currentScore.toString();
        }

        if (snakeTickInterval > 140 && currentScore % 30 === 0) {
          snakeTickInterval -= 4;
        }
      } else {
        snake.pop();
      }
    }

    function drawSnake() {
      ctx.fillStyle = '#090706';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = 'rgba(217, 119, 87, 0.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= WIDTH; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, HEIGHT);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(WIDTH, i);
        ctx.stroke();
      }

      // Apple
      const ax = apple.x * GRID_SIZE;
      const ay = apple.y * GRID_SIZE;

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ax + 4, ay + 6, 24, 22);
      ctx.fillStyle = '#090706';
      ctx.fillRect(ax + 4, ay + 6, 4, 4);
      ctx.fillRect(ax + 24, ay + 6, 4, 4);
      ctx.fillRect(ax + 4, ay + 24, 4, 4);
      ctx.fillRect(ax + 24, ay + 24, 4, 4);

      ctx.fillStyle = '#991b1b';
      ctx.fillRect(ax + 8, ay + 20, 16, 6);
      ctx.fillRect(ax + 22, ay + 10, 4, 12);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ax + 8, ay + 10, 4, 4);

      ctx.fillStyle = '#78350f';
      ctx.fillRect(ax + 14, ay + 2, 4, 6);

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(ax + 18, ay + 2, 4, 4);

      // Snake Segments
      snake.forEach((seg, i) => {
        const x = seg.x * GRID_SIZE;
        const y = seg.y * GRID_SIZE;

        if (i === 0) {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(x + 2, y + 2, 28, 28);
          ctx.strokeStyle = '#14532d';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 3, y + 3, 26, 26);

          ctx.fillStyle = '#4ade80';
          ctx.fillRect(x + 6, y + 6, 20, 4);

          ctx.fillStyle = '#ffffff';
          let e1 = { x: x + 6, y: y + 6 };
          let e2 = { x: x + 20, y: y + 6 };
          if (snakeVelocity.x === 1) { e1 = { x: x + 20, y: y + 6 }; e2 = { x: x + 20, y: y + 20 }; }
          else if (snakeVelocity.x === -1) { e1 = { x: x + 6, y: y + 6 }; e2 = { x: x + 6, y: y + 20 }; }
          else if (snakeVelocity.y === 1) { e1 = { x: x + 6, y: y + 20 }; e2 = { x: x + 20, y: y + 20 }; }

          ctx.fillRect(e1.x, e1.y, 6, 6);
          ctx.fillRect(e2.x, e2.y, 6, 6);

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(e1.x + 2, e1.y + 2, 3, 3);
          ctx.fillRect(e2.x + 2, e2.y + 2, 3, 3);
        } else {
          const isEven = (i % 2 === 0);
          ctx.fillStyle = isEven ? '#15803d' : '#166534';
          ctx.fillRect(x + 2, y + 2, 28, 28);

          ctx.fillStyle = isEven ? '#22c55e' : '#15803d';
          ctx.fillRect(x + 8, y + 8, 16, 16);

          ctx.strokeStyle = '#052e16';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 3, y + 3, 26, 26);
        }
      });
    }

    // ==========================================
    // GAME 2: BLOCK INVADERS (Ultra-Smooth 60FPS Delta-time, Key-only)
    // ==========================================
    let playerRocket = { x: 148, y: 282, width: 24, height: 26, speed: 220 };
    let bullets = [];
    let asteroids = [];
    let enemyRockets = [];
    let stars = [];
    let invaderKeys = { left: false, right: false };
    let lastBulletTime = 0;
    let invaderPrevTime = 0;
    let difficultyTimer = 0;

    function initStars() {
      stars = [];
      for (let i = 0; i < 35; i++) {
        stars.push({
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT,
          speed: 25 + Math.random() * 55,
          size: Math.random() > 0.85 ? 2 : 1
        });
      }
    }

    function startInvadersGame() {
      showScreen('screen-game');
      currentScore = 0;
      currentScoreEl.textContent = '0';
      const best = parseInt(localStorage.getItem(getHighScoreKey()) || '0', 10);
      highScoreEl.textContent = best.toString();

      playerRocket = { x: 148, y: 282, width: 24, height: 26, speed: 220 };
      bullets = [];
      asteroids = [];
      enemyRockets = [];
      difficultyTimer = 0;
      lastBulletTime = 0;
      invaderKeys = { left: false, right: false };
      initStars();

      isGameRunning = true;
      isGamePaused = false;
      invaderPrevTime = performance.now();
      updatePauseUI();

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(invadersLoop);
    }

    function invadersLoop(timestamp) {
      if (!isGameRunning) return;

      const dt = Math.min((timestamp - invaderPrevTime) / 1000, 0.05);
      invaderPrevTime = timestamp;

      if (!isGamePaused) {
        tickInvaders(dt, timestamp);
        drawInvaders();
      }

      if (isGameRunning) {
        animFrameId = requestAnimationFrame(invadersLoop);
      }
    }

    function tickInvaders(dt, now) {
      difficultyTimer += dt;

      if (invaderKeys.left && playerRocket.x > 6) {
        playerRocket.x -= playerRocket.speed * dt;
        if (playerRocket.x < 6) playerRocket.x = 6;
      }
      if (invaderKeys.right && playerRocket.x < WIDTH - playerRocket.width - 6) {
        playerRocket.x += playerRocket.speed * dt;
        if (playerRocket.x > WIDTH - playerRocket.width - 6) playerRocket.x = WIDTH - playerRocket.width - 6;
      }

      if (now - lastBulletTime > 200) {
        bullets.push({
          x: playerRocket.x + playerRocket.width / 2 - 2,
          y: playerRocket.y - 4,
          width: 4,
          height: 8,
          speed: 380
        });
        SmoothAudioEngine.playLaser();
        lastBulletTime = now;
      }

      stars.forEach(s => {
        s.y += s.speed * dt;
        if (s.y > HEIGHT) {
          s.y = 0;
          s.x = Math.random() * WIDTH;
        }
      });

      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed * dt;
        if (bullets[i].y < -12) {
          bullets.splice(i, 1);
        }
      }

      const spawnChance = Math.min(0.015 + difficultyTimer * 0.0002, 0.045);
      if (Math.random() < spawnChance) {
        const size = 16 + Math.floor(Math.random() * 16);
        asteroids.push({
          x: Math.random() * (WIDTH - size),
          y: -size,
          size: size,
          speed: 65 + Math.random() * 65 + Math.min(difficultyTimer * 1.5, 90),
          hp: size > 24 ? 2 : 1
        });
      }

      const enemyChance = Math.min(0.004 + difficultyTimer * 0.0001, 0.012);
      if (Math.random() < enemyChance && enemyRockets.length < 2) {
        enemyRockets.push({
          x: Math.random() * (WIDTH - 24),
          y: -28,
          width: 22,
          height: 22,
          speedY: 70 + Math.random() * 50,
          speedX: 55,
          dir: Math.random() > 0.5 ? 1 : -1
        });
      }

      for (let i = asteroids.length - 1; i >= 0; i--) {
        const ast = asteroids[i];
        ast.y += ast.speed * dt;

        if (
          ast.x < playerRocket.x + playerRocket.width - 2 &&
          ast.x + ast.size > playerRocket.x + 2 &&
          ast.y < playerRocket.y + playerRocket.height - 2 &&
          ast.y + ast.size > playerRocket.y + 2
        ) {
          SmoothAudioEngine.playExplosion();
          gameOver('Rocket Hit an Asteroid!');
          return;
        }

        for (let b = bullets.length - 1; b >= 0; b--) {
          const blt = bullets[b];
          if (
            blt.x < ast.x + ast.size &&
            blt.x + blt.width > ast.x &&
            blt.y < ast.y + ast.size &&
            blt.y + blt.height > ast.y
          ) {
            bullets.splice(b, 1);
            ast.hp--;
            if (ast.hp <= 0) {
              currentScore += 15;
              currentScoreEl.textContent = currentScore.toString();
              SmoothAudioEngine.playExplosion();
              asteroids.splice(i, 1);
              updateBestScore();
            }
            break;
          }
        }

        if (ast && ast.y > HEIGHT + 20) {
          asteroids.splice(i, 1);
        }
      }

      for (let i = enemyRockets.length - 1; i >= 0; i--) {
        const enm = enemyRockets[i];
        enm.y += enm.speedY * dt;
        enm.x += enm.dir * enm.speedX * dt;

        if (enm.x < 4 || enm.x > WIDTH - enm.width - 4) {
          enm.dir *= -1;
        }

        if (
          enm.x < playerRocket.x + playerRocket.width - 2 &&
          enm.x + enm.width > playerRocket.x + 2 &&
          enm.y < playerRocket.y + playerRocket.height - 2 &&
          enm.y + enm.height > playerRocket.y + 2
        ) {
          SmoothAudioEngine.playExplosion();
          gameOver('Crashed into Enemy Starfighter!');
          return;
        }

        for (let b = bullets.length - 1; b >= 0; b--) {
          const blt = bullets[b];
          if (
            blt.x < enm.x + enm.width &&
            blt.x + blt.width > enm.x &&
            blt.y < enm.y + enm.height &&
            blt.y + blt.height > enm.y
          ) {
            bullets.splice(b, 1);
            currentScore += 35;
            currentScoreEl.textContent = currentScore.toString();
            SmoothAudioEngine.playExplosion();
            enemyRockets.splice(i, 1);
            updateBestScore();
            break;
          }
        }

        if (enm && enm.y > HEIGHT + 30) {
          enemyRockets.splice(i, 1);
        }
      }
    }

    function updateBestScore() {
      const best = parseInt(localStorage.getItem(getHighScoreKey()) || '0', 10);
      if (currentScore > best) {
        localStorage.setItem(getHighScoreKey(), currentScore.toString());
        highScoreEl.textContent = currentScore.toString();
      }
    }

    function drawInvaders() {
      ctx.fillStyle = '#060504';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = '#ffffff';
      stars.forEach(s => ctx.fillRect(s.x, s.y, s.size, s.size));

      ctx.fillStyle = '#fb923c';
      bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(b.x + 1, b.y + 1, b.width - 2, b.height - 2);
        ctx.fillStyle = '#fb923c';
      });

      asteroids.forEach(a => {
        ctx.fillStyle = '#78716c';
        ctx.fillRect(a.x, a.y, a.size, a.size);
        ctx.fillStyle = '#060504';
        ctx.fillRect(a.x, a.y, 3, 3);
        ctx.fillRect(a.x + a.size - 3, a.y, 3, 3);
        ctx.fillRect(a.x, a.y + a.size - 3, 3, 3);
        ctx.fillRect(a.x + a.size - 3, a.y + a.size - 3, 3, 3);
        ctx.fillStyle = '#44403c';
        ctx.fillRect(a.x + 4, a.y + 4, 4, 4);
        ctx.fillRect(a.x + a.size - 7, a.y + a.size - 7, 3, 3);
      });

      enemyRockets.forEach(e => {
        const x = e.x;
        const y = e.y;
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 6, y, 10, 16);
        ctx.fillRect(x, y + 6, 22, 6);
        ctx.fillStyle = '#f87171';
        ctx.fillRect(x + 8, y + 4, 6, 6);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(x + 2, y + 14, 4, 4);
        ctx.fillRect(x + 16, y + 14, 4, 4);
      });

      const rx = playerRocket.x;
      const ry = playerRocket.y;

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(rx + 8, ry + 4, 8, 16);
      ctx.fillStyle = '#d97757';
      ctx.fillRect(rx + 9, ry, 6, 4);
      ctx.fillRect(rx + 10, ry - 2, 4, 2);
      ctx.fillStyle = '#d97757';
      ctx.fillRect(rx + 2, ry + 12, 6, 10);
      ctx.fillRect(rx + 16, ry + 12, 6, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(rx + 10, ry + 6, 4, 5);

      if (Math.random() > 0.3) {
        ctx.fillStyle = '#f97316';
        ctx.fillRect(rx + 9, ry + 20, 6, 5);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(rx + 10, ry + 22, 4, 3);
      }
    }

    // ==========================================
    // SCREEN 4: GAME OVER & HIGH SCORE RECORD
    // ==========================================
    function gameOver(reason) {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      isGameRunning = false;
      isGamePaused = false;
      updatePauseUI();

      gameOverTitle.textContent = reason || 'Game Over';
      finalScoreDisplay.textContent = currentScore.toString();

      const bestKey = getHighScoreKey();
      let bestScore = parseInt(localStorage.getItem(bestKey) || '0', 10);
      if (currentScore > bestScore) {
        bestScore = currentScore;
        localStorage.setItem(bestKey, bestScore.toString());
      }
      finalHighScoreDisplay.textContent = bestScore.toString();

      showScreen('screen-leaderboard');
    }

    // Controls
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        if (isGameRunning) togglePause();
        return;
      }

      if (!isGameRunning || isGamePaused) return;

      if (activeGameType === 'snake') {
        if (['ArrowUp', 'KeyW'].includes(e.code) && snakeVelocity.y !== 1) {
          snakeNextVelocity = { x: 0, y: -1 };
          SmoothAudioEngine.playTurn();
        } else if (['ArrowDown', 'KeyS'].includes(e.code) && snakeVelocity.y !== -1) {
          snakeNextVelocity = { x: 0, y: 1 };
          SmoothAudioEngine.playTurn();
        } else if (['ArrowLeft', 'KeyA'].includes(e.code) && snakeVelocity.x !== 1) {
          snakeNextVelocity = { x: -1, y: 0 };
          SmoothAudioEngine.playTurn();
        } else if (['ArrowRight', 'KeyD'].includes(e.code) && snakeVelocity.x !== -1) {
          snakeNextVelocity = { x: 1, y: 0 };
          SmoothAudioEngine.playTurn();
        }
      } else if (activeGameType === 'invaders') {
        if (['ArrowLeft', 'KeyA'].includes(e.code)) invaderKeys.left = true;
        else if (['ArrowRight', 'KeyD'].includes(e.code)) invaderKeys.right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (activeGameType === 'invaders') {
        if (['ArrowLeft', 'KeyA'].includes(e.code)) invaderKeys.left = false;
        else if (['ArrowRight', 'KeyD'].includes(e.code)) invaderKeys.right = false;
      }
    });
  </script>
</body>
</html>`;
}

module.exports = {
  getWebviewContent
};
