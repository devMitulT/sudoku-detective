import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, KeyCap, Text } from '@/components';
import { spacing, useTheme } from '@/theme';
import { haptics } from '@/utils/haptics';
import { audio } from '@/audio';

export interface NumberPadProps {
  onPress: (num: number) => void;
  remaining: Record<number, number>;
  noteMode: boolean;
  highlightedNumber?: number | null;
}

export function NumberPad({ onPress, remaining, noteMode, highlightedNumber }: NumberPadProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.pad, noteMode && styles.padNotes]}>
      {Array.from({ length: 9 }).map((_, i) => {
        const num = i + 1;
        const left = remaining[num] ?? 0;
        const done = left <= 0;
        const highlighted = highlightedNumber === num;
        const digitColor = highlighted ? colors.primaryForeground : colors.foreground;

        return (
          <KeyCap
            key={num}
            disabled={done}
            active={highlighted}
            onPress={() => {
              haptics.selection();
              audio.play('place');
              onPress(num);
            }}
          >
            <View style={styles.keyContent}>
              <Text variant="title" color={digitColor} style={styles.digit}>
                {num}
              </Text>
              {done ? (
                <Icon name="check" size={10} color={digitColor} />
              ) : (
                <Text variant="label" color={digitColor} style={styles.count}>
                  {left}
                </Text>
              )}
            </View>
          </KeyCap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  padNotes: {
    paddingVertical: spacing.md,
  },
  keyContent: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  digit: { fontSize: 18, lineHeight: 20 },
  count: { fontSize: 8, lineHeight: 10 },
});
