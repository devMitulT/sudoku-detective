import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppModal, Avatar, Button, Card, Icon, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { getCaseById } from '@/data/cases';
import { radius, spacing, useTheme } from '@/theme';
import { useProgressStore } from '@/store';
import { haptics } from '@/utils/haptics';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

export function CourtroomScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'Courtroom'>();
  const def = getCaseById(params.caseId);
  const cp = useProgressStore((s) => s.player.cases[params.caseId]);
  const makeAccusation = useProgressStore((s) => s.makeAccusation);
  const { colors } = useTheme();

  const [selected, setSelected] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  if (!def) return null;
  const eliminated = new Set(cp?.eliminatedSuspectIds ?? []);
  const selectedSuspect = def.suspects.find((s) => s.id === selected);

  const onAccuse = () => {
    if (!selected) return;
    haptics.heavy();
    const result = makeAccusation(def.id, selected);
    setConfirm(false);
    navigation.replace('Results', {
      caseId: def.id,
      outcome: result?.correct ? 'solved' : 'failed',
      coinsEarned: result?.coinsEarned,
    });
  };

  return (
    <ScreenContainer
      gradient
      scroll
      footer={
        <Button
          label="Make Accusation"
          icon="gavel"
          disabled={!selected}
          fullWidth
          size="lg"
          onPress={() => setConfirm(true)}
        />
      }
    >
      <TopBar title="The Courtroom" onBack={() => navigation.goBack()} />

      <Animated.View entering={FadeInDown.duration(450)} style={styles.header}>
        <View style={[styles.gavel, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Icon name="scale" size={40} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Text variant="title" center>
          Who is guilty?
        </Text>
        <Text variant="caption" muted center style={{ marginTop: spacing.xs }}>
          Review your evidence and name the murderer of {def.victim}. Choose carefully — the court hears one accusation.
        </Text>
      </Animated.View>

      {def.suspects.map((s, i) => {
        const isOut = eliminated.has(s.id);
        const isSelected = selected === s.id;
        return (
          <Animated.View key={s.id} entering={FadeInDown.delay(60 * i).duration(360)}>
            <Pressable
              onPress={() => {
                haptics.selection();
                setSelected(s.id);
              }}
            >
              <Card style={styles.card} accent={isSelected ? colors.primary : undefined}>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.radio,
                      { borderColor: isSelected ? colors.primary : colors.border },
                      isSelected && { backgroundColor: colors.muted },
                    ]}
                  >
                    {isSelected ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
                  </View>
                  <Avatar initials={s.initials} dimmed={isOut} />
                  <View style={styles.info}>
                    <Text variant="subtitle" muted={isOut}>{s.name}</Text>
                    <Text variant="caption" muted>{s.role}</Text>
                  </View>
                  {isOut ? <Tag label="Cleared" variant="outline" /> : null}
                </View>
              </Card>
            </Pressable>
          </Animated.View>
        );
      })}

      <AppModal visible={confirm} onRequestClose={() => setConfirm(false)}>
        <Text variant="heading" center>
          Accuse {selectedSuspect?.name}?
        </Text>
        <Text variant="body" muted center style={{ marginTop: spacing.md }}>
          This is your final accusation for the case. There is no taking it back.
        </Text>
        <Button
          label={`Yes — accuse ${selectedSuspect?.name ?? ''}`}
          fullWidth
          style={{ marginTop: spacing.xl }}
          onPress={onAccuse}
        />
        <Button label="Reconsider" variant="ghost" fullWidth style={{ marginTop: spacing.sm }} onPress={() => setConfirm(false)} />
      </AppModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: spacing.lg },
  gavel: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
});
