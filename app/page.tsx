'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { LiveComponentPreview } from '@/components/LiveComponentPreview';
import { RJLogo } from '@/components/MonarchLogo';
import { ThreeCoverflowStage } from '@/components/ThreeCoverflowStage';
import { MONARCH_COMPONENTS } from '@/src/registry/components';
import { getComponentUsage } from '@/src/registry/usage';

const FAQS = [
  {
    q: 'What is RenderJet?',
    a: 'RenderJet (RJ) is a zero-dependency registry of 12 luxury-grade React, Tailwind CSS, and Vanilla HTML/CSS primitives paired with an interactive Three.js spatial Cover Flow studio.'
  },
  {
    q: 'How do I add a component to my project?',
    a: 'Run `npx rjui add <component-id>` in your project root, or inspect and copy the self-contained React or Vanilla HTML/CSS/JS source directly from the studio below.'
  },
  {
    q: 'Does it work with Next.js, Tailwind CSS, and Vanilla HTML?',
    a: 'Yes. Every component ships in both TypeScript + Tailwind CSS and pure Vanilla HTML/CSS/JS so it drops straight into Next.js App Router, Vite, or static sites.'
  },
  {
    q: 'Are the animations GPU-accelerated and accessible?',
    a: 'Yes. Motion relies on GPU-composited transforms, opacity, and requestAnimationFrame interpolation with zero layout shifts and full keyboard navigation.'
  },
  {
    q: 'Is RenderJet free to use?',
    a: 'Yes. RenderJet is MIT-licensed and free for personal and commercial projects.'
  }
];

function CrosshairCorners() {
  return (
    <>
      <span className="pointer-events-none absolute -bottom-[7px] -left-[5px] select-none font-mono text-[11px] leading-none text-neutral-400 dark:text-neutral-600">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-[7px] -right-[5px] select-none font-mono text-[11px] leading-none text-neutral-400 dark:text-neutral-600">
        +
      </span>
    </>
  );
}

export default function MonarchHomePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [codeMode, setCodeMode] = useState<'usage' | 'react' | 'vanilla'>('usage');
  const [darkMode, setDarkMode] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [slabSpread, setSlabSpread] = useState(2.15);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    setTimeout(() => setCopiedId(null), 1400);
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

  const visibleComponents = MONARCH_COMPONENTS.map((c, idx) => ({ c, idx })).filter(
    ({ c }) => categoryFilter === 'ALL' || c.category === categoryFilter
  );

  const code =
    codeMode === 'usage'
      ? getComponentUsage(active)
      : codeMode === 'react'
        ? active.reactCode
        : active.vanillaCode;

  return (
    <div className="mx-auto min-h-screen max-w-6xl border-x border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-[#09090B]">
      {/* Top Architectural Navbar */}
      <header className="relative flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur-sm md:px-10 dark:border-neutral-800 dark:bg-[#09090B]/90">
        <CrosshairCorners />

        <a href="#" className="flex items-center gap-2.5">
          <RJLogo className="h-6 w-6 text-neutral-950 dark:text-white" />
          <span className="text-[15px] font-semibold tracking-tight text-neutral-950 dark:text-white">
            RenderJet
          </span>
          <span className="rounded-full border border-neutral-200 px-2 py-0.5 font-mono text-[10px] tracking-wider text-neutral-500 uppercase dark:border-neutral-800">
            RJ · v1.0
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-xs font-medium text-neutral-500 md:flex dark:text-neutral-400">
          <a href="#stage" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
            3D Stage
          </a>
          <a href="#registry" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
            Preview &amp; Code
          </a>
          <a href="#features" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
            Features
          </a>
          <a href="#faq" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCmdkOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            <span>Search</span>
            <kbd className="font-mono text-[10px] text-neutral-400">⌘K</kbd>
          </button>

          <a
            href="https://github.com/raghav1924/monarchui"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 sm:inline-flex dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-200 dark:hover:border-neutral-600"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          <button
            onClick={toggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            {darkMode ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* 01 // Architectural Editorial Hero */}
      <section className="relative grid grid-cols-1 items-end gap-8 border-b border-neutral-200 px-6 py-16 md:grid-cols-[1fr_auto] md:px-10 md:py-20 dark:border-neutral-800">
        <CrosshairCorners />

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-[11px] tracking-wider text-neutral-600 uppercase dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>01 // OVERVIEW · NEXT.JS + TAILWIND + THREE.JS</span>
          </div>

          <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl sm:leading-[1.08] dark:text-white">
            Spatial UI primitives built for speed and precision.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
            12 zero-dependency React + Tailwind and Vanilla HTML/CSS components with fluid GPU motion and zero layout shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => copyText(`npx rjui add ${active.id}`, 'hero-cli')}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 font-mono text-xs font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <span>{copiedId === 'hero-cli' ? 'Copied!' : `npx rjui add ${active.id}`}</span>
          </button>
          <button
            onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-300 dark:hover:border-neutral-600"
          >
            Explore Studio ↓
          </button>
        </div>
      </section>

      {/* Ruler Tick Strip */}
      <div className="ruler-ticks border-b border-neutral-200 dark:border-neutral-800" />

      {/* 02–04 // Interactive Studio Controls (Moved above 3D Stage) */}
      <section className="relative grid grid-cols-1 divide-y divide-neutral-200 border-b border-neutral-200 bg-neutral-50/40 md:grid-cols-3 md:divide-x md:divide-y-0 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-[#0c0c0e]">
        <CrosshairCorners />

        {/* 02 // CATEGORY_FILTER */}
        <div className="p-6 md:p-8">
          <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
            02 // CATEGORY_FILTER
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {['ALL', 'Layout', 'Spatial', 'Navigation', 'Conversion', 'Feedback', 'Typography'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  if (cat !== 'ALL') {
                    const matchIdx = MONARCH_COMPONENTS.findIndex((c) => c.category === cat);
                    if (matchIdx !== -1) setActiveIdx(matchIdx);
                  }
                }}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase transition-colors ${
                  categoryFilter === cat
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 03 // STAGE_CONTROLS */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
              03 // STAGE_CONTROLS
            </span>
            <button
              onClick={() => setAutoOrbit((v) => !v)}
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] transition-colors ${
                autoOrbit
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                  : 'border-neutral-200 bg-white text-neutral-500 dark:border-neutral-800 dark:bg-[#111113]'
              }`}
            >
              {autoOrbit ? 'Orbit: ON' : 'Orbit: OFF'}
            </button>
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between font-mono text-[10px] text-neutral-500">
              <span>SLAB SPACING</span>
              <span>{slabSpread.toFixed(2)}u</span>
            </div>
            <input
              type="range"
              min={1.4}
              max={3.0}
              step={0.05}
              value={slabSpread}
              onChange={(e) => setSlabSpread(Number(e.target.value))}
              className="w-full accent-neutral-900 dark:accent-white"
            />
          </div>
        </div>

        {/* 04 // EXPORT_TOKENS */}
        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
              04 // EXPORT_TOKENS ({darkMode ? 'DARK' : 'LIGHT'})
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-neutral-500">
              Copy the monochrome CSS variables or initialize theme tokens via CLI.
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() =>
                copyText(
                  `:root { --bg: ${darkMode ? '#09090B' : '#FAFAFA'}; --surface: ${darkMode ? '#111113' : '#FFFFFF'}; --border: ${darkMode ? '#27272A' : '#E4E4E7'}; }`,
                  'copy-css-vars'
                )
              }
              className="flex-1 rounded-full border border-neutral-200 bg-white px-3 py-1.5 font-mono text-[11px] transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
            >
              {copiedId === 'copy-css-vars' ? 'Copied CSS!' : 'Copy CSS Vars'}
            </button>
            <button
              onClick={() => copyText('npx rjui init', 'copy-init')}
              className="rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 font-mono text-[11px] transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
            >
              {copiedId === 'copy-init' ? 'Copied!' : 'CLI Init'}
            </button>
          </div>
        </div>
      </section>

      {/* 05 // Three.js Spatial Stage + Live Interactive Preview (Both visible together) */}
      <section id="stage" className="relative border-b border-neutral-200 px-6 py-8 md:px-10 dark:border-neutral-800">
        <CrosshairCorners />

        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
            05 // THREE.JS_SPATIAL_STAGE &amp; LIVE_PREVIEW · {active.id.toUpperCase()}
          </span>
          <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[11px] text-neutral-500 dark:border-neutral-800">
            {String(activeIdx + 1).padStart(2, '0')} / {String(MONARCH_COMPONENTS.length).padStart(2, '0')}
          </span>
        </div>

        <ThreeCoverflowStage
          components={MONARCH_COMPONENTS}
          activeIndex={activeIdx}
          darkMode={darkMode}
          autoOrbit={autoOrbit}
          slabSpread={slabSpread}
          onSelectIndex={setActiveIdx}
          onInspectIndex={() => {
            document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Compact Inline Deck Bar */}
        <div className="my-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => stepDeck(-1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-300 dark:hover:border-neutral-600"
            >
              <kbd className="font-mono text-[10px] text-neutral-400">←</kbd> Prev
            </button>
            <button
              onClick={() => stepDeck(1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-300 dark:hover:border-neutral-600"
            >
              Next <kbd className="font-mono text-[10px] text-neutral-400">→</kbd>
            </button>
            <span className="ml-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {active.name}
            </span>
          </div>
          <button
            onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="font-mono text-[11px] text-neutral-500 transition-colors hover:text-neutral-950 dark:hover:text-white"
          >
            INSPECT CODE &amp; PROPS ↓
          </button>
        </div>

        {/* Live Interactive Preview directly below Carousel (in same viewport) */}
        <div className="flex min-h-[280px] w-full items-center justify-center rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:min-h-[320px] sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40">
          <LiveComponentPreview componentId={active.id} />
        </div>
      </section>

      {/* 06 // Component Selector, Code Inspector & Props */}
      <section id="registry" className="relative border-b border-neutral-200 px-6 py-14 md:px-10 dark:border-neutral-800">
        <CrosshairCorners />

        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
              06 // CODE_INSPECTOR · {active.category}
            </span>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">{active.name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {active.description}
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-400">{active.filename}</span>
        </div>

        {/* Component Selector Bar */}
        <div className="mt-7 flex flex-wrap gap-2">
          {visibleComponents.map(({ c, idx }) => (
            <button
              key={c.id}
              onClick={() => setActiveIdx(idx)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                idx === activeIdx
                  ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-[#111113] dark:text-neutral-400 dark:hover:border-neutral-600'
              }`}
            >
              <span className="mr-1.5 font-mono text-[10px] opacity-60">
                {String(idx + 1).padStart(2, '0')}
              </span>
              {c.name}
            </button>
          ))}
        </div>

        {/* Code Inspector */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
            {(
              [
                ['usage', 'Usage Example'],
                ['react', active.filename],
                ['vanilla', 'HTML + CSS + JS']
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setCodeMode(mode)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition-colors ${
                  codeMode === mode
                    ? 'bg-white font-medium text-neutral-950 shadow-sm dark:bg-neutral-800 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => copyText(code, 'src-btn')}
            className="rounded-full border border-neutral-200 bg-white px-4 py-1.5 font-mono text-[11px] transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-[#111113] dark:hover:border-neutral-600"
          >
            {copiedId === 'src-btn' ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <pre className="mt-3 max-h-[360px] overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-mono text-xs leading-relaxed dark:border-neutral-800 dark:bg-[#111113]">
          <code>{code}</code>
        </pre>

        {/* Props Table */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] tracking-wider text-neutral-500 uppercase dark:border-neutral-800 dark:bg-[#111113]">
                <th className="px-4 py-3">Prop</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Default</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {active.props.map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-3 font-mono font-semibold">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-neutral-500">{p.type}</td>
                  <td className="px-4 py-3 font-mono">{p.defaultValue}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 07 // Bento Features Grid */}
      <section
        id="features"
        className="relative border-b border-neutral-200 px-6 py-16 md:px-10 dark:border-neutral-800"
      >
        <CrosshairCorners />

        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-widest text-neutral-500 uppercase">
            07 // ARCHITECTURE_HIGHLIGHTS
          </span>
          <span className="font-mono text-[11px] text-neutral-400">ENGINEERED FOR PRECISION</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
            <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Zero Layout Shift</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              GPU-composited transforms ensure surrounding layout geometry never jumps.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
            <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Zero Runtime Deps</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Every primitive is self-contained with zero external animation packages.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
            <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Dual React + Vanilla</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Install clean React + Tailwind TSX or pure HTML/CSS/JS via CLI.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-7 md:col-span-2 dark:border-neutral-800/80 dark:bg-neutral-900/50">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
              Fluid Spatial Physics
            </h3>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Driven by real-time requestAnimationFrame interpolation, not stiff linear timelines. Pointer tracking and 3D Cover Flow transitions stay interruptible at any frame.
            </p>
            <svg
              className="pointer-events-none absolute -bottom-4 right-8 h-36 w-36 text-neutral-200/60 dark:text-neutral-800/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-7 dark:border-neutral-800/80 dark:bg-neutral-900/50">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Keyboard First
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Navigate slabs with arrow keys or press ⌘K to jump anywhere.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => stepDeck(-1)}
                aria-label="Previous component"
                className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-xs text-neutral-600 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                ←
              </button>
              <button
                onClick={() => stepDeck(1)}
                aria-label="Next component"
                className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-xs text-neutral-600 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 08 // FAQ Section */}
      <section id="faq" className="px-6 py-20 md:px-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            Everything about using RenderJet primitives in your project.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
                >
                  <span>{item.q}</span>
                  <span className="ml-4 font-mono text-base text-neutral-400">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-4 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="ruler-ticks border-t border-neutral-200 dark:border-neutral-800" />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 px-6 py-6 font-mono text-[11px] tracking-widest text-neutral-500 uppercase md:px-10 dark:border-neutral-800">
        <span>RENDERJET (RJ) // NEXT.JS + TAILWIND + THREE.JS</span>
        <span>
          MIT LICENSE ·{' '}
          <a
            href="https://jatinsh.netlify.app/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950 dark:decoration-neutral-700 dark:hover:text-white"
          >
            JATIN SHARMA
          </a>
        </span>
      </footer>

      {/* Cmd+K Modal */}
      {cmdkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 pt-24 backdrop-blur-sm"
          onClick={() => setCmdkOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#09090B]"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter components by name or category..."
              className="w-full border-b border-neutral-200 bg-transparent px-4 py-3.5 font-mono text-xs outline-none dark:border-neutral-800"
            />
            <div className="max-h-72 divide-y divide-dashed divide-neutral-200 overflow-y-auto dark:divide-neutral-800">
              {filtered.map(({ c, idx }) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setCmdkOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900"
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
