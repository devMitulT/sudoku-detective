import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Icon, ScreenContainer, StarRating, Tag, Text, TopBar } from '@/components';
import { CASES } from '@/data/cases';
import { getCaseUnlockStatus } from '@/features/investigation/unlock';
import { spacing, useTheme } from '@/theme';
import { useProgressStore } from '@/store';
import { formatCaseNumber } from '@/utils/time';
import { useAppNavigation } from '@/navigation/types';

export function CaseSelectScreen() {
  const navigation = useAppNavigation();
  const player = useProgressStore((s) => s.player);
  const { colors } = useTheme();

  return (
    <ScreenContainer scroll>
      <TopBar title="Case Files" onBack={() => navigation.goBack()} />

      {CASES.map((c) => {
        const status = getCaseUnlockStatus(c, player);
        const cp = player.cases[c.id];
        const locked = status === 'locked';
        const solved = status === 'solved';
        const active = status === 'active';

        return (
          <Card
            key={c.id}
            style={[styles.card, locked && styles.locked]}
            disabled={locked}
            onPress={locked ? undefined : () => navigation.navigate('CaseIntro', { caseId: c.id })}
          >
            <View style={styles.row}>
              <Tag label={formatCaseNumber(c.number)} variant={locked ? 'outline' : 'muted'} />
              {locked ? (
                <Icon name="lock" size={18} color={colors.mutedForeground} />
              ) : solved ? (
                <StarRating value={cp?.stars ?? 0} size={14} />
              ) : (
                <Tag
                  label={active ? 'In Progress' : 'New'}
                  variant={active ? 'outline' : 'default'}
                />
              )}
            </View>
            <Text variant="heading" muted={locked} style={{ marginTop: spacing.sm }}>
              {locked ? 'Classified' : c.title}
            </Text>
            <Text variant="caption" muted style={{ marginTop: spacing.xs }}>
              {locked ? 'Solve the previous case to unlock.' : c.subtitle}
            </Text>
            {!locked ? (
              <Tag label={c.difficulty} variant="outline" style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }} />
            ) : null}
          </Card>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  locked: { opacity: 0.55 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
