'use client';

import React, { useEffect, useRef, useState } from 'react';

const METRIC_SERIES: Record<'7D' | '30D' | '90D', { value: string; delta: string; points: number[] }> = {
  '7D': { value: '$42,180', delta: '+12.4%', points: [28, 34, 31, 45, 52, 49, 68] },
  '30D': { value: '$148,920', delta: '+24.8%', points: [18, 26, 22, 39, 35, 58, 76] },
  '90D': { value: '$412,650', delta: '+41.2%', points: [12, 20, 29, 25, 44, 62, 88] }
};

export function LiveComponentPreview({ componentId }: { componentId: string }) {
  const [islandOpen, setIslandOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'crown'>('crown');
  const [splitPos, setSplitPos] = useState(52);
  const [metricRange, setMetricRange] = useState<'7D' | '30D' | '90D'>('30D');
  const [hoverPoint, setHoverPoint] = useState<number | null>(null);
  const [cmdQuery, setCmdQuery] = useState('');
  const [cmdExecuted, setCmdExecuted] = useState<string | null>(null);
  const [wallFilter, setWallFilter] = useState<'All' | 'Engineering' | 'Design'>('All');
  const [ctaClicked, setCtaClicked] = useState(false);
  const dockMouseX = useRef<number | null>(null);
  const dockSizes = useRef<number[]>([40, 40, 40, 40, 40]);
  const dockItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [mag, setMag] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 120, y: 60 });
  const [auroraPos, setAuroraPos] = useState({ x: 50, y: 40 });
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [marqueeFast, setMarqueeFast] = useState(false);

  useEffect(() => {
    if (componentId !== 'spatial-dock') return;
    let rafId = 0;
    const baseSize = 40;
    const maxSize = 72;
    const radius = 140;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const mx = dockMouseX.current;
      dockItemRefs.current.forEach((el, idx) => {
        if (!el) return;
        let target = baseSize;
        if (mx !== null) {
          const rect = el.getBoundingClientRect();
          const center = rect.left + rect.width / 2;
          const dist = Math.abs(mx - center);
          if (dist < radius) {
            const factor = Math.cos((dist / radius) * (Math.PI / 2));
            target = baseSize + (maxSize - baseSize) * factor;
          }
        }
        const curr = dockSizes.current[idx] ?? baseSize;
        const next = curr + (target - curr) * 0.24;
        dockSizes.current[idx] = next;
        el.style.width = `${next.toFixed(2)}px`;
        el.style.height = `${next.toFixed(2)}px`;
      });
    };
    tick();
    return () => cancelAnimationFrame(rafId);
  }, [componentId]);

  switch (componentId) {
    case 'spotlight-bento':
      return (
        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setSpot({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
          }}
          className="grid w-full grid-cols-1 divide-y divide-neutral-200 border border-neutral-200 bg-white md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#111113]"
          style={{
            backgroundImage: `radial-gradient(240px circle at ${spot.x}px ${spot.y}px, rgba(120,120,120,0.12), transparent 60%)`
          }}
        >
          <div className="p-4 md:col-span-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 uppercase">
              <span>01 // SPOTLIGHT CELL</span>
              <span>x:{spot.x} y:{spot.y}</span>
            </div>
            <div className="mt-2 text-sm font-semibold">Cursor-Tracked Hairline Illumination</div>
            <p className="mt-1 text-xs text-neutral-500">Move pointer across cells to illuminate the radial aura.</p>
          </div>
          <div className="flex flex-col justify-between p-4">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">02 // LATENCY</div>
            <div className="mt-2 font-mono text-xl font-semibold">0.4ms</div>
          </div>
        </div>
      );

    case 'spatial-dock':
      return (
        <div className="flex h-24 items-end justify-center">
          <div
            onMouseMove={(e) => {
              dockMouseX.current = e.clientX;
            }}
            onMouseLeave={() => {
              dockMouseX.current = null;
            }}
            className="inline-flex h-[58px] items-end gap-3 rounded-2xl border border-neutral-200 bg-white px-3.5 py-2 dark:border-neutral-800 dark:bg-[#111113]"
          >
            {['01', '02', '03', '04', '05'].map((lbl, idx) => (
              <button
                key={lbl}
                ref={(node) => {
                  dockItemRefs.current[idx] = node;
                }}
                style={{ width: '40px', height: '40px' }}
                className="flex shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-50 font-mono text-[11px] font-semibold dark:border-neutral-700 dark:bg-neutral-900"
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>
      );

    case 'kinetic-card-3d':
      return (
        <div style={{ perspective: '900px' }}>
          <div
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width;
              const py = (e.clientY - r.top) / r.height;
              setTilt({ rx: (0.5 - py) * 18, ry: (px - 0.5) * 18 });
            }}
            onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
            className="w-72 border border-neutral-400 bg-white p-5 transition-transform duration-150 ease-out dark:border-neutral-600 dark:bg-[#111113]"
          >
            <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              KINETIC_3D_SURFACE
            </div>
            <div className="mt-2 text-base font-semibold tracking-tight">Hover to Tilt in 3D</div>
            <div className="mt-3 font-mono text-xs text-neutral-500">
              rx: {tilt.rx.toFixed(1)}° · ry: {tilt.ry.toFixed(1)}°
            </div>
          </div>
        </div>
      );

    case 'command-palette': {
      const cmds = [
        { label: '01 · Install Spotlight Bento', shortcut: '⌘1' },
        { label: '02 · Switch Monochrome Polarity', shortcut: '⌘T' },
        { label: '03 · Export Design Tokens', shortcut: '⌘E' }
      ].filter((c) => c.label.toLowerCase().includes(cmdQuery.toLowerCase()));

      return (
        <div className="w-full max-w-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-[#111113]">
          <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
            <input
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
              placeholder="Type to filter commands..."
              className="w-full bg-transparent font-mono text-xs outline-none"
            />
            <kbd className="rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-700">
              ⌘K
            </kbd>
          </div>
          <div className="divide-y divide-dashed divide-neutral-200 text-xs dark:divide-neutral-800">
            {cmds.map((c) => (
              <button
                key={c.label}
                onClick={() => {
                  setCmdExecuted(c.label);
                  setTimeout(() => setCmdExecuted(null), 1500);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
              >
                <span>{c.label}</span>
                <kbd className="font-mono text-[10px] text-neutral-500">{c.shortcut}</kbd>
              </button>
            ))}
          </div>
          {cmdExecuted && (
            <div className="border-t border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[10px] text-emerald-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-emerald-400">
              ✓ Executed: {cmdExecuted}
            </div>
          )}
        </div>
      );
    }

    case 'champagne-button':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setMag({
                x: (e.clientX - (r.left + r.width / 2)) * 0.28,
                y: (e.clientY - (r.top + r.height / 2)) * 0.28
              });
            }}
            onMouseLeave={() => setMag({ x: 0, y: 0 })}
            onClick={() => {
              setCtaClicked(true);
              setTimeout(() => setCtaClicked(false), 1200);
            }}
            style={{ transform: `translate3d(${mag.x}px, ${mag.y}px, 0)` }}
            className="rounded-md border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-transform duration-150 dark:border-white dark:bg-white dark:text-neutral-950"
          >
            {ctaClicked ? '✓ Action Triggered' : 'Magnetic Primary CTA →'}
          </button>
          <span className="font-mono text-[11px] text-neutral-500">
            offset({mag.x.toFixed(0)}px, {mag.y.toFixed(0)}px)
          </span>
        </div>
      );

    case 'dynamic-island':
      return (
        <button
          onClick={() => setIslandOpen((v) => !v)}
          className={`rounded-full border border-neutral-900 bg-neutral-950 text-left text-white transition-all duration-300 dark:border-neutral-600 ${
            islandOpen ? 'w-72 rounded-xl px-4 py-3' : 'w-48 px-4 py-2'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Deployment Live
            </span>
            <span className="font-mono text-[10px] text-neutral-400">{islandOpen ? '−' : '+'}</span>
          </div>
          {islandOpen && (
            <div className="mt-2 font-mono text-[11px] text-neutral-400">
              Edge synced across 38 PoPs in 42ms
            </div>
          )}
        </button>
      );

    case 'aurora-hero':
      return (
        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setAuroraPos({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100
            });
          }}
          className="relative w-full overflow-hidden border border-neutral-200 bg-[#09090B] px-6 py-10 text-center text-white dark:border-neutral-800"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-80 transition-all duration-300 ease-out"
            style={{
              backgroundImage: `
                radial-gradient(280px circle at ${auroraPos.x}% ${auroraPos.y}%, rgba(56, 189, 248, 0.32), transparent 60%),
                radial-gradient(320px circle at ${100 - auroraPos.x}% ${100 - auroraPos.y}%, rgba(168, 85, 247, 0.28), transparent 65%),
                radial-gradient(240px circle at 50% 0%, rgba(16, 185, 129, 0.22), transparent 60%)
              `
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-widest text-sky-300 uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Editorial Hero · Move Cursor
            </span>
            <h3 className="mx-auto mt-3 max-w-md bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent md:text-3xl">
              Crafted for the Extraordinary.
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-neutral-400">
              Pointer-reactive liquid aurora light field layered over a crisp architectural grid.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="rounded-md bg-white px-3.5 py-1.5 text-[11px] font-semibold text-neutral-950">
                Get Started →
              </span>
              <span className="rounded-md border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] text-neutral-300">
                x:{auroraPos.x.toFixed(0)}% y:{auroraPos.y.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      );

    case 'pricing-crown':
      return (
        <div className="w-full max-w-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              TIER COMPARISON MATRIX
            </span>
            <button
              onClick={() => setAnnual((v) => !v)}
              className="rounded border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold dark:border-neutral-700 dark:bg-[#111113]"
            >
              Billing: {annual ? 'Annual (-20%)' : 'Monthly'}
            </button>
          </div>
          <div className="grid grid-cols-2 divide-x divide-neutral-200 border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#111113]">
            <div
              onClick={() => setSelectedPlan('starter')}
              className={`cursor-pointer p-4 ${selectedPlan === 'starter' ? 'bg-neutral-100/70 dark:bg-neutral-900' : ''}`}
            >
              <div className="font-mono text-[10px] text-neutral-500 uppercase">STARTER</div>
              <div className="mt-1 font-mono text-2xl font-semibold">${annual ? 15 : 19}/mo</div>
              <div className="mt-2 text-[11px] text-neutral-500">Core primitives &amp; CSS tokens</div>
            </div>
            <div
              onClick={() => setSelectedPlan('crown')}
              className={`cursor-pointer p-4 ${selectedPlan === 'crown' ? 'bg-neutral-100/70 dark:bg-neutral-900' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase">CROWN TIER</span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">POPULAR</span>
              </div>
              <div className="mt-1 font-mono text-2xl font-semibold">${annual ? 39 : 49}/mo</div>
              <div className="mt-2 text-[11px] text-neutral-500">All 12 Royal + Three.js stages</div>
            </div>
          </div>
        </div>
      );

    case 'kinetic-marquee': {
      const row1 = ['NEXT.JS 15', 'TAILWIND CSS', 'THREE.JS', 'TYPESCRIPT', 'VERCEL', 'LINEAR'];
      const row2 = ['STRIPE', 'RAYCAST', 'FIGMA', 'SUPABASE', 'CLOUDFLARE', 'ANTHROPIC'];
      const duration = marqueeFast ? '7s' : '16s';
      const playState = marqueePaused ? 'paused' : 'running';
      return (
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              DUAL-TRACK INFINITE RIBBON · HOVER TO PAUSE
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setMarqueePaused((v) => !v)}
                className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] dark:border-neutral-700 dark:bg-[#111113]"
              >
                {marqueePaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => setMarqueeFast((v) => !v)}
                className="rounded border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] dark:border-neutral-700 dark:bg-[#111113]"
              >
                {marqueeFast ? '2x Speed' : '1x Speed'}
              </button>
            </div>
          </div>

          <div
            className="group space-y-2.5 overflow-hidden py-1"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}
          >
            <div
              className="animate-marquee-left flex w-max gap-3 group-hover:[animation-play-state:paused]"
              style={{ animationDuration: duration, animationPlayState: playState }}
            >
              {[...row1, ...row1].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 border border-neutral-200 bg-white px-3.5 py-2 font-mono text-[11px] font-semibold tracking-widest dark:border-neutral-800 dark:bg-[#111113]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  {item}
                </span>
              ))}
            </div>

            <div
              className="animate-marquee-right flex w-max gap-3 group-hover:[animation-play-state:paused]"
              style={{ animationDuration: duration, animationPlayState: playState }}
            >
              {[...row2, ...row2].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 border border-dashed border-neutral-300 bg-neutral-50 px-3.5 py-2 font-mono text-[11px] font-medium tracking-widest text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'metric-sparkline': {
      const series = METRIC_SERIES[metricRange];
      const coords = series.points.map((v, i) => ({
        x: 8 + i * 31,
        y: 52 - (v / 100) * 44
      }));
      const pathD = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const areaD = `${pathD} L ${coords[coords.length - 1].x} 56 L ${coords[0].x} 56 Z`;

      return (
        <div className="w-full max-w-md border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#111113]">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                KEYNOTE KPI · HOVER POINTS
              </div>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-mono text-2xl font-semibold tabular-nums">{series.value}</span>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {series.delta}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {(['7D', '30D', '90D'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setMetricRange(r)}
                  className={`rounded border px-2 py-1 font-mono text-[10px] ${
                    metricRange === r
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                      : 'border-neutral-200 text-neutral-500 dark:border-neutral-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <svg className="mt-4 h-16 w-full overflow-visible" viewBox="0 0 210 58">
            <path d={areaD} fill="currentColor" className="opacity-[0.06]" />
            <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" />
            {coords.map((pt, idx) => (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoverPoint === idx ? 4.5 : 2.5}
                  fill="currentColor"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoverPoint(idx)}
                  onMouseLeave={() => setHoverPoint(null)}
                />
              </g>
            ))}
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-500">
            <span>{hoverPoint !== null ? `Sample #${hoverPoint + 1}: ${series.points[hoverPoint]}k` : 'Hover chart nodes to inspect'}</span>
            <span>tabular-nums</span>
          </div>
        </div>
      );
    }

    case 'split-compare':
      return (
        <div className="relative h-28 w-full max-w-md select-none overflow-hidden border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-[#111113]">
          <div className="flex h-full items-center justify-end p-5">
            <div className="text-right">
              <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">AFTER // MONARCHUI</div>
              <div className="mt-1 text-sm font-semibold">1px Wireframe Precision</div>
            </div>
          </div>
          <div
            style={{ width: `${splitPos}%` }}
            className="absolute inset-y-0 left-0 flex items-center overflow-hidden border-r-2 border-neutral-900 bg-neutral-100 p-5 dark:border-white dark:bg-neutral-900"
          >
            <div className="whitespace-nowrap">
              <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">BEFORE // RAW</div>
              <div className="mt-1 text-sm text-neutral-500">Unstyled Boilerplate</div>
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            value={splitPos}
            onChange={(e) => setSplitPos(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      );

    default: {
      const quotes = [
        { author: 'Alex Chen', role: 'CTO', tag: 'Engineering', quote: 'Cleanest 1px grid architecture.' },
        { author: 'Maya Lin', role: 'Design Lead', tag: 'Design', quote: 'Apple-grade spatial motion.' },
        { author: 'Sam Patel', role: 'Staff Eng', tag: 'Engineering', quote: 'Zero deps, instant drop-in.' }
      ].filter((q) => wallFilter === 'All' || q.tag === wallFilter);

      return (
        <div className="w-full space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              FILTERABLE PROOF WALL
            </span>
            <div className="flex gap-1">
              {(['All', 'Engineering', 'Design'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setWallFilter(f)}
                  className={`rounded border px-2 py-0.5 font-mono text-[10px] ${
                    wallFilter === f
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                      : 'border-neutral-200 text-neutral-500 dark:border-neutral-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y divide-neutral-200 border border-neutral-200 bg-white md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#111113]">
            {quotes.map((q) => (
              <div key={q.author} className="p-3.5 text-xs">
                <p className="text-neutral-600 dark:text-neutral-400">&ldquo;{q.quote}&rdquo;</p>
                <div className="mt-2 font-mono text-[10px] font-semibold">
                  {q.author} · {q.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}
