import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from './Text';

export interface AvatarProps {
  initials: string;
  accent?: string;
  size?: number;
  dimmed?: boolean;
  style?: ViewStyle;
}

export function Avatar({ initials, size = 52, dimmed, style }: AvatarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: dimmed ? colors.border : colors.foreground,
          backgroundColor: colors.muted,
          opacity: dimmed ? 0.45 : 1,
        },
        style,
      ]}
    >
      <Text
        variant="bodyStrong"
        color={dimmed ? colors.mutedForeground : colors.foreground}
        style={{ fontSize: size * 0.34, letterSpacing: 0.5 }}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
});
