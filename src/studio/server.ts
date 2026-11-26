/**
 * MonarchUI Interactive Luxury Studio Server (Port 7272)
 * Showcases all 12 Royal & Spatial UI components live with theme switching,
 * interactive physics previews, Props API tables, Cmd+K palette, and 1-click code export.
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
          const preset = (url.searchParams.get('id') || 'royal-obsidian') as ThemePresetId;
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
    const themesJson = JSON.stringify(ThemeEngine.listPresets());

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MonarchUI Studio | Royal Spatial &amp; Bento UI Registry</title>
  <style>
    :root {
      --bg: #050507;
      --surface: rgba(18, 19, 26, 0.72);
      --border: rgba(229, 193, 88, 0.18);
      --accent: #e5c158;
      --accent2: #f5e1a4;
      --text: #fafafa;
      --muted: #a1a1aa;
      --glow: rgba(229, 193, 88, 0.25);
      --blur: 20px;
      --radius: 20px;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      overflow-x: hidden;
      transition: background 0.35s ease, color 0.35s ease;
    }
    .aurora-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background:
        radial-gradient(600px circle at 20% 10%, var(--glow), transparent 60%),
        radial-gradient(500px circle at 85% 80%, rgba(56, 189, 248, 0.08), transparent 60%);
    }
    .container { position: relative; z-index: 1; max-width: 1320px; margin: 0 auto; padding: 28px 24px 80px; }
    header {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;
      padding: 14px 22px; border-radius: 999px; border: 1px solid var(--border);
      background: var(--surface); backdrop-filter: blur(var(--blur)); margin-bottom: 34px;
    }
    .brand { display: flex; align-items: center; gap: 12px; }
    .crown {
      width: 34px; height: 34px; border-radius: 10px;
      background: linear-gradient(135deg, var(--accent2), var(--accent));
      color: #050507; display: grid; place-items: center; font-weight: 900; font-size: 16px;
      box-shadow: 0 0 22px var(--glow);
    }
    .brand h1 { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
    .brand span { font-size: 12px; color: var(--muted); margin-left: 6px; }
    .nav-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    select, button { font-family: inherit; }
    .theme-select {
      background: rgba(0,0,0,0.25); color: var(--text); border: 1px solid var(--border);
      border-radius: 999px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .cmd-btn {
      background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid var(--border);
      border-radius: 999px; padding: 7px 14px; font-size: 12px; cursor: pointer;
    }
    .hero {
      text-align: center; padding: 36px 16px 42px;
    }
    .eyebrow {
      display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.22em;
      text-transform: uppercase; color: var(--accent); margin-bottom: 14px;
      border: 1px solid var(--border); padding: 5px 14px; border-radius: 999px;
      background: var(--surface);
    }
    .hero h2 {
      font-size: clamp(32px, 5vw, 58px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.06;
      max-width: 820px; margin: 0 auto;
    }
    .hero p {
      max-width: 620px; margin: 16px auto 26px; font-size: 15px; line-height: 1.6; color: var(--muted);
    }
    .hero-cta-row { display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; }
    .royal-btn {
      background: linear-gradient(135deg, var(--accent2), var(--accent));
      color: #050507; border: none; border-radius: 999px; padding: 12px 26px;
      font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 0 30px var(--glow);
      transition: transform 0.15s ease-out;
    }
    .cli-pill {
      font-family: var(--mono); font-size: 12px; padding: 11px 18px; border-radius: 999px;
      border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer;
    }
    /* Live Interactive Bento Showcase */
    .bento-showcase {
      display: grid; grid-template-columns: repeat(12, 1fr); gap: 16px; margin: 28px 0 42px;
    }
    .bento-cell {
      position: relative; overflow: hidden; border-radius: var(--radius);
      border: 1px solid var(--border); background: var(--surface);
      backdrop-filter: blur(var(--blur)); padding: 22px;
      transition: transform 0.25s ease, border-color 0.25s ease;
    }
    .bento-cell::before {
      content: ""; position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s; pointer-events: none;
      background: radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 60%);
    }
    .bento-cell:hover::before { opacity: 1; }
    .col-4 { grid-column: span 4; }
    .col-6 { grid-column: span 6; }
    .col-8 { grid-column: span 8; }
    .col-12 { grid-column: span 12; }
    @media (max-width: 900px) { .col-4, .col-6, .col-8 { grid-column: span 12; } }
    .cell-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
    .cell-title { font-size: 17px; font-weight: 700; margin-bottom: 6px; }
    .cell-desc { font-size: 13px; color: var(--muted); margin-bottom: 16px; }

    /* Spatial Dock Preview */
    .dock-bar {
      display: inline-flex; align-items: flex-end; gap: 10px; padding: 10px 16px;
      border-radius: 18px; border: 1px solid var(--border); background: rgba(0,0,0,0.45);
    }
    .dock-ico {
      width: 40px; height: 40px; border-radius: 11px; border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06); display: grid; place-items: center; font-size: 18px;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
    }
    .dock-ico:hover { transform: scale(1.42) translateY(-8px); }

    /* Dynamic Island */
    .island {
      display: inline-flex; align-items: center; gap: 10px; background: #000; color: #fff;
      border: 1px solid rgba(255,255,255,0.18); border-radius: 999px; padding: 9px 18px;
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    }
    .island .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
    .island .more { display: none; color: #94a3b8; font-weight: 400; }
    .island.open { padding: 13px 22px; }
    .island.open .more { display: inline; }

    /* Marquee */
    .marquee { overflow: hidden; mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent); }
    .marquee-track { display: flex; gap: 28px; width: max-content; animation: mscroll 18s linear infinite; }
    .marquee-track:hover { animation-play-state: paused; }
    .marquee-pill {
      padding: 7px 16px; border-radius: 999px; border: 1px solid var(--border);
      font-size: 11px; font-weight: 700; letter-spacing: 0.16em; color: var(--muted);
    }
    @keyframes mscroll { to { transform: translateX(-50%); } }

    /* Registry Split Workbench */
    .workbench { display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start; }
    @media (max-width: 900px) { .workbench { grid-template-columns: 1fr; } }
    .sidebar {
      border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface);
      backdrop-filter: blur(var(--blur)); padding: 14px;
    }
    .comp-item {
      width: 100%; text-align: left; background: transparent; border: 1px solid transparent;
      color: var(--text); padding: 10px 12px; border-radius: 12px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;
      font-size: 13px; font-weight: 600;
    }
    .comp-item:hover, .comp-item.active {
      background: rgba(255,255,255,0.06); border-color: var(--border);
    }
    .tier-tag {
      font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 999px;
      background: rgba(229,193,88,0.14); color: var(--accent);
    }
    .inspector {
      border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface);
      backdrop-filter: blur(var(--blur)); padding: 24px;
    }
    .tabs { display: flex; gap: 8px; margin: 16px 0 12px; flex-wrap: wrap; }
    .tab-btn {
      background: rgba(255,255,255,0.05); color: var(--text); border: 1px solid var(--border);
      border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 700; cursor: pointer;
    }
    .tab-btn.active { background: var(--accent); color: #050507; }
    pre code {
      display: block; background: #030305; border: 1px solid var(--border); border-radius: 12px;
      padding: 16px; font-family: var(--mono); font-size: 12px; line-height: 1.55;
      color: #e4e4e7; overflow-x: auto; max-height: 360px;
    }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--border); }
    th { color: var(--accent); font-size: 11px; text-transform: uppercase; }
    .modal-bg {
      position: fixed; inset: 0; z-index: 50; display: none; align-items: flex-start; justify-content: center;
      padding-top: 90px; background: rgba(0,0,0,0.72); backdrop-filter: blur(10px);
    }
    .modal-bg.open { display: flex; }
    .modal-box {
      width: 100%; max-width: 520px; border-radius: 18px; border: 1px solid var(--border);
      background: #0c0d12; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.65);
    }
    .modal-box input {
      width: 100%; padding: 15px 18px; background: transparent; border: none;
      border-bottom: 1px solid var(--border); color: #fff; font-size: 14px; outline: none;
    }
  </style>
</head>
<body>
  <div class="aurora-bg"></div>
  <div class="container">
    <header>
      <div class="brand">
        <div class="crown">M</div>
        <div>
          <h1>MonarchUI <span>v1.0 &middot; 12 Luxury Primitives</span></h1>
        </div>
      </div>
      <div class="nav-actions">
        <select id="themeSelect" class="theme-select" onchange="applyTheme(this.value)"></select>
        <button class="cmd-btn" onclick="toggleCmdK()">&#8984;K Quick Jump</button>
        <a href="https://jatinsh.netlify.app/" target="_blank" style="font-size:12px; color:var(--accent); text-decoration:none; font-weight:700;">by Jatin Sharma</a>
      </div>
    </header>

    <section class="hero">
      <div class="eyebrow">Royal Spatial &amp; Bento Component Registry</div>
      <h2>Interfaces Crafted Like Luxury Hardware.</h2>
      <p>Copy-paste or CLI-install 12 zero-dependency React, Tailwind &amp; Vanilla primitives inspired by Apple.com, Linear, and Bento.dev.</p>
      <div class="hero-cta-row">
        <button class="royal-btn" id="magBtn" onmousemove="magnetize(event, this)" onmouseleave="this.style.transform='none'" onclick="document.getElementById('registrySection').scrollIntoView({behavior:'smooth'})">
          Explore 12 Components &rarr;
        </button>
        <button class="cli-pill" onclick="copyText('npx monarchui add spotlight-bento', this)">npx monarchui add spotlight-bento</button>
      </div>
    </section>

    <section class="bento-showcase">
      <div class="bento-cell col-8" onmousemove="spot(event, this)">
        <div class="cell-kicker">01 &middot; Live Spotlight Bento &amp; Marquee</div>
        <div class="cell-title">Cursor-Tracked Hairline Illumination</div>
        <p class="cell-desc">Move your cursor across any card to illuminate its borders, paired with our infinite alpha-masked marquee.</p>
        <div class="marquee">
          <div class="marquee-track">
            <span class="marquee-pill">APPLE SPATIAL</span><span class="marquee-pill">BENTO.DEV</span>
            <span class="marquee-pill">LINEAR PRECISION</span><span class="marquee-pill">STRIPE 3D</span>
            <span class="marquee-pill">RAYCAST CMD+K</span><span class="marquee-pill">APPLE SPATIAL</span>
            <span class="marquee-pill">BENTO.DEV</span><span class="marquee-pill">LINEAR PRECISION</span>
            <span class="marquee-pill">STRIPE 3D</span><span class="marquee-pill">RAYCAST CMD+K</span>
          </div>
        </div>
      </div>

      <div class="bento-cell col-4" id="card3d" onmousemove="tilt3d(event, this)" onmouseleave="this.style.transform='none'">
        <div class="cell-kicker">02 &middot; Kinetic 3D Card</div>
        <div class="cell-title">Monarch Black Edition</div>
        <p class="cell-desc">Hover to feel real-time 3D perspective physics &amp; specular sheen.</p>
        <div style="font-family:var(--mono); font-size:24px; font-weight:900; color:var(--accent);">$148,920 <span style="font-size:12px; color:#10b981;">+24.8%</span></div>
      </div>

      <div class="bento-cell col-4" onmousemove="spot(event, this)">
        <div class="cell-kicker">03 &middot; Spatial Glass Dock</div>
        <div class="cell-title">Spring Magnification</div>
        <p class="cell-desc">Hover icons for Cupertino dock lift.</p>
        <div class="dock-bar">
          <div class="dock-ico">&#9889;</div>
          <div class="dock-ico">&#128142;</div>
          <div class="dock-ico">&#127912;</div>
          <div class="dock-ico">&#128640;</div>
        </div>
      </div>

      <div class="bento-cell col-4" onmousemove="spot(event, this)">
        <div class="cell-kicker">04 &middot; Dynamic Island Pill</div>
        <div class="cell-title">Morphing Live Status</div>
        <p class="cell-desc">Click pill to expand live telemetry.</p>
        <div class="island" onclick="this.classList.toggle('open')">
          <span class="dot"></span> Deployment Live <span class="more">&middot; 38 Edge PoPs Synced</span>
        </div>
      </div>

      <div class="bento-cell col-4" onmousemove="spot(event, this)">
        <div class="cell-kicker">05 &middot; Tactile Split Compare</div>
        <div class="cell-title">Drag to Compare UI</div>
        <div style="position:relative; height:64px; border-radius:12px; overflow:hidden; background:#14151c; border:1px solid var(--border); display:flex; align-items:center; justify-content:flex-end; padding:12px; font-size:11px; font-weight:800; color:var(--accent);">
          <span>MONARCH UI</span>
          <div id="splitPane" style="position:absolute; inset:0 auto 0 0; width:48%; background:#27272a; border-right:2px solid var(--accent); display:flex; align-items:center; padding:12px; color:#a1a1aa;">STANDARD</div>
          <input type="range" min="10" max="90" value="48" oninput="document.getElementById('splitPane').style.width=this.value+'%'" style="position:absolute; inset:0; opacity:0; cursor:ew-resize;" />
        </div>
      </div>
    </section>

    <section id="registrySection" class="workbench">
      <aside class="sidebar" id="componentList"></aside>
      <main class="inspector" id="inspectorPane"></main>
    </section>
  </div>

  <div class="modal-bg" id="cmdkModal" onclick="toggleCmdK()">
    <div class="modal-box" onclick="event.stopPropagation()">
      <input id="cmdkInput" placeholder="Jump to any MonarchUI component..." oninput="renderCmdK(this.value)" />
      <div id="cmdkResults" style="padding:8px; max-height:280px; overflow-y:auto;"></div>
    </div>
  </div>

  <script>
    const COMPONENTS = ${componentsJson};
    const THEMES = ${themesJson};
    let activeId = COMPONENTS[0].id;
    let codeMode = 'react';

    function spot(e, el) {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
    function tilt3d(e, el) {
      spot(e, el);
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 16) + 'deg) rotateY(' + ((px - 0.5) * 16) + 'deg)';
    }
    function magnetize(e, el) {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.22;
      el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }
    function applyTheme(id) {
      const t = THEMES.find(x => x.id === id) || THEMES[0];
      const root = document.documentElement.style;
      root.setProperty('--bg', t.bgCanvas);
      root.setProperty('--surface', t.bgSurface);
      root.setProperty('--border', t.borderHairline);
      root.setProperty('--accent', t.accentPrimary);
      root.setProperty('--accent2', t.accentSecondary);
      root.setProperty('--text', t.textPrimary);
      root.setProperty('--muted', t.textMuted);
      root.setProperty('--glow', t.glowColor);
      root.setProperty('--blur', t.blurPx + 'px');
      root.setProperty('--radius', t.radiusPx + 'px');
    }
    function copyText(txt, btn) {
      navigator.clipboard?.writeText(txt);
      if (btn) { const old = btn.innerText; btn.innerText = 'Copied!'; setTimeout(() => btn.innerText = old, 1200); }
    }
    function renderSidebar() {
      document.getElementById('componentList').innerHTML = COMPONENTS.map(c =>
        '<button class="comp-item ' + (c.id === activeId ? 'active' : '') + '" onclick="selectComponent(\\'' + c.id + '\\')">' +
        '<span>' + c.name + '</span><span class="tier-tag">' + c.tier + '</span></button>'
      ).join('');
    }
    function selectComponent(id) {
      activeId = id;
      renderSidebar();
      renderInspector();
    }
    function setCodeMode(mode) {
      codeMode = mode;
      renderInspector();
    }
    function renderInspector() {
      const c = COMPONENTS.find(x => x.id === activeId) || COMPONENTS[0];
      const code = codeMode === 'react' ? c.reactCode : c.vanillaCode;
      const escaped = code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      document.getElementById('inspectorPane').innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">' +
          '<div><div class="cell-kicker">' + c.category + ' &middot; ' + c.tier + ' Tier</div>' +
          '<h3 style="font-size:24px; font-weight:800;">' + c.name + '</h3>' +
          '<p style="color:var(--muted); font-size:13px; margin-top:6px;">' + c.description + '</p></div>' +
          '<button class="cli-pill" onclick="copyText(\\'npx monarchui add ' + c.id + '\\', this)">npx monarchui add ' + c.id + '</button>' +
        '</div>' +
        '<div style="display:flex; gap:8px; margin-top:14px; flex-wrap:wrap;">' +
          c.designPatterns.map(p => '<span class="tier-tag">' + p + '</span>').join('') +
        '</div>' +
        '<div class="tabs">' +
          '<button class="tab-btn ' + (codeMode==='react'?'active':'') + '" onclick="setCodeMode(\\'react\\')">React + Tailwind (' + c.filename + ')</button>' +
          '<button class="tab-btn ' + (codeMode==='vanilla'?'active':'') + '" onclick="setCodeMode(\\'vanilla\\')">HTML + CSS + JS</button>' +
          '<button class="tab-btn" id="copyCodeBtn">Copy Source Code</button>' +
        '</div>' +
        '<pre><code>' + escaped + '</code></pre>' +
        '<h4 style="margin-top:20px; font-size:13px; text-transform:uppercase; color:var(--accent);">Props API</h4>' +
        '<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>' +
          c.props.map(p => '<tr><td style="font-family:var(--mono); color:var(--accent2);">' + p.name + '</td><td style="font-family:var(--mono);">' + p.type + '</td><td style="font-family:var(--mono);">' + p.defaultValue + '</td><td style="color:var(--muted);">' + p.description + '</td></tr>').join('') +
        '</tbody></table>';
      document.getElementById('copyCodeBtn').onclick = function() { copyText(code, this); };
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
      const list = COMPONENTS.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.id.includes(q.toLowerCase()));
      document.getElementById('cmdkResults').innerHTML = list.map(c =>
        '<button class="comp-item" onclick="selectComponent(\\'' + c.id + '\\'); toggleCmdK();"><span>' + c.name + '</span><span class="tier-tag">' + c.category + '</span></button>'
      ).join('');
    }
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); toggleCmdK(); }
      if (e.key === 'Escape') document.getElementById('cmdkModal').classList.remove('open');
    });
    window.addEventListener('DOMContentLoaded', () => {
      document.getElementById('themeSelect').innerHTML = THEMES.map(t => '<option value="' + t.id + '">' + t.name + '</option>').join('');
      renderSidebar();
      renderInspector();
    });
  </script>
</body>
</html>`;
  }
}
