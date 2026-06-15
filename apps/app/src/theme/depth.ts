import { Platform, ViewStyle } from 'react-native';
import { ThemeColors } from './tokens';

/** Shift hex channel brightness for bevel / shadow edges. */
export function adjustColor(hex: string, amount: number): string {
  const raw = hex.replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const num = parseInt(full, 16);
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Convert a hex (or passthrough rgb/rgba) color to an rgba() string at a given opacity. */
export function toRgba(color: string, opacity: number): string {
  if (!color.startsWith('#')) return color;
  const raw = color.replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export type DepthLevel = 'sm' | 'md' | 'lg';

const DEPTH_OFFSET: Record<DepthLevel, number> = { sm: 2, md: 4, lg: 6 };

export function depthOffset(level: DepthLevel): number {
  return DEPTH_OFFSET[level];
}

/** Simulated top-lit bevel on a raised surface. */
export function bevelBorder(colors: ThemeColors, raised = true): ViewStyle {
  const edge = raised ? colors.borderStrong : colors.border;
  return {
    borderTopColor: adjustColor(edge, raised ? 28 : 8),
    borderLeftColor: adjustColor(edge, raised ? 18 : 4),
    borderRightColor: adjustColor(edge, raised ? -12 : -4),
    borderBottomColor: adjustColor(edge, raised ? -22 : -10),
  };
}

export function faceGradient(
  colors: ThemeColors,
  base: string,
  raised = true,
): [string, string, string] {
  if (raised) {
    return [adjustColor(base, 14), base, adjustColor(base, -16)];
  }
  return [adjustColor(base, -8), base, adjustColor(base, -20)];
}

export function slabColor(colors: ThemeColors, base: string): string {
  return adjustColor(base, -28);
}

export function pressTransform(pressed: boolean, level: DepthLevel = 'md'): ViewStyle {
  const d = DEPTH_OFFSET[level];
  return pressed
    ? { transform: [{ translateY: d }, { scale: 0.98 }] }
    : { transform: [{ translateY: 0 }, { scale: 1 }] };
}

export function platformDepth(
  color: string,
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
): ViewStyle {
  return Platform.select<ViewStyle>({
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
}
