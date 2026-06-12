import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Avatar, Button, Card, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { getCaseById } from '@/data/cases';
import { spacing } from '@/theme';
import { useProgressStore } from '@/store';
import { haptics } from '@/utils/haptics';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

export function SuspectBoardScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'SuspectBoard'>();
  const def = getCaseById(params.caseId);
  const cp = useProgressStore((s) => s.player.cases[params.caseId]);
  const toggleSuspect = useProgressStore((s) => s.toggleSuspect);

  if (!def) return null;
  const eliminated = new Set(cp?.eliminatedSuspectIds ?? []);
  const remaining = def.suspects.filter((s) => !eliminated.has(s.id));

  return (
    <ScreenContainer scroll>
      <TopBar title="Suspect Board" subtitle={def.title} onBack={() => navigation.goBack()} />

      <Card style={styles.banner}>
        <Text variant="label" muted>Remaining Suspects</Text>
        <Text variant="title" style={{ marginTop: 4 }}>
          {remaining.length} of {def.suspects.length}
        </Text>
        <Text variant="caption" muted style={{ marginTop: spacing.xs }}>
          Evidence clears suspects automatically. Tap a card to cross one off (or restore) as you reason it out.
        </Text>
      </Card>

      {def.suspects.map((s, i) => {
        const isOut = eliminated.has(s.id);
        return (
          <Animated.View key={s.id} entering={FadeInDown.delay(60 * i).duration(380)} layout={LinearTransition.springify()}>
            <Card
              style={styles.card}
              onPress={() => {
                haptics.medium();
                toggleSuspect(def.id, s.id);
              }}
            >
              <View style={styles.row}>
                <Avatar initials={s.initials} dimmed={isOut} />
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text variant="subtitle" color={isOut ? undefined : undefined} muted={isOut} style={isOut ? styles.struck : undefined}>
                      {s.name}
                    </Text>
                    <Tag label={isOut ? 'Cleared' : 'Active'} variant={isOut ? 'outline' : 'muted'} />
                  </View>
                  <Text variant="caption" muted>
                    {s.role} · Age {s.age}
                  </Text>
                  <Text variant="caption" muted style={{ marginTop: 4 }}>
                    {s.relationship}
                  </Text>
                  <Text variant="caption" muted={isOut} style={{ marginTop: 2 }}>
                    Motive: {s.motive}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        );
      })}

      <Button
        label="Back to Investigation"
        variant="outline"
        fullWidth
        style={{ marginTop: spacing.md }}
        onPress={() => navigation.goBack()}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: { marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.lg },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  struck: { textDecorationLine: 'line-through' },
});
