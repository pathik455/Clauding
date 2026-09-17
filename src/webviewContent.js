function getWebviewContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Clauding</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0d0a08;
      --claude-orange: #d97757;
      --claude-orange-dark: #cc5e39;
      --claude-orange-light: #ea8a68;
      --claude-amber: #f28b55;
      --claude-surface: rgba(26, 21, 19, 0.94);
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
      max-width: 440px;
      height: 100%;
      max-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    /* 4-SECOND CINEMATIC INTRO */
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
      0% { transform: scale(0.6) rotate(-90deg); opacity: 0; }
      22% { transform: scale(1.15) rotate(0deg); opacity: 1; filter: drop-shadow(0 0 45px rgba(217, 119, 87, 0.95)); }
      45% { transform: scale(1) rotate(25deg); opacity: 1; }
      68% { transform: scale(0.92) rotate(380deg) translateY(14px); filter: drop-shadow(0 0 55px rgba(242, 139, 85, 0.9)); }
      100% { transform: scale(1.05) rotate(720deg) translateY(0px); filter: drop-shadow(0 0 40px rgba(217, 119, 87, 0.8)); }
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
      0%, 35% { opacity: 0; transform: translateY(18px) scale(0.92); filter: blur(8px); }
      65% { opacity: 0.9; transform: translateY(-2px) scale(1.04); filter: blur(0px); text-shadow: 0 0 24px rgba(217, 119, 87, 0.7); }
      100% { opacity: 1; transform: translateY(0) scale(1); text-shadow: 0 0 16px rgba(217, 119, 87, 0.4); }
    }

    .intro-subtitle {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--claude-orange);
      margin-top: 6px;
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 2px;
    }

    .intro-subtitle .sub-word { letter-spacing: 3px; }
    .intro-subtitle .sub-dot { color: var(--claude-amber); font-size: 8px; opacity: 0.8; }
    .intro-subtitle.animating { animation: introSubReveal 2.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @keyframes introSubReveal {
      0%, 45% { opacity: 0; transform: translateY(8px); }
      80%, 100% { opacity: 1; transform: translateY(0); }
    }

    /* Top Claude Header */
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
    .claude-logo-icon:hover { transform: rotate(15deg) scale(1.06); }

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

    .brand-title .orange-dot { color: var(--claude-orange); line-height: 0; }

    .brand-subtitle {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--claude-orange);
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 3px;
    }

    .brand-subtitle .sub-word { letter-spacing: 2.2px; }
    .brand-subtitle .sub-dot { color: var(--claude-amber); font-size: 7px; opacity: 0.7; }

    /* Sound Button strictly Sound / Muted */
    .sound-toggle-btn {
      background: rgba(217, 119, 87, 0.14);
      border: 1px solid rgba(217, 119, 87, 0.35);
      border-radius: 20px;
      padding: clamp(4px, 0.8vh, 6px) clamp(8px, 1.5vw, 12px);
      font-size: 11px;
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

    .screen {
      display: none;
      width: 100%;
      animation: smoothAppear 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: calc(100vh - 65px);
      flex-direction: column;
      align-items: center;
    }

    .screen.active { display: flex; }

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
      padding: clamp(12px, 2vh, 18px);
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
      margin-bottom: 3px;
    }

    .subtitle {
      font-size: clamp(11px, 1.8vw, 12px);
      color: var(--text-muted);
      text-align: center;
      margin-bottom: clamp(10px, 1.6vh, 14px);
      line-height: 1.35;
    }

    .input-group { width: 100%; margin-bottom: 14px; }

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
      padding: 10px;
      font-size: 13px;
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

    .btn:active { transform: translateY(1px); }

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

    /* Games List */
    .game-grid {
      display: flex;
      flex-direction: column;
      gap: 9px;
      width: 100%;
      max-height: calc(100vh - 170px);
      overflow-y: auto;
      padding-right: 4px;
      margin-bottom: 4px;
    }

    .game-grid::-webkit-scrollbar { width: 5px; }
    .game-grid::-webkit-scrollbar-thumb {
      background: rgba(217, 119, 87, 0.35);
      border-radius: 4px;
    }

    .game-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(217, 119, 87, 0.2);
      border-radius: 13px;
      padding: 10px 14px;
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

    .game-card-featured {
      background: linear-gradient(135deg, rgba(217, 119, 87, 0.16) 0%, rgba(26, 21, 19, 0.6) 100%);
      border: 1px solid rgba(242, 139, 85, 0.45);
      box-shadow: 0 4px 16px rgba(217, 119, 87, 0.15);
    }

    .game-card-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Cohesive Pixel Icon Box Pattern */
    .pixel-icon-box {
      width: 44px;
      height: 44px;
      background: rgba(18, 14, 12, 0.95);
      border: 1.5px solid rgba(217, 119, 87, 0.35);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
    }

    .pixel-icon-svg {
      width: 28px;
      height: 28px;
      image-rendering: pixelated;
      shape-rendering: crispEdges;
    }

    .game-info h3 {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tag-badge {
      font-size: 9px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(242, 139, 85, 0.25);
      color: var(--claude-amber);
      border: 1px solid rgba(242, 139, 85, 0.4);
      letter-spacing: 0.4px;
    }

    .game-info p {
      font-size: 11px;
      color: var(--text-muted);
    }

    .game-best-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .game-best-badge .label {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }

    .game-best-badge .val {
      font-size: 14px;
      font-weight: 700;
      color: var(--claude-orange-light);
      font-family: 'JetBrains Mono', monospace;
    }

    /* Gameplay Screen HUD */
    .game-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: clamp(6px, 1vh, 10px);
      padding: 0 2px;
    }

    .stat-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stat-pill {
      display: flex;
      align-items: baseline;
      gap: 5px;
      font-size: 11px;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    .stat-pill .num {
      color: var(--claude-orange-light);
      font-size: 14px;
      font-weight: 700;
    }

    .stat-pill.special-stat {
      color: #38bdf8;
    }
    .stat-pill.special-stat .num {
      color: #7dd3fc;
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
      padding: 4px 9px;
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

    .canvas-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      max-width: 100%;
    }

    #gameCanvas {
      width: 320px;
      height: 320px;
      max-width: min(82vw, calc(100vh - 180px));
      max-height: min(82vw, calc(100vh - 180px));
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

    .pause-overlay.visible { display: flex; }
    .pause-overlay h2 { font-size: 20px; font-weight: 700; color: #ffffff; }

    .pause-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 150px;
      margin-top: 6px;
    }

    .controls-hint {
      margin-top: 8px;
      font-size: 11px;
      color: var(--text-muted);
      text-align: center;
      width: 100%;
    }

    .controls-hint kbd {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(217, 119, 87, 0.3);
      border-radius: 4px;
      padding: 1px 5px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: #fde8e1;
    }

    /* Screen 4: Game Over */
    .score-summary {
      text-align: center;
      margin-bottom: 14px;
      background: rgba(217, 119, 87, 0.08);
      border-radius: 14px;
      padding: 14px;
      border: 1px solid rgba(217, 119, 87, 0.25);
    }

    .score-summary .final-score {
      font-size: 40px;
      font-weight: 800;
      color: var(--claude-orange);
      font-family: 'JetBrains Mono', monospace;
      text-shadow: 0 0 20px rgba(217, 119, 87, 0.45);
      margin-bottom: 8px;
    }

    .high-score-record {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
      font-weight: 600;
      color: #f5ede6;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(217, 119, 87, 0.2);
      padding: 4px 11px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
    }

    .actions { display: flex; gap: 8px; width: 100%; }
  </style>
</head>
<body>
  <canvas id="ambientCanvas"></canvas>

  <!-- 4-Second Cinematic Intro -->
  <div id="introOverlay">
    <div class="intro-center-stage">
      <svg id="introLogo" class="intro-big-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C12.5523 2 13 2.44772 13 3V9.58579L17.6569 4.92893C18.0474 4.53841 18.6805 4.53841 19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315L14.4142 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H14.4142L19.0711 17.6569C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711C18.6805 19.4616 18.0474 19.4616 17.6569 19.0711L13 14.4142V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V14.4142L6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569L9.58579 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H9.58579L4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893L11 9.58579V3C11 2.44772 11.4477 2 12 2Z" fill="#D97757"/>
      </svg>
      <div class="intro-title-wrapper">
        <div id="introTitle" class="intro-title">Clauding<span class="orange-dot">.</span></div>
        <div id="introSubtitle" class="intro-subtitle">
          <span class="sub-word">ARCADE</span>
          <span class="sub-dot">✦</span>
          <span class="sub-word">GAMES</span>
        </div>
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
          <div class="brand-subtitle">
            <span class="sub-word">ARCADE</span>
            <span class="sub-dot">✦</span>
            <span class="sub-word">GAMES</span>
          </div>
        </div>
      </div>
      <!-- Sound button label strictly Sound / Muted -->
      <button id="soundToggleBtn" class="sound-toggle-btn" title="Toggle Sound">
        <span id="soundIcon">🔊</span>
        <span id="soundLabel">Sound</span>
      </button>
    </div>

    <!-- SCREEN 1: GAME SELECTION (4 Games with Cohesive Pixel Icons) -->
    <div id="screen-select" class="screen surface-card">
      <h1>Choose Game</h1>
      <p class="subtitle">Relax while Claude completes your background tasks</p>

      <div class="game-grid">
        <!-- 1. CHROME DINO (Good Looking Pixel Dinosaur Icon) -->
        <div class="game-card game-card-featured" id="cardDino">
          <div class="game-card-left">
            <div class="pixel-icon-box" style="border-color: rgba(242, 139, 85, 0.45);">
              <svg class="pixel-icon-svg" viewBox="0 0 16 16">
                <!-- Detailed Crisp Pixel T-Rex -->
                <rect x="8" y="1" width="7" height="4" fill="#f8fafc" />
                <rect x="10" y="2" width="1" height="1" fill="#120e0b" />
                <rect x="11" y="5" width="4" height="2" fill="#f8fafc" />
                <rect x="6" y="4" width="4" height="4" fill="#f8fafc" />
                <rect x="3" y="6" width="6" height="5" fill="#f8fafc" />
                <rect x="1" y="7" width="3" height="4" fill="#f8fafc" />
                <rect x="10" y="8" width="2" height="1" fill="#f8fafc" />
                <rect x="5" y="11" width="2" height="4" fill="#f8fafc" />
                <rect x="4" y="14" width="3" height="1" fill="#f8fafc" />
                <rect x="8" y="11" width="2" height="3" fill="#f8fafc" />
                <rect x="8" y="13" width="3" height="1" fill="#f8fafc" />
              </svg>
            </div>
            <div class="game-info">
              <h3>Chrome Dino</h3>
              <p>Snappy-jump T-Rex runner with cacti & pterodactyls</p>
            </div>
          </div>
          <div class="game-best-badge">
            <span class="label">BEST</span>
            <span id="cardDinoBest" class="val">0</span>
          </div>
        </div>

        <!-- 2. PIXEL SNAKE (Pixel Apple Icon) -->
        <div class="game-card" id="cardSnake">
          <div class="game-card-left">
            <div class="pixel-icon-box" style="border-color: rgba(239, 68, 68, 0.45);">
              <svg class="pixel-icon-svg" viewBox="0 0 16 16">
                <!-- Pure Pixel Apple Icon -->
                <rect x="7" y="1" width="2" height="3" fill="#78350f" />
                <rect x="9" y="1" width="3" height="2" fill="#4ade80" />
                <rect x="4" y="4" width="8" height="9" fill="#dc2626" />
                <rect x="3" y="5" width="10" height="7" fill="#dc2626" />
                <rect x="5" y="5" width="2" height="2" fill="#ffffff" />
                <rect x="4" y="11" width="8" height="2" fill="#991b1b" />
              </svg>
            </div>
            <div class="game-info">
              <h3>Pixel Snake</h3>
              <p>Classic pixel snake with seamless edge wraparound</p>
            </div>
          </div>
          <div class="game-best-badge">
            <span class="label">BEST</span>
            <span id="cardSnakeBest" class="val">0</span>
          </div>
        </div>

        <!-- 3. BLOCK DROP (Single 3D Pixel Block Icon) -->
        <div class="game-card" id="cardBlocks">
          <div class="game-card-left">
            <div class="pixel-icon-box" style="border-color: rgba(234, 179, 8, 0.45);">
              <svg class="pixel-icon-svg" viewBox="0 0 16 16">
                <!-- Single 3D-Shaded Pixel Block Icon -->
                <rect x="3" y="3" width="10" height="10" fill="#eab308" />
                <rect x="3" y="3" width="10" height="2" fill="#fef08a" />
                <rect x="3" y="3" width="2" height="10" fill="#fef08a" />
                <rect x="3" y="11" width="10" height="2" fill="#a16207" />
                <rect x="11" y="3" width="2" height="10" fill="#a16207" />
                <rect x="6" y="6" width="4" height="4" fill="#facc15" />
              </svg>
            </div>
            <div class="game-info">
              <h3>Block Drop</h3>
              <p>Falling blocks: Rotate with Up & clear rows</p>
            </div>
          </div>
          <div class="game-best-badge">
            <span class="label">BEST</span>
            <span id="cardBlocksBest" class="val">0</span>
          </div>
        </div>

        <!-- 4. BLOCK INVADERS (Pixel Rocket Icon) -->
        <div class="game-card" id="cardInvaders">
          <div class="game-card-left">
            <div class="pixel-icon-box" style="border-color: rgba(217, 119, 87, 0.45);">
              <svg class="pixel-icon-svg" viewBox="0 0 16 16">
                <!-- Retro Pixel Rocket Ship -->
                <rect x="7" y="1" width="2" height="2" fill="#ef4444" />
                <rect x="6" y="3" width="4" height="2" fill="#f8fafc" />
                <rect x="5" y="5" width="6" height="5" fill="#f8fafc" />
                <rect x="7" y="6" width="2" height="2" fill="#38bdf8" />
                <rect x="3" y="8" width="2" height="4" fill="#d97757" />
                <rect x="11" y="8" width="2" height="4" fill="#d97757" />
                <rect x="6" y="10" width="4" height="2" fill="#d97757" />
                <rect x="6" y="12" width="4" height="2" fill="#f97316" />
                <rect x="7" y="14" width="2" height="2" fill="#fde047" />
              </svg>
            </div>
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

    <!-- SCREEN 2: USERNAME SETUP -->
    <div id="screen-user" class="screen surface-card">
      <h1>Welcome Player</h1>
      <p class="subtitle">Set your gamer tag to store your high scores</p>
      
      <div class="input-group">
        <input type="text" id="usernameInput" placeholder="Enter gamer tag (e.g. CJ, Neo)" maxlength="16" autofocus autocomplete="off" />
      </div>

      <button id="btnSaveUser" class="btn">
        <span>Enter Arcade</span> &rarr;
      </button>
    </div>

    <!-- SCREEN 3: GAMEPLAY SCREEN -->
    <div id="screen-game" class="screen surface-card">
      <div class="game-header">
        <div class="stat-group">
          <div class="stat-pill">SCORE <span id="currentScore" class="num">0</span></div>
          <div id="gameExtraStat" class="stat-pill special-stat" style="display: none;"></div>
        </div>
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

      <div id="controlsHint" class="controls-hint"></div>
    </div>

    <!-- SCREEN 4: GAME OVER SCREEN -->
    <div id="screen-leaderboard" class="screen surface-card">
      <h1 id="gameOverTitle">Game Over</h1>
      <p id="gameOverSubtitle" class="subtitle" style="margin-bottom: 12px;">Great run! Keep challenging your record.</p>
      
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
    // --- 0. 4-SECOND CINEMATIC INTRO ---
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
      void introLogo.offsetWidth;

      introLogo.classList.add('animating');
      introTitle.classList.add('animating');
      introSubtitle.classList.add('animating');

      setTimeout(() => { introOverlay.classList.add('zoom-fade-out'); }, 2900);
      setTimeout(() => { introOverlay.style.display = 'none'; }, 4000);
    }
    run4SecondCinematicIntro();
    document.getElementById('claudeLogo').addEventListener('click', run4SecondCinematicIntro);

    // --- 1. Ambient Fluid Gradient Canvas ---
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
      { r: 217, g: 119, b: 87 },
      { r: 170, g: 65, b: 35 },
      { r: 242, g: 139, b: 85 },
      { r: 194, g: 90, b: 52 },
      { r: 140, g: 45, b: 25 },
      { r: 234, g: 145, b: 110 }
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

    // ==========================================
    // 2. ICONIC GTA THEME SYNTHESIZER
    // ==========================================
    const GTAAudioEngine = {
      ctx: null,
      masterGain: null,
      musicGain: null,
      sfxGain: null,
      isPlayingMusic: false,
      isMuted: false,
      bgmTimer: null,
      bgmStep: 0,

      init() {
        if (!this.ctx) {
          try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.setValueAtTime(0.24, this.ctx.currentTime);
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            this.sfxGain.connect(this.masterGain);
          } catch (e) {
            console.error('Audio init error', e);
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
          this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
      },

      startGTABackgroundTheme() {
        this.init();
        if (this.isPlayingMusic || !this.ctx) return;
        this.isPlayingMusic = true;
        this.bgmStep = 0;

        const bassNotes = [
          73.42, 0, 73.42, 0,  87.31, 0, 98.00, 103.83,
          98.00, 0, 87.31, 0,  73.42, 0, 0, 0,
          73.42, 0, 73.42, 0,  87.31, 0, 98.00, 103.83,
          98.00, 0, 110.00, 0, 103.83, 98.00, 87.31, 73.42
        ];

        const leadWhistle = [
          0, 0, 587.33, 0, 0, 0, 698.46, 0,
          783.99, 0, 830.61, 0, 783.99, 0, 698.46, 0,
          587.33, 0, 0, 0, 0, 0, 698.46, 0,
          783.99, 0, 880.00, 0, 830.61, 0, 783.99, 587.33
        ];

        const stepDuration = 162;

        const playTick = () => {
          if (!this.isPlayingMusic || !this.ctx) return;
          if (this.ctx.state === 'suspended') this.ctx.resume();

          if (!this.isMuted) {
            const now = this.ctx.currentTime;
            const bFreq = bassNotes[this.bgmStep % bassNotes.length];
            const wFreq = leadWhistle[this.bgmStep % leadWhistle.length];

            // Bass
            if (bFreq > 0) {
              const bOsc = this.ctx.createOscillator();
              const bGain = this.ctx.createGain();
              const filter = this.ctx.createBiquadFilter();

              bOsc.type = 'sawtooth';
              bOsc.frequency.setValueAtTime(bFreq, now);

              filter.type = 'lowpass';
              filter.frequency.setValueAtTime(320, now);
              filter.Q.setValueAtTime(3.5, now);

              bGain.gain.setValueAtTime(0.24, now);
              bGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

              bOsc.connect(filter);
              filter.connect(bGain);
              bGain.connect(this.musicGain);

              bOsc.start(now);
              bOsc.stop(now + 0.30);
            }

            // Whistle
            if (wFreq > 0) {
              const wOsc = this.ctx.createOscillator();
              const wGain = this.ctx.createGain();
              wOsc.type = 'sine';
              wOsc.frequency.setValueAtTime(wFreq, now);

              wGain.gain.setValueAtTime(0.001, now);
              wGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
              wGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

              wOsc.connect(wGain);
              wGain.connect(this.musicGain);

              wOsc.start(now);
              wOsc.stop(now + 0.36);
            }

            // Drums
            const beatInBar = this.bgmStep % 16;
            if (beatInBar === 0 || beatInBar === 8) {
              const kOsc = this.ctx.createOscillator();
              const kGain = this.ctx.createGain();
              kOsc.type = 'sine';
              kOsc.frequency.setValueAtTime(125, now);
              kOsc.frequency.exponentialRampToValueAtTime(35, now + 0.14);
              kGain.gain.setValueAtTime(0.3, now);
              kGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
              kOsc.connect(kGain);
              kGain.connect(this.musicGain);
              kOsc.start(now);
              kOsc.stop(now + 0.16);
            } else if (beatInBar === 4 || beatInBar === 12) {
              const sOsc = this.ctx.createOscillator();
              const sGain = this.ctx.createGain();
              sOsc.type = 'triangle';
              sOsc.frequency.setValueAtTime(190, now);
              sGain.gain.setValueAtTime(0.16, now);
              sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
              sOsc.connect(sGain);
              sGain.connect(this.musicGain);
              sOsc.start(now);
              sOsc.stop(now + 0.13);
            } else if (beatInBar % 2 === 0) {
              const hOsc = this.ctx.createOscillator();
              const hGain = this.ctx.createGain();
              hOsc.type = 'square';
              hOsc.frequency.setValueAtTime(1400, now);
              hGain.gain.setValueAtTime(0.025, now);
              hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
              hOsc.connect(hGain);
              hGain.connect(this.musicGain);
              hOsc.start(now);
              hOsc.stop(now + 0.04);
            }
          }

          this.bgmStep = (this.bgmStep + 1) % 32;
          this.bgmTimer = setTimeout(playTick, stepDuration);
        };

        playTick();
      },

      stopGTABackgroundTheme() {
        this.isPlayingMusic = false;
        if (this.bgmTimer) {
          clearTimeout(this.bgmTimer);
          this.bgmTimer = null;
        }
      },

      playDinoJump() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(850, now + 0.06);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.07);
        } catch (e) {}
      },

      playDinoScore() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          [880, 1175].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.22, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.16);
          });
        } catch (e) {}
      },

      playTetrisRotate() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(460, now + 0.05);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.06);
        } catch (e) {}
      },

      playTetrisDrop() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.07);
        } catch (e) {}
      },

      playTetrisLine() {
        this.init();
        if (!this.ctx || this.isMuted) return;
        try {
          [523.25, 659.25, 783.99].forEach((freq, i) => {
            const start = this.ctx.currentTime + i * 0.06;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(start);
            osc.stop(start + 0.17);
          });
        } catch (e) {}
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
          gain.gain.setValueAtTime(0.25, now);
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

    // Unlock audio
    const unlockAudio = () => {
      GTAAudioEngine.init();
      if (currentScreenId === 'screen-select' || currentScreenId === 'screen-user') {
        GTAAudioEngine.startGTABackgroundTheme();
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Audio Toggle strictly Sound / Muted
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    const soundLabel = document.getElementById('soundLabel');
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const muted = GTAAudioEngine.toggleMute();
      if (muted) {
        soundToggleBtn.classList.add('muted');
        soundIcon.textContent = '🔇';
        soundLabel.textContent = 'Muted';
      } else {
        soundToggleBtn.classList.remove('muted');
        soundIcon.textContent = '🔊';
        soundLabel.textContent = 'Sound';
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
    let activeGameType = 'dino';
    let isGameRunning = false;
    let isGamePaused = false;
    let animFrameId = null;
    let currentScreenId = 'screen-select';

    function clearAllClaudingData() {
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('clauding')) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {}
      username = '';
      if (typeof usernameInput !== 'undefined' && usernameInput) usernameInput.value = '';
      refreshBestScoresUI();
      showScreen('screen-user');
    }

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message && message.command === 'resetClaudingData') {
        clearAllClaudingData();
      }
    });

    function getHighScoreKey() {
      return 'clauding_highscore_' + activeGameType;
    }

    function refreshBestScoresUI() {
      ['dino', 'snake', 'blocks', 'invaders'].forEach(game => {
        const best = localStorage.getItem('clauding_highscore_' + game) || '0';
        const el = document.getElementById('card' + game.charAt(0).toUpperCase() + game.slice(1) + 'Best');
        if (el) el.textContent = best;
      });
    }

    function showScreen(screenId) {
      currentScreenId = screenId;
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      const target = document.getElementById(screenId);
      if (target) target.classList.add('active');

      if (screenId === 'screen-select' || screenId === 'screen-user') {
        refreshBestScoresUI();
        GTAAudioEngine.startGTABackgroundTheme();
      } else {
        GTAAudioEngine.stopGTABackgroundTheme();
      }
    }

    const usernameInput = document.getElementById('usernameInput');
    const btnSaveUser = document.getElementById('btnSaveUser');
    const currentScoreEl = document.getElementById('currentScore');
    const highScoreEl = document.getElementById('highScore');
    const gameExtraStat = document.getElementById('gameExtraStat');
    const controlsHint = document.getElementById('controlsHint');
    const finalScoreDisplay = document.getElementById('finalScoreDisplay');
    const finalHighScoreDisplay = document.getElementById('finalHighScoreDisplay');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const gameOverSubtitle = document.getElementById('gameOverSubtitle');
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

    // Launch Cards
    document.getElementById('cardDino').addEventListener('click', () => {
      activeGameType = 'dino';
      startDinoGame();
    });
    document.getElementById('cardSnake').addEventListener('click', () => {
      activeGameType = 'snake';
      startSnakeGame();
    });
    document.getElementById('cardBlocks').addEventListener('click', () => {
      activeGameType = 'blocks';
      startBlocksGame();
    });
    document.getElementById('cardInvaders').addEventListener('click', () => {
      activeGameType = 'invaders';
      startInvadersGame();
    });

    btnPlayAgain.addEventListener('click', () => {
      if (activeGameType === 'dino') startDinoGame();
      else if (activeGameType === 'snake') startSnakeGame();
      else if (activeGameType === 'blocks') startBlocksGame();
      else startInvadersGame();
    });

    btnMenu.addEventListener('click', () => exitActiveGame());

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

    function updateScoreDisplay(val) {
      currentScore = val;
      currentScoreEl.textContent = currentScore.toString();
      const best = parseInt(localStorage.getItem(getHighScoreKey()) || '0', 10);
      if (currentScore > best) {
        localStorage.setItem(getHighScoreKey(), currentScore.toString());
        highScoreEl.textContent = currentScore.toString();
      }
    }

    // ==========================================
    // GAME 1: CHROME DINO (AUTHENTIC T-REX & SNAPPY JUMP)
    // ==========================================
    let dino = { x: 36, y: 224, vy: 0, w: 22, h: 26, isDucking: false, onGround: true, step: 0 };
    let dinoObstacles = [];
    let dinoSpeed = 260;
    let dinoPrevTime = 0;
    let dinoDistance = 0;
    let dinoSpawnTimer = 0;
    let dinoIsNight = false;

    function startDinoGame() {
      showScreen('screen-game');
      updateScoreDisplay(0);
      highScoreEl.textContent = (localStorage.getItem(getHighScoreKey()) || '0');
      gameExtraStat.style.display = 'flex';
      gameExtraStat.innerHTML = 'DIST <span class="num">0m</span>';
      controlsHint.innerHTML = '<kbd>Space</kbd> / <kbd>↑</kbd> Snappy Jump &bull; <kbd>↓</kbd> Duck under pterodactyls!';

      dino = { x: 36, y: 224, vy: 0, w: 22, h: 26, isDucking: false, onGround: true, step: 0 };
      dinoObstacles = [];
      dinoSpeed = 260;
      dinoDistance = 0;
      dinoSpawnTimer = 0;
      dinoIsNight = false;
      dinoPrevTime = performance.now();

      isGameRunning = true;
      isGamePaused = false;
      updatePauseUI();

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(dinoLoop);
    }

    function dinoLoop(timestamp) {
      if (!isGameRunning) return;

      const dt = Math.min((timestamp - dinoPrevTime) / 1000, 0.05);
      dinoPrevTime = timestamp;

      if (!isGamePaused) {
        updateDino(dt);
        drawDino();
      }

      if (isGameRunning) {
        animFrameId = requestAnimationFrame(dinoLoop);
      }
    }

    function updateDino(dt) {
      dinoDistance += dinoSpeed * dt * 0.1;
      updateScoreDisplay(Math.floor(dinoDistance));
      gameExtraStat.innerHTML = 'DIST <span class="num">' + Math.floor(dinoDistance) + 'm</span>';

      if (Math.floor(dinoDistance) > 0 && Math.floor(dinoDistance) % 100 === 0 && Math.floor(dinoDistance - dinoSpeed * dt * 0.1) % 100 !== 0) {
        GTAAudioEngine.playDinoScore();
      }

      dinoIsNight = Math.floor(dinoDistance / 300) % 2 === 1;
      if (dinoSpeed < 460) dinoSpeed += 4 * dt;

      // Heavy gravity 2500 px/s² for snappy jump
      const groundY = 224;
      dino.vy += 2500 * dt;
      dino.y += dino.vy * dt;

      if (dino.y >= groundY) {
        dino.y = groundY;
        dino.vy = 0;
        dino.onGround = true;
      }

      dino.step += dt * 18;

      dinoSpawnTimer += dt;
      if (dinoSpawnTimer > Math.max(1.1 - (dinoSpeed - 260) * 0.002, 0.58)) {
        dinoSpawnTimer = 0;
        const isBird = dinoDistance > 110 && Math.random() < 0.35;
        if (isBird) {
          const birdY = Math.random() > 0.5 ? groundY - 14 : groundY - 32;
          dinoObstacles.push({ x: WIDTH + 20, y: birdY, w: 26, h: 18, type: 'bird', flap: 0 });
        } else {
          const variant = Math.random();
          const w = variant > 0.7 ? 22 : (variant > 0.4 ? 16 : 10);
          dinoObstacles.push({ x: WIDTH + 20, y: groundY + (26 - 28), w: w, h: 28, type: 'cactus' });
        }
      }

      for (let i = dinoObstacles.length - 1; i >= 0; i--) {
        const obs = dinoObstacles[i];
        obs.x -= dinoSpeed * dt;
        if (obs.type === 'bird') obs.flap += dt * 10;

        const dinoHitW = dino.isDucking ? 28 : 18;
        const dinoHitH = dino.isDucking ? 14 : 24;
        const dinoHitY = dino.isDucking ? dino.y + 12 : dino.y;

        if (
          dino.x + 3 < obs.x + obs.w &&
          dino.x + dinoHitW > obs.x &&
          dinoHitY < obs.y + obs.h &&
          dinoHitY + dinoHitH > obs.y
        ) {
          GTAAudioEngine.playExplosion();
          gameOver('T-Rex Collided with Obstacle!');
          return;
        }

        if (obs.x < -40) dinoObstacles.splice(i, 1);
      }
    }

    function drawDino() {
      const bg = dinoIsNight ? '#171412' : '#f8f4eb';
      const fg = dinoIsNight ? '#f8fafc' : '#221e1a';
      const groundLine = '#78716c';

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (dinoIsNight) {
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(260, 50, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(266, 46, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = groundLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 250);
      ctx.lineTo(WIDTH, 250);
      ctx.stroke();

      ctx.fillStyle = groundLine;
      for (let x = 0; x < WIDTH; x += 32) {
        const offset = (x - (dinoDistance * 5) % 32);
        ctx.fillRect(offset, 254, 4, 2);
        ctx.fillRect(offset + 12, 257, 6, 2);
      }

      // TRUE T-REX SPRITE
      ctx.fillStyle = fg;
      const dx = dino.x;
      const dy = Math.round(dino.y);

      if (dino.isDucking) {
        ctx.fillRect(dx + 2, dy + 12, 22, 10);
        ctx.fillRect(dx + 20, dy + 8, 12, 8);
        ctx.fillRect(dx + 28, dy + 16, 4, 4);
        ctx.fillStyle = bg;
        ctx.fillRect(dx + 26, dy + 10, 2, 2);
        ctx.fillStyle = fg;
        const leg = Math.floor(dino.step) % 2;
        ctx.fillRect(dx + 6, dy + 22, 4, leg === 0 ? 4 : 2);
        ctx.fillRect(dx + 16, dy + 22, 4, leg === 1 ? 4 : 2);
      } else {
        ctx.fillRect(dx + 12, dy, 12, 10);
        ctx.fillRect(dx + 16, dy + 10, 8, 3);
        ctx.fillStyle = bg;
        ctx.fillRect(dx + 15, dy + 2, 2, 2);
        ctx.fillStyle = fg;

        ctx.fillRect(dx + 8, dy + 8, 7, 6);
        ctx.fillRect(dx + 4, dy + 12, 12, 10);
        ctx.fillRect(dx, dy + 14, 5, 6);
        ctx.fillRect(dx - 3, dy + 16, 4, 3);

        ctx.fillRect(dx + 16, dy + 14, 3, 2);
        ctx.fillRect(dx + 18, dy + 15, 2, 2);

        if (!dino.onGround) {
          ctx.fillRect(dx + 7, dy + 22, 3, 4);
          ctx.fillRect(dx + 13, dy + 22, 3, 4);
        } else {
          const leg = Math.floor(dino.step) % 2;
          ctx.fillRect(dx + 6, dy + 22, 3, leg === 0 ? 5 : 2);
          ctx.fillRect(dx + 5, dy + 25, 4, leg === 0 ? 2 : 0);
          ctx.fillRect(dx + 13, dy + 22, 3, leg === 1 ? 5 : 2);
          ctx.fillRect(dx + 12, dy + 25, 4, leg === 1 ? 2 : 0);
        }
      }

      dinoObstacles.forEach(obs => {
        if (obs.type === 'cactus') {
          ctx.fillStyle = dinoIsNight ? '#4ade80' : '#15803d';
          ctx.fillRect(obs.x + obs.w / 2 - 2, obs.y, 4, obs.h);
          if (obs.w > 12) {
            ctx.fillRect(obs.x, obs.y + 6, 4, 8);
            ctx.fillRect(obs.x, obs.y + 12, obs.w / 2, 3);
            ctx.fillRect(obs.x + obs.w - 4, obs.y + 8, 4, 8);
            ctx.fillRect(obs.x + obs.w / 2, obs.y + 14, obs.w / 2, 3);
          }
        } else if (obs.type === 'bird') {
          ctx.fillStyle = fg;
          const wingUp = Math.floor(obs.flap) % 2 === 0;
          ctx.fillRect(obs.x + 6, obs.y + 6, 14, 5);
          ctx.fillRect(obs.x, obs.y + 4, 6, 4);
          if (wingUp) ctx.fillRect(obs.x + 8, obs.y - 4, 4, 10);
          else ctx.fillRect(obs.x + 8, obs.y + 8, 4, 8);
        }
      });
    }

    // =========================================================================
    // GAME 2: PIXEL SNAKE (1ST VERSION VISUALS + MODERN JUICE & POPUPS)
    // =========================================================================
    const TILE_COUNT = 10;
    const GRID_SIZE = WIDTH / TILE_COUNT; // 32px
    let snake = [];
    let snakeVelocity = { x: 0, y: 0 };
    let snakeNextVelocity = { x: 0, y: 0 };
    let inputQueue = [];
    let apple = { x: 3, y: 3 };
    let snakeLastTick = 0;
    let snakeTickInterval = 215;
    let snakeParticles = [];
    let scorePopups = [];

    function startSnakeGame() {
      showScreen('screen-game');
      currentScore = 0;
      updateScoreDisplay(0);
      highScoreEl.textContent = (localStorage.getItem(getHighScoreKey()) || '0');
      gameExtraStat.style.display = 'none';
      controlsHint.innerHTML = '<kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>Arrow Keys</kbd> &bull; Wraparound screen edges!';

      snake = [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 5, y: 7 }
      ];
      snakeVelocity = { x: 0, y: -1 };
      snakeNextVelocity = { x: 0, y: -1 };
      inputQueue = [];
      snakeTickInterval = 215;
      snakeParticles = [];
      scorePopups = [];

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
      if (inputQueue.length > 0) {
        snakeNextVelocity = inputQueue.shift();
      }
      snakeVelocity = { ...snakeNextVelocity };

      let newX = snake[0].x + snakeVelocity.x;
      let newY = snake[0].y + snakeVelocity.y;

      // Screen edge wraparound
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
        updateScoreDisplay(currentScore + 10);
        GTAAudioEngine.playEat();

        // Spawn Juicy Golden Sparks & +10 Popup
        const px = apple.x * GRID_SIZE + GRID_SIZE / 2;
        const py = apple.y * GRID_SIZE + GRID_SIZE / 2;
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 40 + Math.random() * 60;
          snakeParticles.push({
            x: px, y: py,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            size: 2 + Math.random() * 2,
            life: 0.4
          });
        }
        scorePopups.push({ x: px, y: py - 6, life: 0.6 });

        placeApple();
        if (snakeTickInterval > 140 && currentScore % 30 === 0) {
          snakeTickInterval -= 4;
        }
      } else {
        snake.pop();
      }
    }

    function drawSnake() {
      // 1. High-Clarity Dark Grid Arena (1st Version Aesthetic)
      ctx.fillStyle = '#090706';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.strokeStyle = 'rgba(217, 119, 87, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= WIDTH; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, HEIGHT);
        ctx.moveTo(0, i); ctx.lineTo(WIDTH, i);
        ctx.stroke();
      }

      // 2. Pixel Apple (1st Version Minecraft-Style Shaded Apple)
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

      // 3. Pixel Snake (1st Version Emerald Head with Expressive Eyes & Beveled Segments)
      snake.forEach((seg, i) => {
        const x = seg.x * GRID_SIZE;
        const y = seg.y * GRID_SIZE;

        if (i === 0) {
          // Snake Head
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(x + 2, y + 2, 28, 28);
          ctx.strokeStyle = '#14532d';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 3, y + 3, 26, 26);

          ctx.fillStyle = '#4ade80';
          ctx.fillRect(x + 6, y + 6, 20, 4);

          // Big Expressive Pixel Eyes looking in direction of motion
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
          // Alternating Shaded Segments with Highlight Inserts
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

      // 4. Particle Bursts & Floating Score Popups
      const now = performance.now();
      for (let i = snakeParticles.length - 1; i >= 0; i--) {
        const p = snakeParticles[i];
        p.x += p.vx * 0.016;
        p.y += p.vy * 0.016;
        p.life -= 0.016;
        if (p.life <= 0) {
          snakeParticles.splice(i, 1);
        } else {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      for (let i = scorePopups.length - 1; i >= 0; i--) {
        const s = scorePopups[i];
        s.y -= 0.8;
        s.life -= 0.016;
        if (s.life <= 0) {
          scorePopups.splice(i, 1);
        } else {
          ctx.fillStyle = 'rgba(250, 204, 21, ' + (s.life * 1.6) + ')';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('+10', s.x - 10, s.y);
        }
      }
    }

    // ==========================================
    // GAME 3: BLOCK DROP (TETRIS - ROTATE WITH UP)
    // ==========================================
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 15;
    const GRID_X = 85;
    const GRID_Y = 10;

    let tetrisBoard = [];
    let curPiece = null;
    let nextPiece = null;
    let tetrisDropTimer = 0;
    let tetrisDropInterval = 650;
    let tetrisLinesCleared = 0;

    const SHAPES = [
      { id: 1, color: '#06b6d4', matrix: [[1, 1, 1, 1]] },
      { id: 2, color: '#eab308', matrix: [[1, 1], [1, 1]] },
      { id: 3, color: '#a855f7', matrix: [[0, 1, 0], [1, 1, 1]] },
      { id: 4, color: '#22c55e', matrix: [[0, 1, 1], [1, 1, 0]] },
      { id: 5, color: '#ef4444', matrix: [[1, 1, 0], [0, 1, 1]] },
      { id: 6, color: '#3b82f6', matrix: [[1, 0, 0], [1, 1, 1]] },
      { id: 7, color: '#f97316', matrix: [[0, 0, 1], [1, 1, 1]] }
    ];

    function createRandomPiece() {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      return {
        matrix: shape.matrix.map(row => [...row]),
        color: shape.color,
        x: Math.floor((COLS - shape.matrix[0].length) / 2),
        y: 0
      };
    }

    function rotateMatrix(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const res = [];
      for (let c = 0; c < cols; c++) {
        res.push([]);
        for (let r = rows - 1; r >= 0; r--) {
          res[c].push(matrix[r][c]);
        }
      }
      return res;
    }

    function canPlacePiece(matrix, px, py) {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            const bx = px + c;
            const by = py + r;
            if (bx < 0 || bx >= COLS || by >= ROWS) return false;
            if (by >= 0 && tetrisBoard[by][bx]) return false;
          }
        }
      }
      return true;
    }

    function startBlocksGame() {
      showScreen('screen-game');
      updateScoreDisplay(0);
      highScoreEl.textContent = (localStorage.getItem(getHighScoreKey()) || '0');
      gameExtraStat.style.display = 'flex';
      gameExtraStat.innerHTML = 'LINES <span class="num">0</span>';
      controlsHint.innerHTML = '<kbd>↑</kbd> Rotate &bull; <kbd>←</kbd> <kbd>→</kbd> Move &bull; <kbd>↓</kbd> Soft Drop &bull; <kbd>Space</kbd> Hard Drop';

      tetrisBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      tetrisLinesCleared = 0;
      tetrisDropInterval = 650;
      curPiece = createRandomPiece();
      nextPiece = createRandomPiece();

      isGameRunning = true;
      isGamePaused = false;
      tetrisDropTimer = performance.now();
      updatePauseUI();

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(blocksLoop);
    }

    function blocksLoop(timestamp) {
      if (!isGameRunning) return;

      if (!isGamePaused) {
        if (timestamp - tetrisDropTimer > tetrisDropInterval) {
          tetrisDropTimer = timestamp;
          movePieceDown();
        }
        drawBlocks();
      }

      if (isGameRunning) {
        animFrameId = requestAnimationFrame(blocksLoop);
      }
    }

    function movePieceDown() {
      if (!curPiece) return;
      if (canPlacePiece(curPiece.matrix, curPiece.x, curPiece.y + 1)) {
        curPiece.y++;
      } else {
        lockPiece();
      }
    }

    function rotateCurPiece() {
      if (!curPiece) return;
      const rot = rotateMatrix(curPiece.matrix);
      const offsets = [0, 1, -1, 2, -2];
      for (const off of offsets) {
        if (canPlacePiece(rot, curPiece.x + off, curPiece.y)) {
          curPiece.matrix = rot;
          curPiece.x += off;
          GTAAudioEngine.playTetrisRotate();
          return;
        }
      }
    }

    function hardDropPiece() {
      if (!curPiece) return;
      while (canPlacePiece(curPiece.matrix, curPiece.x, curPiece.y + 1)) {
        curPiece.y++;
        currentScore += 2;
      }
      updateScoreDisplay(currentScore);
      lockPiece();
    }

    function lockPiece() {
      GTAAudioEngine.playTetrisDrop();
      curPiece.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) {
            const bx = curPiece.x + c;
            const by = curPiece.y + r;
            if (by >= 0 && by < ROWS) {
              tetrisBoard[by][bx] = curPiece.color;
            }
          }
        });
      });

      let lines = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (tetrisBoard[r].every(cell => cell !== 0)) {
          tetrisBoard.splice(r, 1);
          tetrisBoard.unshift(Array(COLS).fill(0));
          lines++;
          r++;
        }
      }

      if (lines > 0) {
        tetrisLinesCleared += lines;
        const lineScores = [0, 100, 300, 500, 800];
        updateScoreDisplay(currentScore + (lineScores[lines] || 1000));
        gameExtraStat.innerHTML = 'LINES <span class="num">' + tetrisLinesCleared + '</span>';
        GTAAudioEngine.playTetrisLine();
        if (tetrisDropInterval > 180) {
          tetrisDropInterval = Math.max(180, 650 - Math.floor(tetrisLinesCleared / 4) * 50);
        }
      }

      curPiece = nextPiece;
      nextPiece = createRandomPiece();

      if (!canPlacePiece(curPiece.matrix, curPiece.x, curPiece.y)) {
        gameOver('Blocks Reached the Top!');
      }
    }

    function drawBlocks() {
      ctx.fillStyle = '#090706';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = '#140f0c';
      ctx.fillRect(GRID_X, GRID_Y, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.strokeStyle = 'rgba(217, 119, 87, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(GRID_X, GRID_Y, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = tetrisBoard[r][c];
          if (color) drawBlockCell(GRID_X + c * BLOCK_SIZE, GRID_Y + r * BLOCK_SIZE, color);
        }
      }

      if (curPiece) {
        let ghostY = curPiece.y;
        while (canPlacePiece(curPiece.matrix, curPiece.x, ghostY + 1)) {
          ghostY++;
        }
        curPiece.matrix.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val) {
              const gx = GRID_X + (curPiece.x + c) * BLOCK_SIZE;
              const gy = GRID_Y + (ghostY + r) * BLOCK_SIZE;
              ctx.strokeStyle = curPiece.color;
              ctx.lineWidth = 1;
              ctx.strokeRect(gx + 1, gy + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
          });
        });

        curPiece.matrix.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val) {
              drawBlockCell(
                GRID_X + (curPiece.x + c) * BLOCK_SIZE,
                GRID_Y + (curPiece.y + r) * BLOCK_SIZE,
                curPiece.color
              );
            }
          });
        });
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('NEXT', 250, 45);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(245, 52, 60, 60);
      ctx.strokeStyle = 'rgba(217, 119, 87, 0.3)';
      ctx.strokeRect(245, 52, 60, 60);

      if (nextPiece) {
        const offX = 248 + (54 - nextPiece.matrix[0].length * 12) / 2;
        const offY = 55 + (54 - nextPiece.matrix.length * 12) / 2;
        nextPiece.matrix.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val) {
              ctx.fillStyle = nextPiece.color;
              ctx.fillRect(offX + c * 12, offY + r * 12, 11, 11);
            }
          });
        });
      }
    }

    function drawBlockCell(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + 1, y + 1, BLOCK_SIZE - 2, 2);
      ctx.fillRect(x + 1, y + 1, 2, BLOCK_SIZE - 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + BLOCK_SIZE - 3, y + 1, 2, BLOCK_SIZE - 2);
      ctx.fillRect(x + 1, y + BLOCK_SIZE - 3, BLOCK_SIZE - 2, 2);
    }

    // =========================================================================
    // GAME 4: BLOCK INVADERS (EXACT 1ST VERSION ROCKET SPACE DEFENSE)
    // =========================================================================
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
      updateScoreDisplay(0);
      highScoreEl.textContent = (localStorage.getItem(getHighScoreKey()) || '0');
      gameExtraStat.style.display = 'none';
      controlsHint.innerHTML = '<kbd>A</kbd> / <kbd>D</kbd> or <kbd>←</kbd> <kbd>→</kbd> Navigate rocket &bull; Automatic rapid blaster';

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
        GTAAudioEngine.playLaser();
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
          GTAAudioEngine.playExplosion();
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
              updateScoreDisplay(currentScore + 15);
              GTAAudioEngine.playExplosion();
              asteroids.splice(i, 1);
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
          GTAAudioEngine.playExplosion();
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
            updateScoreDisplay(currentScore + 35);
            GTAAudioEngine.playExplosion();
            enemyRockets.splice(i, 1);
            break;
          }
        }

        if (enm && enm.y > HEIGHT + 30) {
          enemyRockets.splice(i, 1);
        }
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
    // GAME OVER & LEADERBOARD SCREEN
    // ==========================================
    function gameOver(reason, customSub) {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      isGameRunning = false;
      isGamePaused = false;
      updatePauseUI();

      gameOverTitle.textContent = reason || 'Game Over';
      gameOverSubtitle.textContent = customSub || 'Great run! Keep challenging your record.';
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

    // Unified Keyboard Controller
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        if (isGameRunning) togglePause();
        return;
      }

      if (!isGameRunning || isGamePaused) return;

      if (activeGameType === 'dino') {
        if (['ArrowUp', 'KeyW', 'Space'].includes(e.code) && dino.onGround) {
          dino.vy = -660;
          dino.onGround = false;
          GTAAudioEngine.playDinoJump();
        } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
          dino.isDucking = true;
        }
      } else if (activeGameType === 'snake') {
        let desired = null;
        if (['ArrowUp', 'KeyW'].includes(e.code)) desired = { x: 0, y: -1 };
        else if (['ArrowDown', 'KeyS'].includes(e.code)) desired = { x: 0, y: 1 };
        else if (['ArrowLeft', 'KeyA'].includes(e.code)) desired = { x: -1, y: 0 };
        else if (['ArrowRight', 'KeyD'].includes(e.code)) desired = { x: 1, y: 0 };

        if (desired) {
          const lastPlanned = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : snakeVelocity;
          // Prevent 180° immediate reverse
          if (!(desired.x === -lastPlanned.x && desired.y === -lastPlanned.y) &&
              !(desired.x === lastPlanned.x && desired.y === lastPlanned.y)) {
            if (inputQueue.length < 2) {
              inputQueue.push(desired);
              GTAAudioEngine.playTurn();
            }
          }
        }
      } else if (activeGameType === 'blocks') {
        if (['ArrowUp', 'KeyW'].includes(e.code)) {
          rotateCurPiece();
        } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
          if (curPiece && canPlacePiece(curPiece.matrix, curPiece.x - 1, curPiece.y)) {
            curPiece.x--;
            GTAAudioEngine.playTurn();
          }
        } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
          if (curPiece && canPlacePiece(curPiece.matrix, curPiece.x + 1, curPiece.y)) {
            curPiece.x++;
            GTAAudioEngine.playTurn();
          }
        } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
          movePieceDown();
        } else if (e.code === 'Space') {
          hardDropPiece();
        }
      } else if (activeGameType === 'invaders') {
        if (['ArrowLeft', 'KeyA'].includes(e.code)) invaderKeys.left = true;
        else if (['ArrowRight', 'KeyD'].includes(e.code)) invaderKeys.right = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (activeGameType === 'dino') {
        if (['ArrowDown', 'KeyS'].includes(e.code)) dino.isDucking = false;
      } else if (activeGameType === 'invaders') {
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
