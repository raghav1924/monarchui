/**
 * MonarchUI Flagship Component Registry (12 Luxury UI Primitives)
 * Self-contained React + TypeScript + Tailwind CSS & Vanilla HTML/CSS/JS components.
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import { MonarchComponent } from '../types.js';

export const MONARCH_COMPONENTS: MonarchComponent[] = [
  {
    id: 'spotlight-bento',
    name: 'Royal Spotlight Bento Grid',
    category: 'Layout',
    tier: 'Royal',
    tagline: 'Cursor-tracking radial spotlight borders across asymmetrical bento cells.',
    description:
      'Inspired by Apple.com and Bento.dev. Tracks pointer coordinates per cell using CSS custom properties to illuminate 1px hairline borders and soft radial aura.',
    designPatterns: ['#12 Bento Grid', '#20 Dark Mode UI', '#10 Glassmorphism'],
    filename: 'SpotlightBento.tsx',
    props: [
      { name: 'items', type: 'BentoItem[]', defaultValue: '[]', description: 'Array of title, description, span, and icon entries.' },
      { name: 'spotlightColor', type: 'string', defaultValue: '"rgba(229,193,88,0.22)"', description: 'Radial glow color on pointer move.' }
    ],
    reactCode: `import React, { useRef } from 'react';

export interface BentoItem {
  title: string;
  description: string;
  badge?: string;
  colSpan?: string;
}

export function SpotlightBento({
  items,
  spotlightColor = 'rgba(229, 193, 88, 0.22)'
}: {
  items: BentoItem[];
  spotlightColor?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {items.map((item, idx) => (
        <SpotlightCell key={idx} item={item} spotlightColor={spotlightColor} />
      ))}
    </div>
  );
}

function SpotlightCell({ item, spotlightColor }: { item: BentoItem; spotlightColor: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mx', \`\${e.clientX - rect.left}px\`);
    cardRef.current.style.setProperty('--my', \`\${e.clientY - rect.top}px\`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={\`group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 \${item.colSpan || 'md:col-span-4'}\`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: \`radial-gradient(420px circle at var(--mx) var(--my), \${spotlightColor}, transparent 60%)\` }}
      />
      {item.badge && (
        <span className="mb-3 inline-block rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-amber-200 uppercase">
          {item.badge}
        </span>
      )}
      <h3 className="text-lg font-semibold tracking-tight text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.description}</p>
    </div>
  );
}
`,
    vanillaCode: `<div class="monarch-bento">
  <div class="bento-card" onmousemove="this.style.setProperty('--mx', event.offsetX+'px');this.style.setProperty('--my', event.offsetY+'px')">
    <span class="bento-pill">Royal</span>
    <h3>Spatial Precision</h3>
    <p>Cursor-tracked hairline illumination.</p>
  </div>
</div>
<style>
.monarch-bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.bento-card { position: relative; background: #0c0d12; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 24px; overflow: hidden; }
.bento-card::before { content: ""; position: absolute; inset: 0; opacity: 0; transition: opacity .3s; background: radial-gradient(360px circle at var(--mx) var(--my), rgba(229,193,88,0.22), transparent 60%); pointer-events: none; }
.bento-card:hover::before { opacity: 1; }
</style>`
  },
  {
    id: 'spatial-dock',
    name: 'Apple Spatial Glass Dock',
    category: 'Navigation',
    tier: 'Spatial',
    tagline: 'macOS-grade spring magnification dock with frosted glass and floating pills.',
    description: 'Smooth distance-based icon scaling with blurred obsidian glass surface and dynamic hover labels.',
    designPatterns: ['#10 Glassmorphism', '#20 Dark Mode UI', '#18 Ethereal'],
    filename: 'SpatialDock.tsx',
    props: [
      { name: 'items', type: 'DockItem[]', defaultValue: '[]', description: 'Dock icons, labels, and click callbacks.' },
      { name: 'magnification', type: 'number', defaultValue: '1.45', description: 'Peak scale factor on direct hover.' }
    ],
    reactCode: `import React, { useState } from 'react';

export interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export function SpatialDock({ items, magnification = 1.45 }: { items: DockItem[]; magnification?: number }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="inline-flex items-end gap-3 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 shadow-2xl backdrop-blur-2xl">
      {items.map((item, idx) => {
        const dist = hoveredIdx === null ? 99 : Math.abs(hoveredIdx - idx);
        const scale = dist === 0 ? magnification : dist === 1 ? 1.2 : 1;
        return (
          <button
            key={item.id}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onClick={item.onClick}
            style={{ transform: \`scale(\${scale}) translateY(\${dist === 0 ? -8 : dist === 1 ? -3 : 0}px)\` }}
            className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-200 ease-out"
          >
            {item.icon}
            <span className="pointer-events-none absolute -top-9 rounded-md border border-white/15 bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
`,
    vanillaCode: `<nav class="spatial-dock">
  <button class="dock-item" title="Home">&#127968;</button>
  <button class="dock-item" title="Studio">&#10024;</button>
  <button class="dock-item" title="Tokens">&#128142;</button>
</nav>
<style>
.spatial-dock { display:inline-flex; gap:12px; padding:12px 18px; border-radius:20px; background:rgba(12,13,18,0.75); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.14); }
.dock-item { width:44px; height:44px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.06); color:#fff; transition:transform .2s cubic-bezier(.16,1,.3,1); cursor:pointer; }
.dock-item:hover { transform: scale(1.38) translateY(-8px); }
</style>`
  },
  {
    id: 'kinetic-card-3d',
    name: 'Kinetic 3D Perspective Card',
    category: 'Spatial',
    tier: 'Royal',
    tagline: 'Apple Card / Stripe-inspired 3D tilt surface with specular light sheen.',
    description: 'Computes normalized pointer offsets to apply perspective rotateX/rotateY transforms and a moving metallic glare overlay.',
    designPatterns: ['#15 Luxury Typography', '#10 Glassmorphism', '#18 Ethereal'],
    filename: 'KineticCard3D.tsx',
    props: [
      { name: 'children', type: 'React.ReactNode', defaultValue: '-', description: 'Card inner content.' },
      { name: 'maxTiltDeg', type: 'number', defaultValue: '12', description: 'Maximum tilt angle in degrees.' }
    ],
    reactCode: `import React, { useRef, useState } from 'react';

export function KineticCard3D({ children, maxTiltDeg = 12 }: { children: React.ReactNode; maxTiltDeg?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setStyle({
      rx: (0.5 - py) * maxTiltDeg * 2,
      ry: (px - 0.5) * maxTiltDeg * 2,
      gx: px * 100,
      gy: py * 100
    });
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setStyle({ rx: 0, ry: 0, gx: 50, gy: 50 })}
        style={{ transform: \`rotateX(\${style.rx}deg) rotateY(\${style.ry}deg)\` }}
        className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-7 shadow-2xl transition-transform duration-150 ease-out"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: \`radial-gradient(circle at \${style.gx}% \${style.gy}%, rgba(229,193,88,0.35), transparent 55%)\` }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
`,
    vanillaCode: `<div class="kinetic-card" onmousemove="const r=this.getBoundingClientRect();const x=(event.clientX-r.left)/r.width;const y=(event.clientY-r.top)/r.height;this.style.transform='perspective(900px) rotateX('+((0.5-y)*18)+'deg) rotateY('+((x-0.5)*18)+'deg)'" onmouseleave="this.style.transform='perspective(900px) rotateX(0) rotateY(0)'">
  <h4>MONARCH BLACK</h4>
  <p>Spatial Specular Surface</p>
</div>
<style>
.kinetic-card { padding:28px; border-radius:22px; background:linear-gradient(135deg,#15161c,#050507); border:1px solid rgba(229,193,88,0.3); color:#fff; transition:transform .15s ease-out; }
</style>`
  },
  {
    id: 'command-palette',
    name: 'Command-K Spotlight Palette',
    category: 'Navigation',
    tier: 'Signature',
    tagline: 'Raycast / Linear-grade Cmd+K modal launcher with instant filtering.',
    description: 'Global keyboard listener (Cmd+K / Ctrl+K) opening a frosted command surface with fuzzy search and arrow-key selection.',
    designPatterns: ['#10 Glassmorphism', '#3 Swiss Design', '#20 Dark Mode UI'],
    filename: 'CommandPalette.tsx',
    props: [
      { name: 'commands', type: 'CommandItem[]', defaultValue: '[]', description: 'Searchable command entries.' }
    ],
    reactCode: `import React, { useEffect, useState } from 'react';

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

export function CommandPalette({ commands }: { commands: CommandItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!open) return null;
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-24 backdrop-blur-md" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/95 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search..."
          className="w-full border-b border-white/10 bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-neutral-500"
        />
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => { cmd.onSelect(); setOpen(false); }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm text-neutral-200 hover:bg-white/10"
            >
              <span>{cmd.label}</span>
              {cmd.shortcut && <kbd className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-neutral-400">{cmd.shortcut}</kbd>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
    vanillaCode: `<div class="cmdk-box"><input placeholder="Search components (Cmd+K)..." /><div class="cmdk-row"><span>Spotlight Bento</span><kbd>1</kbd></div></div>
<style>
.cmdk-box { max-width:440px; border-radius:16px; background:rgba(12,13,18,0.92); border:1px solid rgba(255,255,255,0.14); backdrop-filter:blur(20px); overflow:hidden; }
.cmdk-box input { width:100%; padding:14px 16px; background:transparent; border:none; border-bottom:1px solid rgba(255,255,255,0.08); color:#fff; outline:none; }
.cmdk-row { display:flex; justify-content:space-between; padding:10px 16px; color:#e4e4e7; font-size:13px; }
</style>`
  },
  {
    id: 'champagne-button',
    name: 'Royal Champagne Magnetic CTA',
    category: 'Conversion',
    tier: 'Royal',
    tagline: 'Magnetic cursor-attracted CTA with sweeping champagne-gold shimmer beam.',
    description: 'Combines subtle magnetic pointer translation with an animated specular sheen sweep for high-conversion hero buttons.',
    designPatterns: ['#15 Luxury Typography', '#17 Y2K Aesthetic', '#20 Dark Mode UI'],
    filename: 'ChampagneButton.tsx',
    props: [
      { name: 'label', type: 'string', defaultValue: '"Get Started"', description: 'Button label.' },
      { name: 'strength', type: 'number', defaultValue: '0.28', description: 'Magnetic pull multiplier.' }
    ],
    reactCode: `import React, { useRef, useState } from 'react';

export function ChampagneButton({ label = 'Explore Collection', strength = 0.28, onClick }: { label?: string; strength?: number; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * strength,
      y: (e.clientY - (r.top + r.height / 2)) * strength
    });
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      onClick={onClick}
      style={{ transform: \`translate3d(\${offset.x}px, \${offset.y}px, 0)\` }}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-amber-200/40 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 px-7 py-3 text-sm font-bold tracking-wide text-neutral-950 shadow-[0_0_30px_rgba(229,193,88,0.35)] transition-transform duration-150 ease-out"
    >
      <span className="relative z-10">{label}</span>
      <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
    </button>
  );
}
`,
    vanillaCode: `<button class="monarch-cta">Explore Collection &rarr;</button>
<style>
.monarch-cta { border-radius:999px; padding:12px 28px; font-weight:800; border:1px solid rgba(229,193,88,0.5); background:linear-gradient(135deg,#f5e1a4,#e5c158); color:#09090b; box-shadow:0 0 28px rgba(229,193,88,0.35); cursor:pointer; }
</style>`
  },
  {
    id: 'dynamic-island',
    name: 'Dynamic Island Status Pill',
    category: 'Feedback',
    tier: 'Spatial',
    tagline: 'Cupertino-style morphing pill expanding smoothly for live system states.',
    description: 'Compact obsidian pill that expands with spring cubic-bezier curves to reveal live build, audio, or notification details.',
    designPatterns: ['#10 Glassmorphism', '#20 Dark Mode UI', '#18 Ethereal'],
    filename: 'DynamicIsland.tsx',
    props: [
      { name: 'title', type: 'string', defaultValue: '"Deployment Live"', description: 'Primary status text.' },
      { name: 'detail', type: 'string', defaultValue: '"Edge CDN synced in 42ms"', description: 'Expanded detail copy.' }
    ],
    reactCode: `import React, { useState } from 'react';

export function DynamicIsland({ title = 'Deployment Live', detail = 'Edge CDN synced across 38 PoPs in 42ms' }: { title?: string; detail?: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded((v) => !v)}
      className={\`overflow-hidden rounded-full border border-white/15 bg-black text-left text-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] \${expanded ? 'w-80 rounded-3xl px-5 py-4' : 'w-48 px-4 py-2'}\`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold tracking-tight">{title}</span>
        </div>
        <span className="text-[10px] text-neutral-400">{expanded ? 'Collapse' : 'Expand'}</span>
      </div>
      {expanded && <p className="mt-2.5 text-xs leading-relaxed text-neutral-400">{detail}</p>}
    </button>
  );
}
`,
    vanillaCode: `<div class="island-pill" onclick="this.classList.toggle('open')"><span class="dot"></span> Deployment Live <span class="extra">&middot; 38 Edge PoPs Synced</span></div>
<style>
.island-pill { display:inline-flex; align-items:center; gap:8px; background:#000; color:#fff; border:1px solid rgba(255,255,255,0.16); padding:8px 16px; border-radius:999px; font-size:12px; cursor:pointer; transition:all .3s cubic-bezier(.16,1,.3,1); }
.island-pill .dot { width:8px; height:8px; border-radius:50%; background:#10b981; }
.island-pill .extra { display:none; color:#94a3b8; }
.island-pill.open { padding:12px 22px; }
.island-pill.open .extra { display:inline; }
</style>`
  },
  {
    id: 'aurora-hero',
    name: 'Liquid Aurora Editorial Hero',
    category: 'Typography',
    tier: 'Royal',
    tagline: 'Organic multi-layered aurora backdrop with luxury editorial typography.',
    description: 'Pairs diffused radial aurora gradients with tight-tracked Apple/Editorial headline lockups.',
    designPatterns: ['#15 Luxury Typography', '#18 Ethereal', '#16 Editorial Design'],
    filename: 'AuroraHero.tsx',
    props: [
      { name: 'headline', type: 'string', defaultValue: '"Crafted for the Extraordinary."', description: 'Hero display heading.' },
      { name: 'subtitle', type: 'string', defaultValue: '""', description: 'Supporting lead paragraph.' }
    ],
    reactCode: `import React from 'react';

export function AuroraHero({
  headline = 'Crafted for the Extraordinary.',
  subtitle = 'Zero-dependency spatial primitives engineered with Apple-grade motion and Swiss precision.'
}: {
  headline?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 px-8 py-16 text-center">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-amber-400/15 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-96 rounded-full bg-sky-400/10 blur-[100px]" />
      <p className="relative z-10 mb-3 text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">MonarchUI Design System</p>
      <h1 className="relative z-10 mx-auto max-w-2xl bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
        {headline}
      </h1>
      <p className="relative z-10 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-400">{subtitle}</p>
    </section>
  );
}
`,
    vanillaCode: `<section class="aurora-hero"><span>MONARCH DESIGN</span><h2>Crafted for the Extraordinary.</h2></section>
<style>
.aurora-hero { position:relative; overflow:hidden; padding:48px 24px; text-align:center; border-radius:24px; background:#07080c; border:1px solid rgba(255,255,255,0.1); }
.aurora-hero h2 { font-size:32px; background:linear-gradient(to bottom,#fff,#9ca3af); -webkit-background-clip:text; color:transparent; }
</style>`
  },
  {
    id: 'pricing-crown',
    name: 'Royal Pricing Tier Matrix',
    category: 'Conversion',
    tier: 'Royal',
    tagline: 'Highlighted Crown tier with animated metallic border and annual toggle.',
    description: 'Features a smooth billing cycle toggle and an elevated flagship plan card with champagne accent highlights.',
    designPatterns: ['#12 Bento Grid', '#15 Luxury Typography', '#10 Glassmorphism'],
    filename: 'PricingCrown.tsx',
    props: [
      { name: 'monthlyPrice', type: 'number', defaultValue: '49', description: 'Monthly price USD.' },
      { name: 'annualDiscount', type: 'number', defaultValue: '0.2', description: 'Annual discount fraction.' }
    ],
    reactCode: `import React, { useState } from 'react';

export function PricingCrown({ monthlyPrice = 49, annualDiscount = 0.2 }: { monthlyPrice?: number; annualDiscount?: number }) {
  const [annual, setAnnual] = useState(true);
  const price = annual ? Math.round(monthlyPrice * (1 - annualDiscount)) : monthlyPrice;

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-amber-300/35 bg-gradient-to-b from-neutral-900 to-black p-7 shadow-[0_0_50px_rgba(229,193,88,0.12)]">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-amber-300/15 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-200 uppercase">Crown Tier</span>
        <button onClick={() => setAnnual((v) => !v)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-neutral-300">
          {annual ? 'Annual (-20%)' : 'Monthly'}
        </button>
      </div>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-white">\${price}</span>
        <span className="text-xs text-neutral-400">/ month</span>
      </div>
      <ul className="mt-6 space-y-2.5 text-sm text-neutral-300">
        <li>&#10003; All 12 Royal &amp; Spatial Primitives</li>
        <li>&#10003; Figma Tokens &amp; Tailwind Presets</li>
        <li>&#10003; Unlimited Commercial Projects</li>
      </ul>
    </div>
  );
}
`,
    vanillaCode: `<div class="crown-card"><span class="crown-badge">CROWN</span><div class="price">$39<span>/mo</span></div></div>
<style>
.crown-card { padding:24px; border-radius:22px; background:linear-gradient(180deg,#15161e,#060609); border:1px solid rgba(229,193,88,0.4); color:#fff; }
.crown-badge { font-size:10px; font-weight:800; color:#e5c158; letter-spacing:1.2px; }
.price { font-size:32px; font-weight:900; margin-top:12px; }
</style>`
  },
  {
    id: 'kinetic-marquee',
    name: 'Infinite Kinetic Marquee Ribbon',
    category: 'Layout',
    tier: 'Signature',
    tagline: 'Seamless GPU-accelerated infinite ribbon with alpha edge masks.',
    description: 'Renders duplicated track items with CSS linear-gradient alpha mask fading and instant pause on hover.',
    designPatterns: ['#3 Swiss Design', '#1 Minimalism'],
    filename: 'KineticMarquee.tsx',
    props: [
      { name: 'items', type: 'string[]', defaultValue: '[]', description: 'List of partner names or badges.' }
    ],
    reactCode: `import React from 'react';

export function KineticMarquee({ items = ['VERCEL', 'LINEAR', 'STRIPE', 'RAYCAST', 'ANTHROPIC', 'FIGMA'] }: { items?: string[] }) {
  return (
    <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="flex w-max animate-[marquee_20s_linear_infinite] gap-8 hover:[animation-play-state:paused]">
        {[...items, ...items].map((label, i) => (
          <span key={i} className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold tracking-[0.2em] text-neutral-300">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
`,
    vanillaCode: `<div class="marquee"><div class="track"><span>APPLE</span><span>LINEAR</span><span>STRIPE</span><span>VERCEL</span><span>APPLE</span><span>LINEAR</span></div></div>
<style>
.marquee { overflow:hidden; mask-image:linear-gradient(to right,transparent,#000 15%,#000 85%,transparent); }
.track { display:flex; gap:32px; width:max-content; animation:scroll 14s linear infinite; color:#a1a1aa; font-weight:700; letter-spacing:.15em; }
@keyframes scroll { to { transform:translateX(-50%); } }
</style>`
  },
  {
    id: 'metric-sparkline',
    name: 'Keynote Tabular Metric Card',
    category: 'Typography',
    tier: 'Signature',
    tagline: 'Apple Keynote tabular-nums metric card with vector bezier sparkline.',
    description: 'Displays crisp monospace KPI figures alongside a glowing SVG trend curve and positive/negative delta pill.',
    designPatterns: ['#3 Swiss Design', '#24 Cybercore', '#12 Bento Grid'],
    filename: 'MetricSparkline.tsx',
    props: [
      { name: 'label', type: 'string', defaultValue: '"Net Revenue"', description: 'Metric label.' },
      { name: 'value', type: 'string', defaultValue: '"$148,920"', description: 'Formatted display value.' },
      { name: 'delta', type: 'string', defaultValue: '"+24.8%"', description: 'Delta badge text.' }
    ],
    reactCode: `import React from 'react';

export function MetricSparkline({ label = 'Net Revenue', value = '$148,920', delta = '+24.8%' }: { label?: string; value?: string; delta?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-400">{label}</span>
        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">{delta}</span>
      </div>
      <div className="mt-2 font-mono text-3xl font-bold tracking-tight text-white tabular-nums">{value}</div>
      <svg className="mt-4 h-12 w-full" viewBox="0 0 200 40" fill="none">
        <path d="M2 34 C 35 30, 50 18, 85 22 C 120 26, 145 8, 198 4" stroke="#e5c158" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
`,
    vanillaCode: `<div class="metric-card"><small>Net Revenue</small><strong>$148,920</strong></div>
<style>
.metric-card { padding:20px; border-radius:16px; background:#0b0c10; border:1px solid rgba(255,255,255,0.1); color:#fff; }
.metric-card strong { display:block; font-size:28px; font-variant-numeric:tabular-nums; margin-top:6px; }
</style>`
  },
  {
    id: 'split-compare',
    name: 'Tactile Split Comparison Slider',
    category: 'Spatial',
    tier: 'Spatial',
    tagline: 'Draggable glassmorphic divider for interactive before/after comparisons.',
    description: 'Uses pointer/range synchronization to reveal two layered UI surfaces with a luminous champagne-gold divider bar.',
    designPatterns: ['#10 Glassmorphism', '#6 Neo-Brutalism'],
    filename: 'SplitCompare.tsx',
    props: [
      { name: 'beforeLabel', type: 'string', defaultValue: '"Before"', description: 'Left pane badge.' },
      { name: 'afterLabel', type: 'string', defaultValue: '"MonarchUI"', description: 'Right pane badge.' }
    ],
    reactCode: `import React, { useState } from 'react';

export function SplitCompare({ beforeLabel = 'Standard UI', afterLabel = 'MonarchUI' }: { beforeLabel?: string; afterLabel?: string }) {
  const [pos, setPos] = useState(55);

  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-white/15 bg-neutral-900 select-none">
      <div className="absolute inset-0 flex items-center justify-end bg-gradient-to-br from-neutral-950 to-amber-950/30 p-6">
        <span className="text-xs font-bold tracking-widest text-amber-200 uppercase">{afterLabel}</span>
      </div>
      <div style={{ width: \`\${pos}%\` }} className="absolute inset-y-0 left-0 flex items-center overflow-hidden border-r-2 border-amber-300 bg-neutral-800 p-6">
        <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">{beforeLabel}</span>
      </div>
      <input
        type="range"
        min={5}
        max={95}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
`,
    vanillaCode: `<div class="split-box"><div class="split-left" id="sl">Before</div><span>After</span><input type="range" value="50" oninput="document.getElementById('sl').style.width=this.value+'%'" /></div>
<style>
.split-box { position:relative; height:140px; border-radius:16px; overflow:hidden; background:#14151b; border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:flex-end; padding:16px; color:#e5c158; }
.split-left { position:absolute; inset:0 auto 0 0; width:50%; background:#27272a; border-right:2px solid #e5c158; display:flex; align-items:center; padding:16px; color:#a1a1aa; }
.split-box input { position:absolute; inset:0; opacity:0; cursor:ew-resize; }
</style>`
  },
  {
    id: 'founder-wall',
    name: 'Editorial Testimonial Wall',
    category: 'Typography',
    tier: 'Signature',
    tagline: 'Staggered luxury proof cards with verified founder badges.',
    description: 'Clean editorial quote cards with subtle elevation on hover and high-contrast author attribution.',
    designPatterns: ['#16 Editorial Design', '#3 Swiss Design'],
    filename: 'FounderWall.tsx',
    props: [
      { name: 'quotes', type: 'QuoteItem[]', defaultValue: '[]', description: 'List of founder testimonials.' }
    ],
    reactCode: `import React from 'react';

export interface QuoteItem {
  author: string;
  role: string;
  quote: string;
}

export function FounderWall({ quotes }: { quotes: QuoteItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quotes.map((q, idx) => (
        <figure key={idx} className="rounded-2xl border border-white/10 bg-neutral-950/90 p-5 transition-colors hover:border-amber-300/30">
          <blockquote className="text-sm leading-relaxed text-neutral-300">"{q.quote}"</blockquote>
          <figcaption className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
            <div>
              <div className="text-xs font-semibold text-white">{q.author}</div>
              <div className="text-[11px] text-neutral-500">{q.role}</div>
            </div>
            <span className="text-[11px] text-amber-300">&#10003; Verified</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
`,
    vanillaCode: `<figure class="founder-quote"><blockquote>"Shipped a $100k-looking landing page in 20 minutes."</blockquote><figcaption>Alex Chen &middot; CTO</figcaption></figure>
<style>
.founder-quote { padding:20px; border-radius:16px; background:#0b0c10; border:1px solid rgba(255,255,255,0.1); color:#e4e4e7; }
.founder-quote figcaption { margin-top:12px; font-size:12px; color:#e5c158; }
</style>`
  }
];

export class ComponentRegistry {
  static list(): MonarchComponent[] {
    return MONARCH_COMPONENTS;
  }

  static getById(id: string): MonarchComponent | undefined {
    return MONARCH_COMPONENTS.find((c) => c.id === id);
  }

  static search(query: string): MonarchComponent[] {
    const q = query.trim().toLowerCase();
    if (!q) return MONARCH_COMPONENTS;
    return MONARCH_COMPONENTS.filter(
      (c) =>
        c.id.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }
}
