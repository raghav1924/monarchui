'use client';

import React, { useState } from 'react';

export function LiveComponentPreview({ componentId }: { componentId: string }) {
  const [islandOpen, setIslandOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [splitPos, setSplitPos] = useState(50);
  const dockMouseX = React.useRef<number | null>(null);
  const dockSizes = React.useRef<number[]>([40, 40, 40, 40, 40]);
  const dockItemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [mag, setMag] = useState({ x: 0, y: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 50 });

  React.useEffect(() => {
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
            setSpot({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
          className="grid w-full grid-cols-3 divide-x divide-neutral-200 border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#111113]"
          style={{
            backgroundImage: `radial-gradient(240px circle at ${spot.x}px ${spot.y}px, rgba(120,120,120,0.08), transparent 60%)`
          }}
        >
          <div className="col-span-2 p-4">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">01 // PRIMARY CELL</div>
            <div className="mt-1 text-sm font-semibold">Cursor-Tracked Spotlight</div>
          </div>
          <div className="p-4">
            <div className="font-mono text-[10px] text-neutral-500 uppercase">02 // STATUS</div>
            <div className="mt-1 font-mono text-sm font-semibold">ACTIVE</div>
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

    case 'command-palette':
      return (
        <div className="w-full max-w-md border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-[#111113]">
          <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 font-mono text-xs text-neutral-500 dark:border-neutral-800">
            <span>&gt; Jump to primitive...</span>
            <kbd className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] dark:border-neutral-700">⌘K</kbd>
          </div>
          <div className="divide-y divide-dashed divide-neutral-200 text-xs dark:divide-neutral-800">
            <div className="bg-neutral-100 px-3 py-2 font-medium dark:bg-neutral-800/60">01 · Royal Spotlight Bento</div>
            <div className="px-3 py-2 text-neutral-500">02 · Apple Spatial Glass Dock</div>
          </div>
        </div>
      );

    case 'champagne-button':
      return (
        <button
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setMag({
              x: (e.clientX - (r.left + r.width / 2)) * 0.28,
              y: (e.clientY - (r.top + r.height / 2)) * 0.28
            });
          }}
          onMouseLeave={() => setMag({ x: 0, y: 0 })}
          style={{ transform: `translate3d(${mag.x}px, ${mag.y}px, 0)` }}
          className="rounded-md border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white transition-transform duration-150 dark:border-white dark:bg-white dark:text-neutral-950"
        >
          Magnetic CTA · Hover Me →
        </button>
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
        <div className="w-full border border-neutral-200 bg-white p-6 text-center dark:border-neutral-800 dark:bg-[#111113]">
          <div className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">EDITORIAL HERO</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">Crafted for the Extraordinary.</div>
          <div className="mt-1.5 text-xs text-neutral-500">Strict geometric typography &amp; hairline rhythm.</div>
        </div>
      );

    case 'pricing-crown':
      return (
        <div className="w-72 border border-neutral-300 bg-white p-4 dark:border-neutral-700 dark:bg-[#111113]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase">CROWN TIER</span>
            <button
              onClick={() => setAnnual((v) => !v)}
              className="rounded border border-neutral-200 px-2 py-0.5 font-mono text-[10px] dark:border-neutral-700"
            >
              {annual ? 'Annual (-20%)' : 'Monthly'}
            </button>
          </div>
          <div className="mt-3 font-mono text-2xl font-semibold">${annual ? 39 : 49}/mo</div>
        </div>
      );

    case 'kinetic-marquee':
      return (
        <div className="flex w-full items-center justify-center gap-3 overflow-hidden py-2">
          {['NEXT.JS', 'TAILWIND', 'THREE.JS', 'MONARCHUI'].map((item) => (
            <span
              key={item}
              className="border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[11px] font-semibold tracking-widest dark:border-neutral-800 dark:bg-[#111113]"
            >
              {item}
            </span>
          ))}
        </div>
      );

    case 'metric-sparkline':
      return (
        <div className="w-72 border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-[#111113]">
          <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500">
            <span>NET REVENUE</span>
            <span className="text-emerald-600 dark:text-emerald-400">+24.8%</span>
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">$148,920</div>
          <svg className="mt-3 h-8 w-full" viewBox="0 0 200 40" fill="none">
            <path
              d="M2 34 C 35 30, 50 18, 85 22 C 120 26, 145 8, 198 4"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      );

    case 'split-compare':
      return (
        <div className="relative flex h-16 w-full max-w-md select-none items-center justify-end border border-neutral-200 bg-white px-4 font-mono text-xs dark:border-neutral-800 dark:bg-[#111113]">
          <span>MONARCH</span>
          <div
            style={{ width: `${splitPos}%` }}
            className="absolute inset-y-0 left-0 flex items-center overflow-hidden border-r border-neutral-900 bg-neutral-100 pl-4 text-neutral-500 dark:border-white dark:bg-neutral-800"
          >
            RAW
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

    default:
      return (
        <div className="grid w-full grid-cols-2 divide-x divide-neutral-200 border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#111113]">
          <div className="p-4 text-xs">
            <p className="text-neutral-600 dark:text-neutral-400">&ldquo;Cleanest grid architecture.&rdquo;</p>
            <div className="mt-2 font-mono text-[10px] font-semibold">ALEX CHEN · CTO</div>
          </div>
          <div className="p-4 text-xs">
            <p className="text-neutral-600 dark:text-neutral-400">&ldquo;Zero deps, instant drop-in.&rdquo;</p>
            <div className="mt-2 font-mono text-[10px] font-semibold">MAYA LIN · STAFF ENG</div>
          </div>
        </div>
      );
  }
}
