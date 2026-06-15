import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { adjustColor } from '@/theme/depth';
import { createShadows, radius, spacing, useTheme } from '@/theme';
import { haptics } from '@/utils/haptics';
import { audio } from '@/audio';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: IconName;
  iconOnly?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  fullWidth,
  icon,
  iconOnly,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const shadows = useMemo(() => createShadows(colors), [colors]);
  const sizing = SIZES[size];
  const palette = getPalette(colors, variant);
  const isDisabled = disabled || loading;
  const filled = variant === 'primary' || variant === 'secondary' || variant === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={iconOnly ? label : undefined}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={() => {
        haptics.light();
        audio.play('click');
        onPress?.();
      }}
      style={({ pressed }) => [
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.base,
          {
            paddingVertical: sizing.py,
            paddingHorizontal: iconOnly ? sizing.py : sizing.px,
            borderRadius: sizing.radius,
            backgroundColor: palette.bg,
            borderColor: palette.border,
            borderWidth: palette.borderWidth,
          },
          filled && shadows.sm,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={palette.fg} />
        ) : (
          <View style={styles.row}>
            {icon ? (
              <Icon
                name={icon}
                size={iconOnly ? (size === 'lg' ? 22 : 20) : size === 'lg' ? 18 : 16}
                color={palette.fg}
                style={iconOnly ? undefined : { marginRight: spacing.sm }}
              />
            ) : null}
            {iconOnly ? null : (
              <Text
                variant={size === 'lg' ? 'subtitle' : 'bodyStrong'}
                color={palette.fg}
                style={styles.label}
              >
                {label}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const SIZES: Record<ButtonSize, { py: number; px: number; radius: number }> = {
  sm: { py: spacing.sm, px: spacing.lg, radius: radius.md },
  md: { py: spacing.md, px: spacing.xl, radius: radius.md },
  lg: { py: spacing.lg, px: spacing.xxl, radius: radius.lg },
};

function getPalette(colors: ReturnType<typeof useTheme>['colors'], variant: ButtonVariant) {
  switch (variant) {
    case 'primary':
      return {
        bg: colors.primary,
        fg: colors.primaryForeground,
        border: adjustColor(colors.primary, -20),
        borderWidth: 1,
      };
    case 'secondary':
      return {
        bg: colors.secondary,
        fg: colors.secondaryForeground,
        border: adjustColor(colors.secondary, -18),
        borderWidth: 1,
      };
    case 'danger':
      return {
        bg: colors.destructive,
        fg: colors.destructiveForeground,
        border: adjustColor(colors.destructive, -24),
        borderWidth: 1,
      };
    case 'outline':
      return {
        bg: colors.transparent,
        fg: colors.foreground,
        border: colors.border,
        borderWidth: 1,
      };
    default:
      return {
        bg: colors.transparent,
        fg: colors.mutedForeground,
        border: colors.transparent,
        borderWidth: 0,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label: { letterSpacing: 0.2 },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
});
