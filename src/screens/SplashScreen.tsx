import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icon, ScreenContainer, Text } from '@/components';
import { radius, spacing, useTheme } from '@/theme';
import { useAppNavigation } from '@/navigation/types';

export function SplashScreen() {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const glow = useSharedValue(0.3);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1000 }), withTiming(0.3, { duration: 1000 })),
      -1,
    );
    const t = setTimeout(() => navigation.replace('MainMenu'), 1900);
    return () => clearTimeout(t);
  }, [navigation, glow]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <ScreenContainer gradient padded={false}>
      <View style={styles.center}>
        <Animated.View
          entering={FadeIn.duration(600)}
          style={[
            styles.badge,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Icon name="brand" size={56} color={colors.primary} strokeWidth={1.5} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(250).duration(600)}>
          <Text variant="display" center style={{ letterSpacing: 4 }}>
            SUDOKU
          </Text>
          <Text variant="display" center color={colors.primary} style={{ letterSpacing: 6 }}>
            DETECTIVE
          </Text>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(700).duration(600)} style={glowStyle}>
          <Text variant="label" muted center style={styles.tagline}>
            Every puzzle hides a clue
          </Text>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  badge: {
    width: 96,
    height: 96,
    borderRadius: radius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  tagline: { marginTop: spacing.xl, letterSpacing: 3 },
});
