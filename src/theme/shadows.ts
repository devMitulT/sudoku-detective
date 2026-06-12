import { Platform, ViewStyle } from 'react-native';
import { ThemeColors } from './tokens';
import { toRgba } from './depth';

const make = (
  color: string,
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: {
      shadowColor: color,
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height: offsetY },
    },
    android: { elevation },
    web: {
      boxShadow: `0px ${offsetY + 1}px ${Math.round(radius * 1.15)}px ${toRgba(color, Math.min(1, opacity + 0.12))}`,
    } as ViewStyle,
    default: {},
  }) as ViewStyle;

export function createShadows(colors: ThemeColors) {
  return {
    none: {} as ViewStyle,
    sm: make(colors.black, 0.1, 4, 1, 2),
    md: make(colors.black, 0.14, 8, 4, 4),
    lg: make(colors.black, 0.18, 16, 8, 8),
    xl: make(colors.black, 0.28, 24, 10, 14),
    glow: make(colors.primary, 0.45, 18, 0, 6),
    glowStrong: make(colors.primary, 0.6, 28, 0, 10),
    primaryGlow: make(colors.primary, 0.5, 20, 0, 8),
    depth: make(colors.black, 0.35, 14, 6, 8),
  } as const;
}

/** @deprecated Use createShadows(useTheme().colors) */
export const shadows = createShadows({
  black: '#000000',
  primary: '#00d4ff',
} as ThemeColors);
