'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { LiveComponentPreview } from '@/components/LiveComponentPreview';
import { ThreeCoverflowStage } from '@/components/ThreeCoverflowStage';
import { MONARCH_COMPONENTS } from '@/src/registry/components';
import { getComponentUsage } from '@/src/registry/usage';

const FAQS = [
  {
    q: 'What is Monarch UI?',
    a: 'Monarch UI is a curated registry of 12 luxury-grade interactive React, Tailwind CSS, and Vanilla HTML/CSS primitives with zero runtime dependencies and an interactive Three.js Cover Flow studio.'
  },
  {
    q: 'How do I add a component to my project?',
    a: 'Run `npx monarchui add <component-id>` in your project root, or switch to the Code tab in the inspector below to copy the self-contained React or Vanilla HTML/CSS source directly.'
  },
  {
    q: 'Does it work with Next.js, Tailwind CSS, and shadcn/ui?',
    a: 'Yes. Every component is written in clean TypeScript + Tailwind CSS utility classes (and also ships with a Vanilla HTML/CSS/JS fallback) so it drops straight into Next.js App Router or Pages Router.'
  },
  {
    q: 'Are the animations accessible and GPU-accelerated?',
    a: 'Yes. Animations rely on GPU-composited transforms, opacity, and requestAnimationFrame lerps with zero layout shifts and full keyboard navigation support.'
  },
  {
    q: 'Is Monarch UI free to use?',
    a: 'Yes. Monarch UI is MIT-licensed and completely free for personal and commercial projects.'
  }
];

function CrosshairCorners() {
  return (
    <>
      <span className="pointer-events-none absolute -bottom-[7px] -left-[5px] select-none font-mono text-[11px] leading-none text-neutral-300 dark:text-neutral-700">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-[7px] -right-[5px] select-none font-mono text-[11px] leading-none text-neutral-300 dark:text-neutral-700">
        +
      </span>
    </>
  );
}

export default function MonarchHomePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [codeMode, setCodeMode] = useState<'usage' | 'react' | 'vanilla'>('usage');
  const [inspectorTab, setInspectorTab] = useState<'preview' | 'code' | 'props'>('preview');
  const [darkMode, setDarkMode] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
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
    <div className="min-h-screen bg-white text-neutral-950 dark:bg-[#09090B] dark:text-[#FAFAFA]">
      {/* Announcement Strip */}
      <div className="border-b border-neutral-200/80 px-4 py-2 text-center text-xs text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
        <button
          onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-950 dark:hover:text-white"
        >
          <span>
            Monarch UI is a curated registry of{' '}
            <strong className="font-medium text-neutral-900 dark:text-neutral-100">
              12 animated React &amp; Vanilla
            </strong>{' '}
            components
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Main Architectural Rail Container */}
      <div className="mx-auto max-w-[1080px] border-x border-dashed border-neutral-200 dark:border-neutral-800">
        {/* Header / Navbar */}
        <header className="relative flex items-center justify-between border-b border-dashed border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <CrosshairCorners />

          {/* Left: Geometric Monarch Mark + Wordmark */}
          <a href="#" className="flex items-center gap-2.5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-neutral-950 dark:text-white"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="12" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 7.5V16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M21 7.5V16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight">Monarch UI</span>
          </a>

          {/* Center: Clean Nav Links */}
          <nav className="hidden items-center gap-7 text-[13px] font-medium text-neutral-500 md:flex dark:text-neutral-400">
            <a href="#registry" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
              Components
            </a>
            <a href="#features" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
              Features
            </a>
            <a href="#faq" className="transition-colors hover:text-neutral-950 dark:hover:text-white">
              FAQ
            </a>
          </nav>

          {/* Right: Cmd+K, GitHub pill, Theme Icon */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCmdkOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-950 sm:inline-flex dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-white"
            >
              <span>Search</span>
              <kbd className="font-mono text-[10px] text-neutral-400">⌘K</kbd>
            </button>

            <a
              href="https://github.com/raghav1924/monarchui"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>★ 12</span>
            </a>

            <button
              onClick={toggleDark}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-white"
            >
              {darkMode ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Centered Editorial Hero */}
        <section className="px-6 pt-16 pb-14 text-center sm:pt-20 sm:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-50/80 px-3.5 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
            <span>Zero runtime dependencies, reimagined.</span>
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-[54px] sm:leading-[1.08] dark:text-white">
            Spatial UI Primitives for React.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
            Fluid, physical motion with zero layout shifts.
            <br />
            Built for the modern web with{' '}
            <span className="font-medium text-neutral-800 dark:text-neutral-200">Three.js</span> and{' '}
            <span className="font-medium text-neutral-800 dark:text-neutral-200">Tailwind</span>.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full bg-neutral-950 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Get Started
            </button>
          </div>
        </section>

        {/* CLI Band */}
        <div className="border-y border-dashed border-neutral-200 py-3.5 text-center dark:border-neutral-800">
          <button
            onClick={() => copyText(`npx monarchui add ${active.id}`, 'hero-cli')}
            className="inline-flex items-center gap-2.5 rounded-md px-3 py-1 font-mono text-xs text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            <span>
              {copiedId === 'hero-cli' ? 'Copied to clipboard!' : `npx monarchui add ${active.id}`}
            </span>
          </button>
        </div>

        {/* 3D Cover Flow Stage */}
        <section className="relative border-b border-dashed border-neutral-200 pt-8 pb-12 dark:border-neutral-800">
          <CrosshairCorners />

          <ThreeCoverflowStage
            components={MONARCH_COMPONENTS}
            activeIndex={activeIdx}
            darkMode={darkMode}
            slabSpread={1.45}
            onSelectIndex={setActiveIdx}
            onInspectIndex={() => {
              setInspectorTab('preview');
              document.getElementById('registry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />

          {/* Clean Centered Active Caption (matching Page 2 of PDF) */}
          <div className="mt-2 px-6 text-center">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
              {active.name}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {active.category} • {active.filename}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500">
              <button
                onClick={() => stepDeck(-1)}
                className="rounded-md border border-neutral-200 px-2.5 py-1 text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
              >
                ← Prev
              </button>
              <span>Horizontal Scroll • Drag • Keyboard</span>
              <button
                onClick={() => stepDeck(1)}
                className="rounded-md border border-neutral-200 px-2.5 py-1 text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white"
              >
                Next →
              </button>
            </div>
          </div>
        </section>

        {/* Clean Live Preview & Code Inspector */}
        <section
          id="registry"
          className="relative border-b border-dashed border-neutral-200 px-6 py-16 sm:px-10 dark:border-neutral-800"
        >
          <CrosshairCorners />

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Interactive Component Studio · {String(activeIdx + 1).padStart(2, '0')} /{' '}
                {String(MONARCH_COMPONENTS.length).padStart(2, '0')}
              </span>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">{active.name}</h2>
              <p className="mt-1 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
                {active.description}
              </p>
            </div>

            <div className="inline-flex self-start rounded-full border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-900">
              {(['preview', 'code', 'props'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInspectorTab(tab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                    inspectorTab === tab
                      ? 'bg-white text-neutral-950 shadow-sm dark:bg-neutral-800 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Component Pill Switcher */}
          <div className="mt-7 flex flex-wrap items-center gap-1.5">
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {visibleComponents.map(({ c, idx }) => (
              <button
                key={c.id}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  idx === activeIdx
                    ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Stage Content */}
          <div className="mt-5">
            {inspectorTab === 'preview' && (
              <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-6 sm:p-10 dark:border-neutral-800 dark:bg-neutral-900/40">
                <LiveComponentPreview componentId={active.id} />
              </div>
            )}

            {inspectorTab === 'code' && (
              <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="flex gap-1.5">
                    {(
                      [
                        ['usage', 'Usage'],
                        ['react', active.filename],
                        ['vanilla', 'HTML / CSS / JS']
                      ] as const
                    ).map(([mode, label]) => (
                      <button
                        key={mode}
                        onClick={() => setCodeMode(mode)}
                        className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
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
                    className="rounded-md border border-neutral-200 bg-white px-3 py-1 font-mono text-xs text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {copiedId === 'src-btn' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="max-h-[380px] overflow-auto bg-white p-5 font-mono text-xs leading-relaxed text-neutral-800 dark:bg-[#0c0c0e] dark:text-neutral-200">
                  <code>{code}</code>
                </pre>
              </div>
            )}

            {inspectorTab === 'props' && (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[11px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                      <th className="px-4 py-3 font-medium">Prop</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Default</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {active.props.map((p) => (
                      <tr key={p.name} className="bg-white dark:bg-neutral-950">
                        <td className="px-4 py-3 font-mono font-semibold text-neutral-950 dark:text-white">
                          {p.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-neutral-500">{p.type}</td>
                        <td className="px-4 py-3 font-mono text-neutral-700 dark:text-neutral-300">
                          {p.defaultValue}
                        </td>
                        <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Bento Features Grid (matching Page 3 of PDF) */}
        <section
          id="features"
          className="relative border-b border-dashed border-neutral-200 px-6 py-16 sm:px-10 dark:border-neutral-800"
        >
          <CrosshairCorners />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Zero Layout Shift */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Zero Layout Shift</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Isolated transforms ensure the surrounding layout never jumps.
              </p>
              <svg
                className="pointer-events-none mx-auto mt-4 h-16 w-16 text-neutral-200/80 dark:text-neutral-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Touch Ready */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Touch Ready</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                1:1 pointer tracking with smooth velocity-aware interpolation.
              </p>
              <svg
                className="pointer-events-none mx-auto mt-4 h-16 w-16 text-neutral-200/80 dark:text-neutral-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <path d="M12 18h.01" strokeLinecap="round" />
              </svg>
            </div>

            {/* Dark Mode Native */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Dark Mode Native</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Optimized for deep blacks, crisp hairlines, and clean contrast.
              </p>
              <svg
                className="pointer-events-none mx-auto mt-4 h-16 w-16 text-neutral-200/80 dark:text-neutral-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Fluid Physics Engine (2 cols wide) */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-7 md:col-span-2 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Fluid Physics Engine
              </h3>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Driven by real-time frame interpolation, not stiff linear timelines. The motion feels weighty, responsive, and interruptible at any frame.
              </p>
              <svg
                className="pointer-events-none absolute -bottom-4 right-10 h-44 w-44 text-neutral-200/60 dark:text-neutral-800/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Keyboard First */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-7 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                  Keyboard First
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Fully accessible with arrow key navigation and ⌘K search.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-center gap-2.5">
                <button
                  onClick={() => stepDeck(-1)}
                  aria-label="Previous component"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-xs text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  ←
                </button>
                <button
                  onClick={() => stepDeck(1)}
                  aria-label="Next component"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-xs text-neutral-600 shadow-sm transition-colors hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  →
                </button>
              </div>
            </div>

            {/* Signature Three.js Stage */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Three.js Spatial Stage</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Hardware-accelerated 3D Cover Flow cards with crisp Canvas textures.
              </p>
            </div>

            {/* Dual Output */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">React &amp; Vanilla Output</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Every primitive ships in both React + Tailwind and pure HTML/CSS/JS.
              </p>
            </div>

            {/* Auto-Responsive */}
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50/90 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Auto-Responsive</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Measures its container via ResizeObserver and scales spacing smoothly.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (matching Page 4 of PDF) */}
        <section id="faq" className="px-6 py-20 sm:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Everything about using Monarch UI components in your React project.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
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

        {/* Minimal Architectural Footer (matching Page 4 of PDF) */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-neutral-200 px-6 py-6 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
          <span>
            Built by{' '}
            <a
              href="https://jatinsh.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950 dark:decoration-neutral-700 dark:hover:text-white"
            >
              Jatin Sharma
            </a>{' '}
            · Built with Next.js &amp; Three.js · Source code on{' '}
            <a
              href="https://github.com/raghav1924/monarchui"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950 dark:decoration-neutral-700 dark:hover:text-white"
            >
              GitHub
            </a>
          </span>
          <span className="text-neutral-400">v1.0.0 · MIT License</span>
        </footer>
      </div>

      {/* Cmd+K Modal */}
      {cmdkOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24 backdrop-blur-sm"
          onClick={() => setCmdkOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#111113]"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components by name or category..."
              className="w-full border-b border-neutral-200 bg-transparent px-4 py-3.5 text-sm outline-none dark:border-neutral-800"
            />
            <div className="max-h-72 divide-y divide-neutral-100 overflow-y-auto dark:divide-neutral-800/70">
              {filtered.map(({ c, idx }) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveIdx(idx);
                    setCmdkOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">{c.name}</span>
                  <span className="text-xs text-neutral-400">{c.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
