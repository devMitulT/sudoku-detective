import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { createShadows, radius, useTheme } from '@/theme';

export interface KeyCapProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
  /** `compact` for number pad; `tall` for icon + label controls. */
  size?: 'compact' | 'tall';
  style?: ViewStyle;
}

/** Soft-material key — flat tile with a light drop shadow, used on the number pad and controls. */
export function KeyCap({ children, onPress, disabled, active, size = 'compact', style }: KeyCapProps) {
  const { colors } = useTheme();
  const shadows = useMemo(() => createShadows(colors), [colors]);

  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.wrap, style]}>
      {({ pressed }) => (
        <View
          style={[
            styles.cap,
            size === 'tall' ? styles.capTall : styles.capCompact,
            {
              borderRadius: radius.lg,
              backgroundColor: active ? colors.primary : colors.card,
              borderColor: active ? colors.primary : colors.border,
              borderWidth: active ? 2 : 1,
            },
            shadows.sm,
            pressed && !disabled ? styles.pressed : undefined,
            disabled && styles.disabled,
          ]}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: 0 },
  cap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  capCompact: {
    minHeight: 44,
    paddingVertical: 2,
  },
  capTall: {
    minHeight: 68,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.32 },
});
