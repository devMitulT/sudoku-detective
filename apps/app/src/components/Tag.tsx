import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { radius, spacing, useTheme } from '@/theme';
import { Text } from './Text';

export interface TagProps {
  label: string;
  color?: string;
  tint?: string;
  variant?: 'default' | 'outline' | 'muted';
  style?: ViewStyle;
}

export function Tag({ label, color, tint, variant = 'outline', style }: TagProps) {
  const { colors } = useTheme();
  const resolved =
    color ?? (variant === 'muted' ? colors.mutedForeground : colors.foreground);
  const bg =
    tint ??
    (variant === 'muted'
      ? colors.muted
      : variant === 'default'
        ? colors.primary
        : 'transparent');
  const fg = variant === 'default' ? colors.primaryForeground : resolved;

  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[
          styles.tag,
          {
            borderColor: variant === 'default' ? bg : colors.border,
            backgroundColor: bg,
          },
        ]}
      >
        <Text variant="label" color={fg}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  tag: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    overflow: 'hidden',
  },
});
