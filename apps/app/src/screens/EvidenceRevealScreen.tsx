import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button, Card, Divider, Icon, IconName, ScreenContainer, Tag, Text } from '@/components';
import { getCaseById } from '@/data/cases';
import { radius, spacing, useTheme } from '@/theme';
import { useGameStore, useProgressStore } from '@/store';
import { haptics } from '@/utils/haptics';
import { audio } from '@/audio';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

export function EvidenceRevealScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'EvidenceReveal'>();
  const def = getCaseById(params.caseId);
  const node = def?.board.nodes.find((n) => n.id === params.nodeId);
  const evidence = def?.evidence.find((e) => e.id === node?.rewardEvidenceId);
  const cp = useProgressStore((s) => s.player.cases[params.caseId]);
  const clearSession = useGameStore((s) => s.clearSession);
  const { colors } = useTheme();

  const stamp = useSharedValue(0);
  useEffect(() => {
    stamp.value = withDelay(150, withSequence(withSpring(1.12, { damping: 8 }), withSpring(1)));
    audio.play('reveal');
    haptics.medium();
  }, [stamp]);

  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stamp.value }],
    opacity: withTiming(stamp.value > 0 ? 1 : 0),
  }));

  if (!def || !node || !evidence) return null;

  const eliminatedNames = def.suspects
    .filter((s) => evidence.implications.eliminates.includes(s.id))
    .map((s) => s.name);
  const remaining = def.suspects.filter((s) => !(cp?.eliminatedSuspectIds ?? []).includes(s.id));

  const onContinue = () => {
    clearSession();
    navigation.goBack();
  };

  return (
    <ScreenContainer
      gradient
      scroll
      footer={<Button label="Continue Investigation" onPress={onContinue} fullWidth size="lg" />}
    >
      <View style={styles.headerWrap}>
        <Animated.View
          style={[
            styles.stamp,
            stampStyle,
            { backgroundColor: colors.muted, borderColor: colors.primary },
          ]}
        >
          <Icon name={evidence.icon as IconName} size={44} color={colors.primary} strokeWidth={1.5} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(350).duration(500)}>
          <Text variant="label" center>
            {evidence.revealHeadline}
          </Text>
          <Text variant="title" center style={{ marginTop: spacing.xs }}>
            {evidence.title}
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(550).duration(500)}>
        <Card>
          <Text variant="body" style={styles.reveal}>
            {evidence.revealBody}
          </Text>

          {evidence.detailRows && evidence.detailRows.length > 0 ? (
            <>
              <Divider label="Findings" />
              {evidence.detailRows.map((r, i) => (
                <Animated.View
                  key={i}
                  entering={FadeInDown.delay(650 + i * 90).duration(350)}
                  style={[styles.detailRow, { borderColor: colors.border }]}
                >
                  <Text variant="body" muted>{r.label}</Text>
                  <Text variant="bodyStrong">{r.value}</Text>
                </Animated.View>
              ))}
            </>
          ) : null}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(800).duration(450)}>
        <Card style={{ marginTop: spacing.lg }}>
          <View style={styles.cardLabel}>
            <Icon name="notebook" size={15} color={colors.foreground} />
            <Text variant="label">Notebook Updated</Text>
          </View>
          {evidence.notebookEntries.map((e) => (
            <View key={e.id} style={styles.nbRow}>
              <Text variant="body" muted>{e.label}</Text>
              <Text variant="bodyStrong" style={styles.value}>{e.value}</Text>
            </View>
          ))}
        </Card>
      </Animated.View>

      {eliminatedNames.length > 0 ? (
        <Animated.View entering={FadeInDown.delay(950).duration(450)}>
          <Card style={{ marginTop: spacing.lg }}>
            <View style={styles.cardLabel}>
              <Icon name="wrong" size={15} color={colors.foreground} />
              <Text variant="label">Suspects Cleared</Text>
            </View>
            <View style={styles.tagRow}>
              {eliminatedNames.map((n) => (
                <Tag key={n} label={n} variant="outline" />
              ))}
            </View>
            <Text variant="caption" muted style={{ marginTop: spacing.sm }}>
              {remaining.length} suspect{remaining.length === 1 ? '' : 's'} remaining.
            </Text>
          </Card>
        </Animated.View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerWrap: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.xl },
  stamp: {
    width: 96,
    height: 96,
    borderRadius: radius.xxl,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  cardLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reveal: { lineHeight: 24 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  nbRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md, gap: spacing.lg },
  value: { flexShrink: 1, textAlign: 'right' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
});
