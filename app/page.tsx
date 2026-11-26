'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { LiveComponentPreview } from '@/components/LiveComponentPreview';
import { ThreeCoverflowStage } from '@/components/ThreeCoverflowStage';
import { MONARCH_COMPONENTS } from '@/src/registry/components';

export default function MonarchHomePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [codeMode, setCodeMode] = useState<'react' | 'vanilla'>('react');
  const [darkMode, setDarkMode] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [splitPos, setSplitPos] = useState(50);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const active = MONARCH_COMPONENTS[activeIdx];

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const stepDeck = useCallback((delta: number) => {
    setActiveIdx((prev) => (prev + delta + MONARCH_COMPONENTS.length) % MONARCH_COMPONENTS.length);
  }, []);

  const copyText = (text: string, tag: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(tag);
    setTimeout(() => setCopiedId(null), 1200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setCmdkOpen(false);
      } else if (e.key === 'ArrowLeft' && document.activeElement?.tagName !== 'INPUT') {
        stepDeck(-1);
      } else if (e.key === 'ArrowRight' && document.activeElement?.tagName !== 'INPUT') {
        stepDeck(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stepDeck]);

  const filtered = MONARCH_COMPONENTS.map((c, idx) => ({ c, idx })).filter(
    ({ c }) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.id.includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const code = codeMode === 'react' ? active.reactCode : active.vanillaCode;

  return (
    <div className="mx-auto min-h-screen max-w-6xl border-x border-neutral-200 bg-[#FAFAFA] dark:border-neutral-800 dark:bg-[#09090B]">
      {/* Top Bar */}
      <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-6 py-3.5 dark:border-neutral-800">
        <span className="pointer-events-none absolute -bottom-[6px] -left-[5px] font-mono text-[11px] text-neutral-400">+</span>
        <span className="pointer-events-none absolute -bottom-[6px] -right-[5px] font-mono text-[11px] text-neutral-400">+</span>

        <div className="flex items-center gap-2.5">
          <div className="grid h-6 w-6 place-items-center rounded border border-neutral-400 font-mono text-[11px] font-bold dark:border-neutral-600">
            M
          </div>
          <span className="text-sm font-semibold tracking-tight">MonarchUI</span>
          <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">v1.0.0</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCmdkOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
          >
            Search
            <kbd className="rounded border border-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-700">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={toggleDark}
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a
            href="https://jatinsh.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
          >
            Jatin Sharma ↗
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative grid grid-cols-1 items-end gap-6 border-b border-neutral-200 px-6 py-12 md:grid-cols-[1fr_auto] dark:border-neutral-800">
        <span className="pointer-events-none absolute -bottom-[6px] -left-[5px] font-mono text-[11px] text-neutral-400">+</span>
        <span className="pointer-events-none absolute -bottom-[6px] -right-[5px] font-mono text-[11px] text-neutral-400">+</span>

        <div>
          <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
            01 // OVERVIEW · NEXT.JS + TAILWIND + THREE.JS
          </div>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Zero-dependency UI primitives with Three.js spatial motion and architectural grid precision.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Copy-paste or CLI-install 12 self-contained React + Tailwind and Vanilla HTML/CSS components. Built with 1px wireframe geometry and zero drop shadows.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => copyText('npx monarchui add spotlight-bento', 'hero-cli')}
            className="rounded-md border border-neutral-900 bg-neutral-900 px-3.5 py-2 font-mono text-xs font-medium text-white hover:opacity-90 dark:border-white dark:bg-white dark:text-neutral-950"
          >
            {copiedId === 'hero-cli' ? 'Copied!' : 'npx monarchui add spotlight-bento'}
          </button>
          <button
            onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-xs font-medium hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
          >
            Browse 12 Specs ↓
          </button>
        </div>
      </section>

      {/* Ruler Tick Strip */}
      <div className="ruler-ticks border-b border-neutral-200 dark:border-neutral-800" />

      {/* 3-Column Structural Bento Grid */}
      <section className="relative grid grid-cols-1 divide-y divide-neutral-200 border-b border-neutral-200 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800">
        <span className="pointer-events-none absolute -bottom-[6px] -left-[5px] font-mono text-[11px] text-neutral-400">+</span>
        <span className="pointer-events-none absolute -bottom-[6px] -right-[5px] font-mono text-[11px] text-neutral-400">+</span>

        {/* Three.js Coverflow Stage */}
        <div className="p-6 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
              02 // THREE.JS_SPATIAL_STAGE · {active.id.toUpperCase()}
            </span>
            <span className="font-mono text-[11px] text-neutral-500">
              {String(activeIdx + 1).padStart(2, '0')} / {String(MONARCH_COMPONENTS.length).padStart(2, '0')}
            </span>
          </div>

          <ThreeCoverflowStage
            components={MONARCH_COMPONENTS}
            activeIndex={activeIdx}
            darkMode={darkMode}
            onSelectIndex={setActiveIdx}
          />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => stepDeck(-1)}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
              >
                <kbd className="font-mono text-[10px] text-neutral-500">←</kbd> Prev
              </button>
              <button
                onClick={() => stepDeck(1)}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
              >
                Next <kbd className="font-mono text-[10px] text-neutral-500">→</kbd>
              </button>
            </div>
            <span className="font-mono text-[11px] text-neutral-500">CLICK SLAB OR PRESS ARROWS</span>
          </div>
        </div>

        {/* Right Telemetry + Split Slider Column */}
        <div className="flex flex-col justify-between divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
          <div className="p-6">
            <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">03 // TELEMETRY</div>
            <div className="mt-3 grid grid-cols-2 divide-x divide-y divide-neutral-200 border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
              <div className="p-3">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">PRIMITIVES</div>
                <div className="mt-1 font-mono text-xl font-semibold">12</div>
              </div>
              <div className="p-3">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">ENGINE</div>
                <div className="mt-1 font-mono text-xl font-semibold">3D</div>
              </div>
              <div className="p-3">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">RUNTIME DEPS</div>
                <div className="mt-1 font-mono text-xl font-semibold">0</div>
              </div>
              <div className="p-3">
                <div className="font-mono text-[10px] text-neutral-500 uppercase">SHADOWS</div>
                <div className="mt-1 font-mono text-xl font-semibold">0px</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">04 // SPLIT_COMPARE</div>
            <div className="relative mt-3 flex h-12 select-none items-center justify-end border border-neutral-200 bg-white px-3 font-mono text-[11px] dark:border-neutral-800 dark:bg-[#111113]">
              <span>MONARCH</span>
              <div
                style={{ width: `${splitPos}%` }}
                className="absolute inset-y-0 left-0 flex items-center overflow-hidden border-r border-neutral-900 bg-neutral-100 pl-3 text-neutral-500 dark:border-white dark:bg-neutral-800/70"
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
          </div>
        </div>
      </section>

      {/* Section Header */}
      <div
        id="registry"
        className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-neutral-200 px-6 py-3.5 dark:border-neutral-800"
      >
        <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
          05 // COMPONENT_REGISTRY &amp; CODE_INSPECTOR
        </span>
        <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
          REACT + TAILWIND · VANILLA HTML/CSS
        </span>
      </div>

      {/* Split Rail Workbench */}
      <section className="relative grid grid-cols-1 divide-y divide-neutral-200 border-b border-neutral-200 md:grid-cols-[290px_1fr] md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800">
        <span className="pointer-events-none absolute -bottom-[6px] -left-[5px] font-mono text-[11px] text-neutral-400">+</span>
        <span className="pointer-events-none absolute -bottom-[6px] -right-[5px] font-mono text-[11px] text-neutral-400">+</span>

        <aside className="divide-y divide-dashed divide-neutral-200 dark:divide-neutral-800">
          {MONARCH_COMPONENTS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setActiveIdx(idx)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-[13px] transition-colors ${
                idx === activeIdx
                  ? 'border-l-2 border-l-neutral-900 bg-white font-semibold dark:border-l-white dark:bg-[#111113]'
                  : 'font-medium hover:bg-neutral-100/70 dark:hover:bg-neutral-900/50'
              }`}
            >
              <span>
                <span className="mr-2 font-mono text-[11px] text-neutral-400">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {c.name}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
                {c.category}
              </span>
            </button>
          ))}
        </aside>

        <main className="min-w-0 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
                {String(activeIdx + 1).padStart(2, '0')} // {active.category} · {active.id}
              </div>
              <h2 className="mt-1.5 text-xl font-semibold tracking-tight">{active.name}</h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {active.description}
              </p>
            </div>
            <button
              onClick={() => copyText(`npx monarchui add ${active.id}`, 'cli-btn')}
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
            >
              {copiedId === 'cli-btn' ? 'Copied!' : `npx monarchui add ${active.id}`}
            </button>
          </div>

          <div className="mt-5 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
            LIVE INTERACTIVE PREVIEW
          </div>
          <div className="mt-2 flex min-h-[130px] items-center justify-center border border-neutral-200 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40">
            <LiveComponentPreview componentId={active.id} />
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            <button
              onClick={() => setCodeMode('react')}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] ${
                codeMode === 'react'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                  : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-400'
              }`}
            >
              React + Tailwind ({active.filename})
            </button>
            <button
              onClick={() => setCodeMode('vanilla')}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] ${
                codeMode === 'vanilla'
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                  : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-400'
              }`}
            >
              HTML + CSS + JS
            </button>
            <button
              onClick={() => copyText(code, 'src-btn')}
              className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[11px] hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
            >
              {copiedId === 'src-btn' ? 'Copied Source!' : 'Copy Source'}
            </button>
          </div>

          <pre className="mt-3 max-h-[340px] overflow-x-auto border border-neutral-200 bg-neutral-100 p-4 font-mono text-xs leading-relaxed dark:border-neutral-800 dark:bg-[#111113]">
            <code>{code}</code>
          </pre>

          <div className="mt-6 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
            PROPS SPECIFICATION
          </div>
          <div className="mt-2 overflow-x-auto border border-neutral-200 dark:border-neutral-800">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] tracking-wider text-neutral-500 uppercase dark:border-neutral-800 dark:bg-[#111113]">
                  <th className="border-r border-neutral-200 px-3 py-2 dark:border-neutral-800">Prop</th>
                  <th className="border-r border-neutral-200 px-3 py-2 dark:border-neutral-800">Type</th>
                  <th className="border-r border-neutral-200 px-3 py-2 dark:border-neutral-800">Default</th>
                  <th className="px-3 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {active.props.map((p) => (
                  <tr key={p.name}>
                    <td className="border-r border-neutral-200 px-3 py-2 font-mono font-semibold dark:border-neutral-800">
                      {p.name}
                    </td>
                    <td className="border-r border-neutral-200 px-3 py-2 font-mono text-neutral-500 dark:border-neutral-800">
                      {p.type}
                    </td>
                    <td className="border-r border-neutral-200 px-3 py-2 font-mono dark:border-neutral-800">
                      {p.defaultValue}
                    </td>
                    <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </section>

      <div className="ruler-ticks border-b border-neutral-200 dark:border-neutral-800" />

      <footer className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
        <span>MONARCHUI // NEXT.JS + TAILWIND + THREE.JS</span>
        <span>MIT LICENSE · JATIN SHARMA</span>
      </footer>

      {/* Cmd+K Modal */}
      {cmdkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 pt-24 backdrop-blur-sm"
          onClick={() => setCmdkOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-md border border-neutral-400 bg-[#FAFAFA] dark:border-neutral-700 dark:bg-[#09090B]"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter components by name or category..."
              className="w-full border-b border-neutral-200 bg-white px-4 py-3 font-mono text-xs outline-none dark:border-neutral-800 dark:bg-[#111113]"
            />
            <div className="max-h-72 divide-y divide-dashed divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
              {filtered.map(({ c, idx }) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setCmdkOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <span>
                    <span className="mr-2 font-mono text-neutral-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {c.name}
                  </span>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase">{c.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
