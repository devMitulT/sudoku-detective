import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, IconName, KeyCap, Text } from '@/components';
import { radius, spacing, useTheme } from '@/theme';
import { haptics } from '@/utils/haptics';

interface ControlProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
}

function Control({ icon, label, onPress, active, disabled, badge }: ControlProps) {
  const { colors } = useTheme();
  const fg = active ? colors.primaryForeground : colors.mutedForeground;
  const labelColor = active ? colors.foreground : colors.mutedForeground;

  return (
    <View style={styles.controlWrap}>
      <KeyCap
        size="tall"
        style={styles.key}
        disabled={disabled}
        active={active}
        onPress={() => {
          haptics.light();
          onPress();
        }}
      >
        <View style={styles.content}>
          <Text variant="label" color={labelColor} style={styles.label}>
            {label}
          </Text>
          <View style={styles.iconWrap}>
            <Icon name={icon} size={20} color={fg} strokeWidth={1.75} />
            {badge ? (
              <View style={[styles.badge, { backgroundColor: colors.foreground }]}>
                <Text variant="label" color={colors.primaryForeground} style={styles.badgeText}>
                  {badge}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </KeyCap>
    </View>
  );
}

export interface GameControlsProps {
  onErase: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  noteMode: boolean;
  hintsRemaining: number | null;
  hintsAllowed: boolean;
  canBuyHint?: boolean;
  buyHintPrice?: number;
}

export function GameControls({
  onErase,
  onToggleNotes,
  onHint,
  noteMode,
  hintsRemaining,
  hintsAllowed,
  canBuyHint,
  buyHintPrice,
}: GameControlsProps) {
  const noFreeHints = hintsRemaining === 0;
  const hintDisabled = (!hintsAllowed && !canBuyHint) || (noFreeHints && !canBuyHint);
  const hintBadge =
    canBuyHint && noFreeHints && buyHintPrice
      ? `+${buyHintPrice}`
      : hintsAllowed && hintsRemaining !== null
        ? String(hintsRemaining)
        : undefined;

  return (
    <View style={styles.row}>
      <Control icon="erase" label="Erase" onPress={onErase} />
      <Control icon="pencil" label="Notes" onPress={onToggleNotes} active={noteMode} />
      <Control
        icon="hint"
        label="Hint"
        onPress={onHint}
        disabled={hintDisabled}
        badge={hintBadge}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-around', gap: spacing.sm },
  controlWrap: { flex: 1, alignItems: 'center', maxWidth: 110 },
  key: { flex: 0, width: 80, alignSelf: 'center' },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  label: { textAlign: 'center', lineHeight: 14 },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 22,
    minWidth: 28,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -14,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 9, lineHeight: 11 },
});
