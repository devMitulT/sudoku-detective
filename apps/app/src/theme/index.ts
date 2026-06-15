export { colors, themeTokens } from './tokens';
export type { ThemeColors, Appearance, ColorToken } from './tokens';
export { ThemeProvider, useTheme } from './ThemeContext';
export { typography, fontFamily, fontWeight } from './typography';
export { spacing, radius } from './spacing';
export type { Spacing, Radius } from './spacing';
export { createShadows, shadows } from './shadows';
export {
  adjustColor,
  bevelBorder,
  depthOffset,
  faceGradient,
  platformDepth,
  pressTransform,
  slabColor,
} from './depth';
export type { DepthLevel } from './depth';

import { colors } from './tokens';
import { typography, fontFamily, fontWeight } from './typography';
import { spacing, radius } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  fontFamily,
  fontWeight,
  spacing,
  radius,
  shadows,
} as const;

export type Theme = typeof theme;
