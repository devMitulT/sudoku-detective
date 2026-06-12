import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { createShadows, radius, spacing, useTheme } from '@/theme';

export interface AppModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  dismissOnBackdrop?: boolean;
  children: React.ReactNode;
}

export function AppModal({
  visible,
  onRequestClose,
  dismissOnBackdrop = true,
  children,
}: AppModalProps) {
  const { colors } = useTheme();
  const shadows = useMemo(() => createShadows(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onRequestClose} statusBarTranslucent>
      <Animated.View
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(150)}
        style={[styles.scrim, { backgroundColor: colors.overlay }]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissOnBackdrop ? onRequestClose : undefined}
        />
        <Animated.View entering={FadeInDown.springify().damping(20).stiffness(200)} style={styles.sheetWrap}>
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
              shadows.lg,
            ]}
          >
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheetWrap: { width: '100%', maxWidth: 400 },
  sheet: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.xxl,
  },
});
