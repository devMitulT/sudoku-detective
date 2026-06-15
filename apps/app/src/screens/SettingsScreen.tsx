import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { AppModal, Button, Card, IconText, ScreenContainer, Text, TopBar } from '@/components';
import { AppearanceSetting, PlayerSettings } from '@/models';
import { radius, spacing, useTheme } from '@/theme';
import { currentRank, useProgressStore } from '@/store';
import { audio } from '@/audio';
import { useAppNavigation } from '@/navigation/types';

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

function ToggleRow({ label, description, value, onValueChange }: ToggleRowProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text variant="bodyStrong">{label}</Text>
        {description ? <Text variant="caption" muted>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.muted }}
        thumbColor={colors.background}
      />
    </View>
  );
}

const APPEARANCE_OPTIONS: { value: AppearanceSetting; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

export function SettingsScreen() {
  const navigation = useAppNavigation();
  const settings = useProgressStore((s) => s.player.settings);
  const player = useProgressStore((s) => s.player);
  const updateSettings = useProgressStore((s) => s.updateSettings);
  const resetCase = useProgressStore((s) => s.resetCase);
  const { colors } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (patch: Partial<PlayerSettings>) => updateSettings(patch);

  return (
    <ScreenContainer scroll>
      <TopBar title="Settings" onBack={() => navigation.goBack()} />

      <Card>
        <Text variant="label" muted>Detective Profile</Text>
        <View style={[styles.row, { marginTop: spacing.sm }]}>
          <Text variant="bodyStrong">Rank</Text>
          <Text variant="bodyStrong">{currentRank(player)}</Text>
        </View>
        <View style={styles.row}>
          <Text variant="bodyStrong">Coins</Text>
          <IconText name="coin" muted={false} variant="bodyStrong" size={15}>
            {player.coins}
          </IconText>
        </View>
        <View style={styles.row}>
          <Text variant="bodyStrong">Badges</Text>
          <Text variant="bodyStrong">{player.badges.length}</Text>
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text variant="label" muted style={{ marginBottom: spacing.sm }}>
          Appearance
        </Text>
        <View style={styles.appearanceRow}>
          {APPEARANCE_OPTIONS.map((opt) => {
            const active = settings.appearance === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => set({ appearance: opt.value })}
                style={[
                  styles.appearanceBtn,
                  {
                    backgroundColor: active ? colors.primary : colors.muted,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  variant="caption"
                  color={active ? colors.primaryForeground : colors.mutedForeground}
                  style={{ fontWeight: '600' }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text variant="label" muted style={{ marginBottom: spacing.sm }}>
          Audio & Feedback
        </Text>
        <ToggleRow
          label="Music"
          value={settings.musicEnabled}
          onValueChange={(v) => {
            set({ musicEnabled: v });
            audio.applyMusicSetting(v);
          }}
        />
        <ToggleRow label="Sound Effects" value={settings.soundEnabled} onValueChange={(v) => set({ soundEnabled: v })} />
        <ToggleRow label="Haptics" value={settings.hapticsEnabled} onValueChange={(v) => set({ hapticsEnabled: v })} />
      </Card>

      <Card style={{ marginTop: spacing.lg }}>
        <Text variant="label" muted style={{ marginBottom: spacing.sm }}>
          Gameplay
        </Text>
        <ToggleRow
          label="Highlight Peers"
          description="Tint cells in the same row, column and box."
          value={settings.highlightPeers}
          onValueChange={(v) => set({ highlightPeers: v })}
        />
        <ToggleRow
          label="Auto-clear Notes"
          description="Remove pencil marks when a value is placed."
          value={settings.autoRemoveNotes}
          onValueChange={(v) => set({ autoRemoveNotes: v })}
        />
      </Card>

      <Button
        label="Reset Case #001 Progress"
        variant="outline"
        fullWidth
        style={{ marginTop: spacing.xl }}
        onPress={() => setConfirmReset(true)}
      />
      <Text variant="caption" muted center style={{ marginTop: spacing.md }}>
        Sudoku Detective · MVP v1.0 · Offline
      </Text>

      <AppModal visible={confirmReset} onRequestClose={() => setConfirmReset(false)}>
        <Text variant="heading" center>Reset this case?</Text>
        <Text variant="body" muted center style={{ marginTop: spacing.md }}>
          All evidence, notes and puzzle progress for "The Midnight Laboratory" will be erased.
        </Text>
        <Button
          label="Reset Progress"
          variant="danger"
          fullWidth
          style={{ marginTop: spacing.xl }}
          onPress={() => {
            resetCase('case-001');
            setConfirmReset(false);
          }}
        />
        <Button label="Cancel" variant="ghost" fullWidth style={{ marginTop: spacing.sm }} onPress={() => setConfirmReset(false)} />
      </AppModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  rowText: { flex: 1, paddingRight: spacing.lg, gap: 2 },
  appearanceRow: { flexDirection: 'row', gap: spacing.sm },
  appearanceBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
