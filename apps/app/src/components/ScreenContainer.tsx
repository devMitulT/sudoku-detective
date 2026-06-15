import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { adjustColor } from '@/theme/depth';
import { spacing, useTheme } from '@/theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  gradient?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
  footer?: React.ReactNode;
}

export function ScreenContainer({
  children,
  scroll,
  gradient,
  padded = true,
  edges = ['top', 'bottom'],
  contentStyle,
  footer,
}: ScreenContainerProps) {
  const { colors } = useTheme();

  const inner = (
    <View style={[styles.content, padded && styles.padded, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {gradient ? (
        <LinearGradient
          colors={[
            adjustColor(colors.muted, 8),
            colors.background,
            adjustColor(colors.background, -6),
          ]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}
      <SafeAreaView style={styles.safe} edges={edges}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, padded && styles.padded, contentStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          inner
        )}
        {footer ? <View style={[styles.footer, padded && styles.footerPadded]}>{footer}</View> : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.xxl },
  padded: { paddingHorizontal: spacing.xl },
  footer: { paddingTop: spacing.md },
  footerPadded: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
});
