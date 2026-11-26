/**
 * MonarchUI Core Type Definitions
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

export type ComponentCategory =
  | 'Layout'
  | 'Spatial'
  | 'Navigation'
  | 'Conversion'
  | 'Feedback'
  | 'Typography';

export type ComponentTier = 'Royal' | 'Signature' | 'Spatial';

export type ThemePresetId =
  | 'royal-obsidian'
  | 'apple-frost'
  | 'cyber-amethyst'
  | 'swiss-editorial';

export interface PropSpec {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface MonarchComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  tier: ComponentTier;
  tagline: string;
  description: string;
  designPatterns: string[];
  filename: string;
  props: PropSpec[];
  reactCode: string;
  vanillaCode: string;
}

export interface ThemeTokens {
  id: ThemePresetId;
  name: string;
  description: string;
  bgCanvas: string;
  bgSurface: string;
  borderHairline: string;
  accentPrimary: string;
  accentSecondary: string;
  textPrimary: string;
  textMuted: string;
  glowColor: string;
  blurPx: number;
  radiusPx: number;
}

export interface InstallResult {
  componentId: string;
  targetDir: string;
  filesWritten: string[];
  framework: 'react' | 'vanilla';
}
