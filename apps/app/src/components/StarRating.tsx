import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Icon } from './Icon';

export interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  /** Pulsing monochrome glow — used on the win screen */
  glowing?: boolean;
}

function GlowingStar({
  filled,
  size,
  delay,
}: {
  filled: boolean;
  size: number;
  delay: number;
}) {
  const { colors } = useTheme();
  const pulse = useSharedValue(0.6);

  useEffect(() => {
    if (!filled) return;
    pulse.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 900 }), withTiming(0.55, { duration: 900 })),
        -1,
      ),
    );
  }, [filled, delay, pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: filled ? pulse.value : 0,
    transform: [{ scale: 0.85 + pulse.value * 0.35 }],
  }));

  const starColor = filled ? colors.primary : colors.mutedForeground;

  return (
    <View style={[styles.starWrap, { width: size + 12, height: size + 12 }]}>
      {filled ? (
        <Animated.View
          style={[
            styles.glow,
            glowStyle,
            {
              backgroundColor: colors.glowStrong,
              shadowColor: colors.primary,
            },
          ]}
        />
      ) : null}
      <Icon
        name={filled ? 'star' : 'starOutline'}
        size={size}
        color={starColor}
        filled={filled}
        strokeWidth={filled ? 1.5 : 1.75}
      />
    </View>
  );
}

export function StarRating({ value, max = 3, size = 28, glowing = false }: StarRatingProps) {
  const { colors } = useTheme();

  if (glowing) {
    return (
      <View style={styles.row} accessibilityLabel={`${value} of ${max} stars`}>
        {Array.from({ length: max }).map((_, i) => (
          <GlowingStar key={i} filled={i < value} size={size} delay={i * 120} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row} accessibilityLabel={`${value} of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Icon
          key={i}
          name={i < value ? 'star' : 'starOutline'}
          size={size}
          color={i < value ? colors.primary : colors.mutedForeground}
          filled={i < value}
          style={{ marginHorizontal: 2 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  starWrap: { alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
});
