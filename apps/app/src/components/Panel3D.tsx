import React, { useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { createShadows, radius as radiusScale, useTheme, type DepthLevel } from '@/theme';
import { haptics } from '@/utils/haptics';

export interface Panel3DProps {
  children: React.ReactNode;
  /** Raised surface (default) or recessed tray. */
  variant?: 'raised' | 'inset';
  /** Controls the softness of the drop shadow on raised panels. */
  depth?: DepthLevel;
  borderRadius?: number;
  baseColor?: string;
  accent?: string;
  onPress?: () => void;
  disabled?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Soft-material surface — a flat board-game style card/tile.
 * Raised panels sit on the page with a light drop shadow; inset panels are
 * a recessed tray with no shadow.
 */
export function Panel3D({
  children,
  variant = 'raised',
  depth = 'md',
  borderRadius = radiusScale.lg,
  baseColor,
  accent,
  onPress,
  disabled,
  padded = true,
  style,
}: Panel3DProps) {
  const { colors } = useTheme();
  const shadows = useMemo(() => createShadows(colors), [colors]);
  const raised = variant === 'raised';
  const base = baseColor ?? (raised ? colors.card : colors.muted);

  const panel = (pressed?: boolean) => (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: base,
          borderRadius,
          borderWidth: accent ? 1.5 : 1,
          borderColor: accent ?? colors.border,
        },
        raised && (depth === 'lg' ? shadows.lg : depth === 'sm' ? shadows.sm : shadows.md),
        padded && styles.padded,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return panel();

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        haptics.light();
        onPress();
      }}
    >
      {({ pressed }) => panel(pressed)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  surface: { position: 'relative', overflow: 'hidden' },
  padded: { padding: 16 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
});
