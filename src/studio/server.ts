/**
 * MonarchUI Technical Blueprint & Structural Bento Grid Studio (Port 7272)
 * Exposed wireframe shell, 1px hairline grids, diagonal hatch gutters,
 * ruler tick scales, corner crosshairs (+), zero drop shadows, and light/dark monochrome polarity.
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import http from 'http';
import { ThemeEngine } from '../core/themeEngine.js';
import { ComponentRegistry } from '../registry/components.js';
import { ThemePresetId } from '../types.js';

export class StudioServer {
  private server: http.Server | null = null;

  constructor(private port = 7272) {}

  start(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }

        const url = new URL(req.url || '/', `http://localhost:${this.port}`);

        if (req.method === 'GET' && url.pathname === '/api/components') {
          const q = url.searchParams.get('q') || '';
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(ComponentRegistry.search(q)));
          return;
        }

        if (req.method === 'GET' && url.pathname === '/api/themes') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(ThemeEngine.listPresets()));
          return;
        }

        if (req.method === 'GET' && url.pathname === '/api/theme-css') {
          const preset = (url.searchParams.get('id') || 'swiss-editorial') as ThemePresetId;
          res.writeHead(200, { 'Content-Type': 'text/css' });
          res.end(ThemeEngine.generateCssVariables(preset));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(this.renderHtml());
      });

      this.server.listen(this.port, () => resolve(this.port));
      this.server.on('error', reject);
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) this.server.close(() => resolve());
      else resolve();
    });
  }

  private renderHtml(): string {
    const componentsJson = JSON.stringify(ComponentRegistry.list());

    return `<!DOCTYPE html>
<html lang="en" data-mode="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MonarchUI — Technical Blueprint UI Registry</title>
  <style>
    :root {
      --bg: #fafafa;
      --surface: #ffffff;
      --surface-hover: #f4f4f5;
      --border: #e4e4e7;
      --border-strong: #a1a1aa;
      --text: #09090b;
      --muted: #71717a;
      --hatch: rgba(0, 0, 0, 0.045);
      --tick: rgba(0, 0, 0, 0.22);
      --code-bg: #f4f4f5;
      --sans: "Inter", "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --mono: "JetBrains Mono", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    html[data-mode="dark"] {
      --bg: #09090b;
      --surface: #111113;
      --surface-hover: #18181b;
      --border: #27272a;
      --border-strong: #52525b;
      --text: #fafafa;
      --muted: #a1a1aa;
      --hatch: rgba(255, 255, 255, 0.045);
      --tick: rgba(255, 255, 255, 0.22);
      --code-bg: #111113;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg);
      background-image: repeating-linear-gradient(
        45deg,
        var(--hatch) 0,
        var(--hatch) 1px,
        transparent 1px,
        transparent 10px
      );
      color: var(--text);
      font-family: var(--sans);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* Exposed Wireframe Shell */
    .shell {
      max-width: 1152px;
      margin: 0 auto;
      min-height: 100vh;
      background: var(--bg);
      border-left: 1px solid var(--border);
      border-right: 1px solid var(--border);
      position: relative;
    }

    /* Full-bleed Horizontal Dividers & Corner Crosshairs */
    .section {
      position: relative;
      border-bottom: 1px solid var(--border);
    }

    .section-dashed {
      position: relative;
      border-bottom: 1px dashed var(--border);
    }

    .crosshair {
      position: absolute;
      width: 9px;
      height: 9px;
      pointer-events: none;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--mono);
      font-size: 11px;
      line-height: 1;
      color: var(--border-strong);
      user-select: none;
    }
    .ch-bl { bottom: -5px; left: -5px; }
    .ch-br { bottom: -5px; right: -5px; }

    /* Ruler Scale Divider */
    .ruler-strip {
      height: 16px;
      border-bottom: 1px solid var(--border);
      background-image:
        repeating-linear-gradient(to right, var(--tick) 0, var(--tick) 1px, transparent 1px, transparent 8px),
        repeating-linear-gradient(to right, var(--border-strong) 0, var(--border-strong) 1px, transparent 1px, transparent 40px);
      background-size: 100% 4px, 100% 9px;
      background-position: bottom left, bottom left;
      background-repeat: no-repeat;
    }

    /* Monospace Technical Badges */
    .tech-label {
      font-family: var(--mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--muted);
    }

    .kbd {
      font-family: var(--mono);
      font-size: 11px;
      padding: 2px 6px;
      border: 1px solid var(--border);
      border-radius: 4px;
      background: var(--surface);
      color: var(--muted);
    }

    /* Compact Tactile Buttons (Zero Drop Shadows) */
    .btn {
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 500;
      padding: 7px 13px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: background 0.15s ease, border-color 0.15s ease;
    }
    .btn:hover {
      background: var(--surface-hover);
      border-color: var(--border-strong);
    }
    .btn-primary {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    .btn-primary:hover {
      opacity: 0.9;
      background: var(--text);
    }

    /* Top Header Bar */
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 24px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: -0.02em;
    }
    .brand-mark {
      width: 22px;
      height: 22px;
      border: 1px solid var(--border-strong);
      border-radius: 4px;
      display: grid;
      place-items: center;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
    }
    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Hero Section */
    .hero {
      padding: 52px 24px 44px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: end;
    }
    @media (max-width: 768px) { .hero { grid-template-columns: 1fr; } }
    .hero h1 {
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 600;
      letter-spacing: -0.035em;
      line-height: 1.08;
      margin-top: 12px;
      max-width: 680px;
    }
    .hero p {
      margin-top: 14px;
      font-size: 15px;
      line-height: 1.6;
      color: var(--muted);
      max-width: 580px;
    }
    .hero-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    /* 1px Hairline Structural Grid (Zero Shadows) */
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: var(--border);
    }
    @media (max-width: 860px) { .grid-3 { grid-template-columns: 1fr; } }
    .cell {
      background: var(--bg);
      padding: 24px;
      position: relative;
      transition: background 0.15s ease;
    }
    .cell:hover {
      background: var(--surface);
    }
    .cell-span-2 {
      grid-column: span 2;
    }
    @media (max-width: 860px) { .cell-span-2 { grid-column: span 1; } }

    /* Interactive Spring Coverflow Deck */
    .deck-stage {
      margin-top: 18px;
      border: 1px solid var(--border);
      background: var(--surface);
      height: 220px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    .deck-card {
      position: absolute;
      width: 240px;
      height: 148px;
      border: 1px solid var(--border-strong);
      background: var(--bg);
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease, border-color 0.2s ease;
    }
    .deck-card.active {
      border-color: var(--text);
      z-index: 5;
    }
    .deck-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
    }

    /* Split Rail Registry Workbench */
    .workbench {
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 1px;
      background: var(--border);
    }
    @media (max-width: 860px) { .workbench { grid-template-columns: 1fr; } }
    .rail {
      background: var(--bg);
    }
    .rail-item {
      width: 100%;
      text-align: left;
      background: var(--bg);
      border: none;
      border-bottom: 1px dashed var(--border);
      padding: 12px 18px;
      color: var(--text);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 500;
      transition: background 0.12s ease;
    }
    .rail-item:hover { background: var(--surface-hover); }
    .rail-item.active {
      background: var(--surface);
      font-weight: 600;
      border-left: 2px solid var(--text);
    }
    .rail-idx {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--muted);
      margin-right: 8px;
    }

    .inspector {
      background: var(--bg);
      padding: 28px;
      min-width: 0;
    }
    .preview-box {
      margin-top: 18px;
      border: 1px solid var(--border);
      background: var(--surface);
      padding: 24px;
      min-height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tabs {
      display: flex;
      gap: 6px;
      margin: 20px 0 10px;
      flex-wrap: wrap;
    }
    .tab {
      font-family: var(--mono);
      font-size: 11px;
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: 5px;
      background: var(--bg);
      color: var(--muted);
      cursor: pointer;
    }
    .tab.active {
      background: var(--text);
      color: var(--bg);
      border-color: var(--text);
    }
    pre code {
      display: block;
      background: var(--code-bg);
      border: 1px solid var(--border);
      padding: 16px;
      font-family: var(--mono);
      font-size: 12px;
      line-height: 1.55;
      color: var(--text);
      overflow-x: auto;
      max-height: 340px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 12px;
      border: 1px solid var(--border);
    }
    th, td {
      text-align: left;
      padding: 9px 12px;
      border-bottom: 1px solid var(--border);
      border-right: 1px solid var(--border);
    }
    th {
      font-family: var(--mono);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
      background: var(--surface);
    }

    /* Cmd+K Modal */
    .modal-bg {
      position: fixed; inset: 0; z-index: 50; display: none;
      align-items: flex-start; justify-content: center; padding-top: 96px;
      background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
    }
    .modal-bg.open { display: flex; }
    .modal-box {
      width: 100%; max-width: 520px; background: var(--bg);
      border: 1px solid var(--border-strong); border-radius: 8px; overflow: hidden;
    }
    .modal-box input {
      width: 100%; padding: 14px 16px; background: var(--surface);
      border: none; border-bottom: 1px solid var(--border);
      color: var(--text); font-family: var(--mono); font-size: 13px; outline: none;
    }

    /* Footer */
    .footer {
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
  </style>
</head>
<body>
  <div class="shell">
    <!-- Topbar -->
    <header class="section topbar">
      <span class="crosshair ch-bl">+</span>
      <span class="crosshair ch-br">+</span>
      <div class="brand">
        <div class="brand-mark">M</div>
        <span>MonarchUI</span>
        <span class="tech-label" style="margin-left:6px;">v1.0.0</span>
      </div>
      <div class="topbar-actions">
        <button class="btn" onclick="toggleCmdK()">Search <span class="kbd">&#8984;K</span></button>
        <button class="btn" id="modeBtn" onclick="toggleMode()">Dark Mode</button>
        <a href="https://jatinsh.netlify.app/" target="_blank" class="btn">Jatin Sharma &nearr;</a>
      </div>
    </header>

    <!-- Hero -->
    <section class="section hero">
      <span class="crosshair ch-bl">+</span>
      <span class="crosshair ch-br">+</span>
      <div>
        <div class="tech-label">01 // OVERVIEW &middot; STRUCTURAL UI PRIMITIVES</div>
        <h1>Zero-dependency React &amp; Tailwind UI components with architectural precision.</h1>
        <p>Copy-paste or CLI-install 12 self-contained spatial, bento, and interactive primitives. Engineered with crisp 1px wireframe geometry and spring physics.</p>
      </div>
      <div class="hero-controls">
        <button class="btn btn-primary" onclick="copyText('npx monarchui add spotlight-bento', this)">npx monarchui add spotlight-bento</button>
        <button class="btn" onclick="document.getElementById('registryAnchor').scrollIntoView({behavior:'smooth'})">Browse 12 Specs &darr;</button>
      </div>
    </section>

    <div class="ruler-strip"></div>

    <!-- Interactive Structural Grid -->
    <section class="section grid-3">
      <span class="crosshair ch-bl">+</span>
      <span class="crosshair ch-br">+</span>

      <div class="cell cell-span-2">
        <div class="tech-label">02 // INTERACTIVE DECK &middot; SPRING PHYSICS</div>
        <div class="deck-stage" id="deckStage"></div>
        <div class="deck-nav">
          <div style="display:flex; gap:6px;">
            <button class="btn" onclick="stepDeck(-1)"><span class="kbd">&larr;</span> Prev</button>
            <button class="btn" onclick="stepDeck(1)">Next <span class="kbd">&rarr;</span></button>
          </div>
          <span class="tech-label" id="deckCounter">01 / 12</span>
        </div>
      </div>

      <div class="cell" style="display:flex; flex-direction:column; justify-content:space-between; gap:18px;">
        <div>
          <div class="tech-label">03 // TELEMETRY</div>
          <div style="margin-top:14px; display:grid; grid-template-columns:1fr 1fr; border:1px solid var(--border);">
            <div style="padding:12px; border-right:1px solid var(--border); border-bottom:1px solid var(--border);">
              <div class="tech-label">PRIMITIVES</div>
              <div style="font-family:var(--mono); font-size:22px; font-weight:600; margin-top:4px;">12</div>
            </div>
            <div style="padding:12px; border-bottom:1px solid var(--border);">
              <div class="tech-label">DEPS</div>
              <div style="font-family:var(--mono); font-size:22px; font-weight:600; margin-top:4px;">0</div>
            </div>
            <div style="padding:12px; border-right:1px solid var(--border);">
              <div class="tech-label">THEMES</div>
              <div style="font-family:var(--mono); font-size:22px; font-weight:600; margin-top:4px;">4</div>
            </div>
            <div style="padding:12px;">
              <div class="tech-label">SHADOWS</div>
              <div style="font-family:var(--mono); font-size:22px; font-weight:600; margin-top:4px;">0px</div>
            </div>
          </div>
        </div>

        <div style="border-top:1px dashed var(--border); padding-top:16px;">
          <div class="tech-label">04 // SPLIT COMPARISON</div>
          <div style="position:relative; height:48px; margin-top:10px; border:1px solid var(--border); background:var(--surface); display:flex; align-items:center; justify-content:flex-end; padding:0 12px; font-family:var(--mono); font-size:11px;">
            <span>MONARCH</span>
            <div id="splitOverlay" style="position:absolute; inset:0 auto 0 0; width:50%; background:var(--surface-hover); border-right:1px solid var(--text); display:flex; align-items:center; padding-left:12px; overflow:hidden; color:var(--muted);">RAW</div>
            <input type="range" min="10" max="90" value="50" oninput="document.getElementById('splitOverlay').style.width=this.value+'%'" style="position:absolute; inset:0; opacity:0; cursor:ew-resize;" />
          </div>
        </div>
      </div>
    </section>

    <!-- Registry Header -->
    <div id="registryAnchor" class="section-dashed" style="padding:14px 24px; display:flex; justify-content:space-between; align-items:center;">
      <span class="tech-label">05 // COMPONENT REGISTRY &amp; CODE INSPECTOR</span>
      <span class="tech-label">REACT + TAILWIND &middot; VANILLA HTML/CSS</span>
    </div>

    <!-- Split Rail Workbench -->
    <section class="section workbench">
      <span class="crosshair ch-bl">+</span>
      <span class="crosshair ch-br">+</span>
      <aside class="rail" id="railList"></aside>
      <main class="inspector" id="inspectorPane"></main>
    </section>

    <div class="ruler-strip"></div>

    <!-- Footer -->
    <footer class="footer">
      <span class="tech-label">MONARCHUI // ARCHITECTURAL DESIGN SYSTEM</span>
      <span class="tech-label">MIT LICENSE &middot; BUILT BY JATIN SHARMA</span>
    </footer>
  </div>

  <!-- Cmd+K Modal -->
  <div class="modal-bg" id="cmdkModal" onclick="toggleCmdK()">
    <div class="modal-box" onclick="event.stopPropagation()">
      <input id="cmdkInput" placeholder="Filter components by name or category..." oninput="renderCmdK(this.value)" />
      <div id="cmdkResults" style="max-height:280px; overflow-y:auto;"></div>
    </div>
  </div>

  <script>
    const COMPONENTS = ${componentsJson};
    let activeIdx = 0;
    let codeMode = 'react';

    function toggleMode() {
      const html = document.documentElement;
      const next = html.getAttribute('data-mode') === 'light' ? 'dark' : 'light';
      html.setAttribute('data-mode', next);
      document.getElementById('modeBtn').innerText = next === 'light' ? 'Dark Mode' : 'Light Mode';
    }

    function copyText(txt, btn) {
      navigator.clipboard?.writeText(txt);
      if (btn) {
        const old = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => { btn.innerText = old; }, 1100);
      }
    }

    function renderDeck() {
      const stage = document.getElementById('deckStage');
      stage.innerHTML = COMPONENTS.map((c, idx) => {
        const offset = idx - activeIdx;
        const abs = Math.abs(offset);
        const visible = abs <= 2;
        const tx = offset * 175;
        const scale = offset === 0 ? 1 : 0.86;
        const rotY = offset * -14;
        const opacity = visible ? (offset === 0 ? 1 : 0.52) : 0;
        return '<div class="deck-card ' + (offset === 0 ? 'active' : '') + '" onclick="selectIndex(' + idx + ')" style="transform: perspective(900px) translateX(' + tx + 'px) scale(' + scale + ') rotateY(' + rotY + 'deg); opacity:' + opacity + '; z-index:' + (10 - abs) + '; pointer-events:' + (visible ? 'auto' : 'none') + ';">' +
          '<div class="tech-label">' + String(idx + 1).padStart(2, '0') + ' // ' + c.category + '</div>' +
          '<div><div style="font-size:15px; font-weight:600; letter-spacing:-0.02em;">' + c.name + '</div>' +
          '<div style="font-size:11px; color:var(--muted); margin-top:4px;">' + c.filename + '</div></div>' +
          '</div>';
      }).join('');
      document.getElementById('deckCounter').innerText = String(activeIdx + 1).padStart(2, '0') + ' / ' + String(COMPONENTS.length).padStart(2, '0');
    }

    function stepDeck(delta) {
      activeIdx = (activeIdx + delta + COMPONENTS.length) % COMPONENTS.length;
      renderAll();
    }

    function selectIndex(idx) {
      activeIdx = idx;
      renderAll();
    }

    function renderRail() {
      document.getElementById('railList').innerHTML = COMPONENTS.map((c, idx) =>
        '<button class="rail-item ' + (idx === activeIdx ? 'active' : '') + '" onclick="selectIndex(' + idx + ')">' +
          '<span><span class="rail-idx">' + String(idx + 1).padStart(2, '0') + '</span>' + c.name + '</span>' +
          '<span class="tech-label">' + c.category + '</span>' +
        '</button>'
      ).join('');
    }

    function setCodeMode(mode) {
      codeMode = mode;
      renderInspector();
    }

    function renderInspector() {
      const c = COMPONENTS[activeIdx];
      const code = codeMode === 'react' ? c.reactCode : c.vanillaCode;
      const escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      document.getElementById('inspectorPane').innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap;">' +
          '<div><div class="tech-label">' + String(activeIdx + 1).padStart(2, '0') + ' // ' + c.category + ' &middot; ' + c.id + '</div>' +
          '<h2 style="font-size:22px; font-weight:600; letter-spacing:-0.025em; margin-top:6px;">' + c.name + '</h2>' +
          '<p style="font-size:13px; color:var(--muted); margin-top:6px; max-width:580px; line-height:1.55;">' + c.description + '</p></div>' +
          '<button class="btn" onclick="copyText(\\'npx monarchui add ' + c.id + '\\', this)"><code>npx monarchui add ' + c.id + '</code></button>' +
        '</div>' +
        '<div class="tabs">' +
          '<button class="tab ' + (codeMode==='react'?'active':'') + '" onclick="setCodeMode(\\'react\\')">React + Tailwind (' + c.filename + ')</button>' +
          '<button class="tab ' + (codeMode==='vanilla'?'active':'') + '" onclick="setCodeMode(\\'vanilla\\')">HTML + CSS + JS</button>' +
          '<button class="tab" id="copyCodeBtn">Copy Source</button>' +
        '</div>' +
        '<pre><code>' + escaped + '</code></pre>' +
        '<div class="tech-label" style="margin-top:20px;">PROPS SPECIFICATION</div>' +
        '<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>' +
          c.props.map(p => '<tr><td style="font-family:var(--mono); font-weight:600;">' + p.name + '</td><td style="font-family:var(--mono); color:var(--muted);">' + p.type + '</td><td style="font-family:var(--mono);">' + p.defaultValue + '</td><td style="color:var(--muted);">' + p.description + '</td></tr>').join('') +
        '</tbody></table>';
      document.getElementById('copyCodeBtn').onclick = function() { copyText(code, this); };
    }

    function renderAll() {
      renderDeck();
      renderRail();
      renderInspector();
    }

    function toggleCmdK() {
      const m = document.getElementById('cmdkModal');
      m.classList.toggle('open');
      if (m.classList.contains('open')) {
        const inp = document.getElementById('cmdkInput');
        inp.value = ''; inp.focus(); renderCmdK('');
      }
    }

    function renderCmdK(q) {
      const list = COMPONENTS.map((c, idx) => ({ c, idx }))
        .filter(x => x.c.name.toLowerCase().includes(q.toLowerCase()) || x.c.id.includes(q.toLowerCase()));
      document.getElementById('cmdkResults').innerHTML = list.map(x =>
        '<button class="rail-item" onclick="selectIndex(' + x.idx + '); toggleCmdK();">' +
          '<span><span class="rail-idx">' + String(x.idx + 1).padStart(2, '0') + '</span>' + x.c.name + '</span>' +
          '<span class="tech-label">' + x.c.category + '</span>' +
        '</button>'
      ).join('');
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggleCmdK(); }
      else if (e.key === 'Escape') document.getElementById('cmdkModal').classList.remove('open');
      else if (e.key === 'ArrowLeft' && document.activeElement.tagName !== 'INPUT') stepDeck(-1);
      else if (e.key === 'ArrowRight' && document.activeElement.tagName !== 'INPUT') stepDeck(1);
    });

    window.addEventListener('DOMContentLoaded', renderAll);
  </script>
</body>
</html>`;
  }
}
