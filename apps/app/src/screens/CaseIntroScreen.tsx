import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Avatar, Button, Card, Divider, Icon, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { getCaseById } from '@/data/cases';
import { getCaseUnlockStatus } from '@/features/investigation/unlock';
import { spacing, useTheme } from '@/theme';
import { useProgressStore } from '@/store';
import { formatCaseNumber } from '@/utils/time';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text variant="label" muted>{label}</Text>
      <Text variant="bodyStrong">{value}</Text>
    </View>
  );
}

export function CaseIntroScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'CaseIntro'>();
  const def = getCaseById(params.caseId);
  const startCase = useProgressStore((s) => s.startCase);
  const player = useProgressStore((s) => s.player);
  const cp = player.cases[params.caseId];
  const { colors } = useTheme();

  if (!def) return null;
  const status = getCaseUnlockStatus(def, player);
  const locked = status === 'locked';
  const started = cp && cp.status !== 'available' && cp.status !== 'locked';

  const onStart = () => {
    if (locked || !startCase(def.id)) return;
    navigation.navigate('InvestigationBoard', { caseId: def.id });
  };

  return (
    <ScreenContainer
      gradient
      scroll
      footer={
        locked ? (
          <Button label="Case Locked" disabled fullWidth size="lg" icon="lock" />
        ) : (
          <Button
            label={started ? 'Resume Investigation' : 'Start Investigation'}
            onPress={onStart}
            fullWidth
            size="lg"
          />
        )
      }
    >
      <TopBar title={`Case ${formatCaseNumber(def.number)}`} onBack={() => navigation.goBack()} />

      {locked ? (
        <Card style={{ marginTop: spacing.md }} padded>
          <View style={styles.lockedRow}>
            <Icon name="lock" size={20} color={colors.mutedForeground} />
            <Text variant="body" muted>
              Solve Case {formatCaseNumber(def.number - 1)} to unlock this file.
            </Text>
          </View>
        </Card>
      ) : null}

      <Animated.View entering={FadeInDown.duration(450)}>
        <Tag label={def.difficulty} variant="muted" style={{ marginTop: spacing.sm }} />
        <Text variant="title" style={{ marginTop: spacing.md }}>
          {def.title}
        </Text>
      </Animated.View>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.factGrid}>
          <Fact label="Victim" value={def.victim} />
          <Fact label="Time" value={def.timeOfDeath} />
          <Fact label="Location" value={def.location} />
          <Fact label="Suspects" value={String(def.suspects.length)} />
        </View>
        <Divider />
        <Text variant="body" muted>
          {def.synopsis}
        </Text>
      </Card>

      <Text variant="label" muted style={styles.section}>
        Persons of Interest
      </Text>
      {def.suspects.map((s, i) => (
        <Animated.View key={s.id} entering={FadeInDown.delay(80 * i).duration(400)}>
          <Card style={styles.suspectCard} padded>
            <View style={styles.suspectRow}>
              <Avatar initials={s.initials} />
              <View style={styles.suspectInfo}>
                <Text variant="subtitle">{s.name}</Text>
                <Text variant="caption" muted>
                  {s.role} · {s.age}
                </Text>
                <Text variant="caption" muted style={{ marginTop: 2 }}>
                  Motive: {s.motive}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  factGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  fact: { width: '50%', marginBottom: spacing.md, gap: 2 },
  section: { marginTop: spacing.xl, marginBottom: spacing.sm },
  suspectCard: { marginBottom: spacing.md },
  suspectRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  suspectInfo: { flex: 1 },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
