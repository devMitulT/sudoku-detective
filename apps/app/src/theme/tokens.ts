/**
 * Sudoku Detective palettes.
 * Dark: deep navy + neon cyan glow.
 * Light: cream surfaces + dark brown ink.
 */
export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  borderStrong: string;
  input: string;
  ring: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  destructiveForeground: string;
  accent: string;
  accentForeground: string;
  overlay: string;
  scrim: string;

  text: string;
  textMuted: string;
  textFaint: string;
  textOnPrimary: string;
  surface: string;
  surfaceAlt: string;
  surfaceRaised: string;
  grid: string;
  white: string;
  black: string;
  transparent: string;

  cellGiven: string;
  cellEmpty: string;
  cellSelected: string;
  cellPeer: string;
  cellSame: string;
  cellSameRow: string;
  cellSameCol: string;
  cellHighlightText: string;
  cellRowColText: string;
  cellError: string;
  cellFog: string;

  glow: string;
  glowStrong: string;
}

const dark: ThemeColors = {
  background: '#050a14',
  foreground: '#e8f7ff',
  card: '#0a1528',
  cardForeground: '#e8f7ff',
  muted: '#0f1e33',
  mutedForeground: '#7eb8d4',
  border: '#1a3a5c',
  borderStrong: '#2563a8',
  input: '#142640',
  ring: '#00d4ff',
  primary: '#00d4ff',
  primaryForeground: '#041018',
  secondary: '#1a4a7a',
  secondaryForeground: '#b8ecff',
  destructive: '#ff4d8d',
  destructiveForeground: '#ffffff',
  accent: '#0d2847',
  accentForeground: '#7dd3fc',
  overlay: 'rgba(2, 8, 18, 0.82)',
  scrim: 'rgba(0, 0, 0, 0.6)',

  text: '#e8f7ff',
  textMuted: '#7eb8d4',
  textFaint: '#3d6a8a',
  textOnPrimary: '#041018',
  surface: '#0a1528',
  surfaceAlt: '#0d1c30',
  surfaceRaised: '#122640',
  grid: '#081220',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  cellGiven: '#060e1a',
  cellEmpty: '#0a1520',
  cellSelected: '#00d4ff',
  cellPeer: '#0c1a2e',
  cellSame: '#1a6b8a',
  cellSameRow: '#0f2238',
  cellSameCol: '#122840',
  cellHighlightText: '#041018',
  cellRowColText: '#b8ecff',
  cellError: '#2a1030',
  cellFog: '#040810',

  glow: 'rgba(0, 212, 255, 0.28)',
  glowStrong: 'rgba(0, 212, 255, 0.55)',
};

const light: ThemeColors = {
  background: '#f7f0e4',
  foreground: '#3d2914',
  card: '#fffdf8',
  cardForeground: '#3d2914',
  muted: '#ede4d4',
  mutedForeground: '#7a6552',
  border: '#d9cbb8',
  borderStrong: '#b8a088',
  input: '#e8dcc8',
  ring: '#5c3d2e',
  primary: '#5c3d2e',
  primaryForeground: '#faf6f0',
  secondary: '#c9a87c',
  secondaryForeground: '#3d2914',
  destructive: '#8b3a3a',
  destructiveForeground: '#faf6f0',
  accent: '#e8dcc8',
  accentForeground: '#5c3d2e',
  overlay: 'rgba(61, 41, 20, 0.45)',
  scrim: 'rgba(61, 41, 20, 0.3)',

  text: '#3d2914',
  textMuted: '#7a6552',
  textFaint: '#a8947e',
  textOnPrimary: '#faf6f0',
  surface: '#fffdf8',
  surfaceAlt: '#faf6f0',
  surfaceRaised: '#f0e6d6',
  grid: '#ede4d4',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  cellGiven: '#ede4d4',
  cellEmpty: '#fffdf8',
  cellSelected: '#5c3d2e',
  cellPeer: '#faf6f0',
  cellSame: '#a67c52',
  cellSameRow: '#f0e6d6',
  cellSameCol: '#e8dcc8',
  cellHighlightText: '#faf6f0',
  cellRowColText: '#3d2914',
  cellError: '#f5e0e0',
  cellFog: '#e0d4c4',

  glow: 'rgba(92, 61, 46, 0.18)',
  glowStrong: 'rgba(201, 168, 124, 0.4)',
};

export type Appearance = 'dark' | 'light';

export const themeTokens: Record<Appearance, ThemeColors> = { dark, light };

/** @deprecated Use useTheme().colors */
export const colors = dark;

export type ColorToken = keyof ThemeColors;
