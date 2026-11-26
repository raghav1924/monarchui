import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'RenderJet (RJ) — Spatial UI Primitives for React',
  description:
    'Fluid, physical motion with zero layout shifts. Built for the modern web with Three.js and Tailwind CSS.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="bg-[#F2F2EF] text-neutral-950 dark:bg-[#111115] dark:text-[#F4F4F5] font-sans transition-colors duration-200"
      >
        {children}
      </body>
    </html>
  );
}
