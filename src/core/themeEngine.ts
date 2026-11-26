/**
 * MonarchUI Luxury Theme & Design Token Engine
 * Generates CSS Custom Properties and Tailwind CSS configuration extensions.
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import { ThemePresetId, ThemeTokens } from '../types.js';

export const THEME_PRESETS: Record<ThemePresetId, ThemeTokens> = {
  'royal-obsidian': {
    id: 'royal-obsidian',
    name: 'Royal Obsidian & Champagne',
    description: 'Deep carbon obsidian paired with champagne gold (#e5c158) and frosted hairline glass.',
    bgCanvas: '#050507',
    bgSurface: 'rgba(18, 19, 26, 0.72)',
    borderHairline: 'rgba(229, 193, 88, 0.18)',
    accentPrimary: '#e5c158',
    accentSecondary: '#f5e1a4',
    textPrimary: '#fafafa',
    textMuted: '#a1a1aa',
    glowColor: 'rgba(229, 193, 88, 0.28)',
    blurPx: 20,
    radiusPx: 20
  },
  'apple-frost': {
    id: 'apple-frost',
    name: 'Apple Spatial Frost',
    description: 'Ultra-clean Cupertino alabaster surfaces with translucent spatial glass and azure highlights.',
    bgCanvas: '#f5f5f7',
    bgSurface: 'rgba(255, 255, 255, 0.78)',
    borderHairline: 'rgba(0, 0, 0, 0.08)',
    accentPrimary: '#0071e3',
    accentSecondary: '#38bdf8',
    textPrimary: '#1d1d1f',
    textMuted: '#6e6e73',
    glowColor: 'rgba(0, 113, 227, 0.18)',
    blurPx: 24,
    radiusPx: 22
  },
  'cyber-amethyst': {
    id: 'cyber-amethyst',
    name: 'Cyber Amethyst & Cyan',
    description: 'High-voltage Linear/Raycast aesthetic with electric violet and neon cyan accents.',
    bgCanvas: '#07090e',
    bgSurface: 'rgba(15, 23, 42, 0.75)',
    borderHairline: 'rgba(168, 85, 247, 0.25)',
    accentPrimary: '#a855f7',
    accentSecondary: '#38bdf8',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    blurPx: 18,
    radiusPx: 16
  },
  'swiss-editorial': {
    id: 'swiss-editorial',
    name: 'Swiss Editorial Monochrome',
    description: 'International Typographic Style with razor-sharp hairlines and vermilion accents.',
    bgCanvas: '#0a0a0a',
    bgSurface: 'rgba(20, 20, 20, 0.9)',
    borderHairline: 'rgba(255, 255, 255, 0.14)',
    accentPrimary: '#ffffff',
    accentSecondary: '#ef4444',
    textPrimary: '#ffffff',
    textMuted: '#a3a3a3',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    blurPx: 8,
    radiusPx: 6
  }
};

export class ThemeEngine {
  static getPreset(id: ThemePresetId): ThemeTokens {
    return THEME_PRESETS[id] || THEME_PRESETS['royal-obsidian'];
  }

  static listPresets(): ThemeTokens[] {
    return Object.values(THEME_PRESETS);
  }

  static generateCssVariables(id: ThemePresetId): string {
    const t = this.getPreset(id);
    return `:root {
  --monarch-bg: ${t.bgCanvas};
  --monarch-surface: ${t.bgSurface};
  --monarch-border: ${t.borderHairline};
  --monarch-accent: ${t.accentPrimary};
  --monarch-accent-2: ${t.accentSecondary};
  --monarch-text: ${t.textPrimary};
  --monarch-muted: ${t.textMuted};
  --monarch-glow: ${t.glowColor};
  --monarch-blur: ${t.blurPx}px;
  --monarch-radius: ${t.radiusPx}px;
}
`;
  }

  static generateTailwindConfig(id: ThemePresetId): string {
    const t = this.getPreset(id);
    return `// tailwind.config.ts extension for MonarchUI (${t.name})
export default {
  theme: {
    extend: {
      colors: {
        monarch: {
          bg: '${t.bgCanvas}',
          accent: '${t.accentPrimary}',
          secondary: '${t.accentSecondary}',
          text: '${t.textPrimary}',
          muted: '${t.textMuted}'
        }
      },
      borderRadius: {
        monarch: '${t.radiusPx}px'
      },
      boxShadow: {
        'monarch-glow': '0 0 36px ${t.glowColor}'
      }
    }
  }
};
`;
  }
}
