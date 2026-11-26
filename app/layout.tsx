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
    'Fluid, physical motion with zero layout shifts. Built for the modern web with Three.js and Tailwind CSS.',
  openGraph: {
    title: 'RenderJet (RJ) — Spatial UI Primitives for React',
    description:
      'Fluid, physical motion with zero layout shifts. Built for the modern web with Three.js and Tailwind CSS.',
    images: [
      {
        url: '/og-thumbnail.jpg',
        width: 1200,
        height: 675,
        alt: 'RenderJet — Three.js Spatial Stage & Live Interactive Component Preview'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RenderJet (RJ) — Spatial UI Primitives for React',
    description:
      'Fluid, physical motion with zero layout shifts. Built for the modern web with Three.js and Tailwind CSS.',
    images: ['/og-thumbnail.jpg']
  }
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
