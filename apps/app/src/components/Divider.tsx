import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing, useTheme } from '@/theme';
import { Text } from './Text';

export function Divider({ label }: { label?: string }) {
  const { colors } = useTheme();

  if (!label) return <View style={[styles.line, { backgroundColor: colors.border }]} />;
  return (
    <View style={styles.row}>
      <View style={[styles.flexLine, { backgroundColor: colors.border }]} />
      <Text variant="label" muted style={styles.label}>
        {label}
      </Text>
      <View style={[styles.flexLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, marginVertical: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  flexLine: { flex: 1, height: StyleSheet.hairlineWidth },
  label: { marginHorizontal: spacing.md },
});
