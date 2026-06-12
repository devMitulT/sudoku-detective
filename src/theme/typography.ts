import { Platform, TextStyle } from 'react-native';

/**
 * Typography system. Uses platform system fonts (no custom font loading in the
 * MVP) with a monospace family reserved for "case file" / evidence numerics to
 * reinforce the investigative, typewriter feel.
 */
export const fontFamily = {
  display: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium', default: 'System' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

type Variant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label'
  | 'mono'
  | 'monoLarge';

export const typography: Record<Variant, TextStyle> = {
  display: { fontFamily: fontFamily.display, fontSize: 32, lineHeight: 38, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontFamily: fontFamily.display, fontSize: 24, lineHeight: 30, fontWeight: '600', letterSpacing: -0.3 },
  heading: { fontFamily: fontFamily.display, fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: -0.2 },
  subtitle: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 21, fontWeight: '600' },
  body: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, fontWeight: '400' },
  bodyStrong: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  caption: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 17, fontWeight: '400' },
  label: { fontFamily: fontFamily.body, fontSize: 10, lineHeight: 13, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase' },
  mono: { fontFamily: fontFamily.mono, fontSize: 13, lineHeight: 19, fontWeight: '500' },
  monoLarge: { fontFamily: fontFamily.mono, fontSize: 20, lineHeight: 26, fontWeight: '600', letterSpacing: 0.5 },
};
