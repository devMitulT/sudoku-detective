import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, Icon, IconName, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { getCaseById } from '@/data/cases';
import { spacing, useTheme } from '@/theme';
import { NotebookEntryType } from '@/models';
import { useProgressStore } from '@/store';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

const TYPE_META: Record<NotebookEntryType, { label: string; icon: IconName }> = {
  evidence: { label: 'Evidence', icon: 'clue' },
  deduction: { label: 'Deduction', icon: 'deduction' },
  suspect: { label: 'Suspect', icon: 'suspect' },
  motive: { label: 'Motive', icon: 'motive' },
};

export function NotebookScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'Notebook'>();
  const def = getCaseById(params.caseId);
  const cp = useProgressStore((s) => s.player.cases[params.caseId]);
  const { colors } = useTheme();

  if (!def) return null;
  const entries = (cp?.notebook ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <ScreenContainer scroll>
      <TopBar title="Detective Notebook" subtitle={def.title} onBack={() => navigation.goBack()} />

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="notebook" size={48} color={colors.mutedForeground} strokeWidth={1.25} />
          <Text variant="subtitle" center style={{ marginTop: spacing.md }}>
            Nothing recorded yet
          </Text>
          <Text variant="caption" muted center style={{ marginTop: spacing.xs }}>
            Solve puzzles at the crime scene to collect evidence. Every clue you find is logged here.
          </Text>
        </View>
      ) : (
        entries.map((e, i) => {
          const meta = TYPE_META[e.type];
          return (
            <Animated.View key={e.id} entering={FadeInDown.delay(50 * i).duration(350)}>
              <Card style={styles.entry} padded>
                <View style={styles.entryHead}>
                  <Icon name={meta.icon} size={14} color={colors.foreground} />
                  <Tag label={meta.label} variant="muted" />
                </View>
                <View style={styles.entryRow}>
                  <Text variant="body" muted>{e.label}</Text>
                  <Text variant="bodyStrong" style={styles.value}>{e.value}</Text>
                </View>
              </Card>
            </Animated.View>
          );
        })
      )}

      {entries.length > 0 ? (
        <Text variant="caption" muted center style={{ marginTop: spacing.md }}>
          {entries.length} note{entries.length === 1 ? '' : 's'} · {cp?.cluesFound ?? 0}/{cp?.cluesTotal ?? def.evidence.length} evidence recovered
        </Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', paddingVertical: spacing.huge },
  entry: { marginBottom: spacing.md },
  entryHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  entryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg },
  value: { flexShrink: 1, textAlign: 'right' },
});
