import React from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { createShadows, radius, useTheme } from '@/theme';

export const MOBILE_MAX_WIDTH = 480;
const FRAME_MAX_HEIGHT = 940;

export interface ResponsiveShellProps {
  children: React.ReactNode;
}

export function ResponsiveShell({ children }: ResponsiveShellProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const shadows = createShadows(colors);
  const framed = Platform.OS === 'web' && width > MOBILE_MAX_WIDTH;

  return (
    <View style={[styles.page, { backgroundColor: colors.background }, framed && styles.pageFramed]}>
      <View
        style={[
          styles.app,
          framed && [
            styles.appFramed,
            {
              backgroundColor: colors.background,
              borderColor: colors.borderStrong,
            },
            shadows.lg,
          ],
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageFramed: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  app: { flex: 1, width: '100%' },
  appFramed: {
    flex: 1,
    width: '100%',
    maxWidth: MOBILE_MAX_WIDTH,
    maxHeight: FRAME_MAX_HEIGHT,
    borderRadius: radius.xxl,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
