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
  title: 'MonarchUI — Technical Blueprint UI Registry & Three.js Spatial Studio',
  description:
    'Zero-dependency React, Next.js, Tailwind CSS & Three.js spatial UI component registry with exposed wireframe geometry.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#FAFAFA] text-[#09090B] dark:bg-[#09090B] dark:text-[#FAFAFA] font-sans transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
