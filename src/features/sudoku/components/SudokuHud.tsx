import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components';
import { radius, spacing, useTheme } from '@/theme';
import { formatTime } from '@/utils/time';

export interface SudokuHudProps {
  difficultyLabel: string;
  mistakes: number;
  maxMistakes?: number;
  elapsedSec: number;
  remainingSec: number | null;
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.stat}>
      <Text variant="label" muted>
        {label}
      </Text>
      <Text variant="bodyStrong" color={danger ? colors.destructive : colors.foreground}>
        {value}
      </Text>
    </View>
  );
}

export function SudokuHud({
  difficultyLabel,
  mistakes,
  maxMistakes,
  elapsedSec,
  remainingSec,
}: SudokuHudProps) {
  const { colors } = useTheme();
  const timed = remainingSec !== null;
  const lowTime = timed && remainingSec! <= 30;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Stat label="Mode" value={difficultyLabel} />
      <Stat
        label="Mistakes"
        value={maxMistakes !== undefined ? `${mistakes}/${maxMistakes}` : String(mistakes)}
        danger={maxMistakes !== undefined && mistakes >= maxMistakes}
      />
      <Stat
        label={timed ? 'Time Left' : 'Time'}
        value={formatTime(timed ? remainingSec! : elapsedSec)}
        danger={lowTime}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  stat: { alignItems: 'center', gap: 2 },
});
