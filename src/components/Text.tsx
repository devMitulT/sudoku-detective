import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { typography, useTheme } from '@/theme';

type Variant = keyof typeof typography;

export interface AppTextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  muted?: boolean;
}

/** Themed Text primitive. Defaults to body variant in the primary text color. */
export function Text({
  variant = 'body',
  color,
  center,
  muted,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  const resolved: TextStyle = {
    ...typography[variant],
    color: color ?? (muted ? colors.mutedForeground : colors.foreground),
    ...(center ? { textAlign: 'center' } : null),
  };
  return <RNText {...rest} style={[resolved, style]} />;
}
