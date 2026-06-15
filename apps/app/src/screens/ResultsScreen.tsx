import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { Button, Card, Divider, Icon, IconText, ScreenContainer, StarRating, Text } from '@/components';
import { getCaseById, getCaseByNumber } from '@/data/cases';
import { getCaseUnlockStatus } from '@/features/investigation/unlock';
import { radius, spacing, useTheme } from '@/theme';
import { audio } from '@/audio';
import { currentRank, useProgressStore } from '@/store';
import { STAR_COIN_BONUS } from '@/store/economy';
import { formatCaseNumber, formatTime } from '@/utils/time';
import { haptics } from '@/utils/haptics';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="label" muted>{label}</Text>
      <Text variant="heading">{value}</Text>
    </View>
  );
}

function Sparkle({ angle, delay, distance }: { angle: number; delay: number; distance: number }) {
  const { colors } = useTheme();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration: 700 }));
  }, [t, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.1 ? 0 : (1 - t.value) * 1.2,
    transform: [
      { translateX: Math.cos(angle) * distance * t.value },
      { translateY: Math.sin(angle) * distance * t.value },
      { scale: 0.4 + t.value * 0.7 },
    ],
  }));
  return (
    <Animated.View style={[styles.sparkle, style]} pointerEvents="none">
      <Icon name="star" size={14} color={colors.primary} filled strokeWidth={1.5} />
    </Animated.View>
  );
}

export function ResultsScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'Results'>();
  const def = getCaseById(params.caseId);
  const cp = useProgressStore((s) => s.player.cases[params.caseId]);
  const player = useProgressStore((s) => s.player);
  const { colors } = useTheme();

  const solved = params.outcome === 'solved';
  const pop = useSharedValue(0);
  const ring = useSharedValue(0);

  useEffect(() => {
    pop.value = withDelay(150, withSequence(withSpring(1.15, { damping: 6 }), withSpring(1)));
    if (solved) {
      ring.value = withRepeat(
        withSequence(withTiming(1, { duration: 1400 }), withTiming(0, { duration: 0 })),
        -1,
      );
      audio.play('win');
      haptics.success();
    } else {
      audio.play('fail');
      haptics.error();
    }
  }, [pop, ring, solved]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: (1 - ring.value) * 0.4,
    transform: [{ scale: 0.85 + ring.value * 1.15 }],
  }));

  if (!def) return null;

  const toMenu = () => navigation.reset({ index: 0, routes: [{ name: 'MainMenu' }] });
  const coinsEarned = params.coinsEarned ?? 0;
  const stars = (cp?.stars ?? 1) as 1 | 2 | 3;
  const starBonus = coinsEarned > 0 ? STAR_COIN_BONUS[stars] : 0;
  const baseCoins = Math.max(0, coinsEarned - starBonus);
  const nextCase = getCaseByNumber(def.number + 1);
  const nextUnlocked = nextCase && getCaseUnlockStatus(nextCase, player) !== 'locked';

  if (!solved) {
    const accused = def.suspects.find((s) => s.id === cp?.accusedSuspectId);
    return (
      <ScreenContainer
        gradient
        scroll
        footer={
          <>
            <Button label="Return to Courtroom" fullWidth size="lg" onPress={() => navigation.replace('Courtroom', { caseId: def.id })} />
            <Button label="Back to Board" variant="ghost" fullWidth style={{ marginTop: spacing.sm }} onPress={() => navigation.reset({ index: 1, routes: [{ name: 'MainMenu' }, { name: 'InvestigationBoard', params: { caseId: def.id } }] })} />
          </>
        }
      >
        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.badge,
              popStyle,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <Icon name="wrong" size={56} color={colors.foreground} strokeWidth={1.5} />
          </Animated.View>
          <Text variant="title" center>
            WRONG ACCUSATION
          </Text>
          <Text variant="body" muted center style={{ marginTop: spacing.md }}>
            {accused ? `${accused.name} walked free.` : 'The accusation did not hold.'} The real culprit is still out there. Re-examine your evidence and try again.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const angles = [0, 0.9, 1.7, 2.5, 3.3, 4.1, 5.0, 5.7];

  return (
    <ScreenContainer
      gradient
      scroll
      footer={
        <>
          {nextUnlocked && nextCase ? (
            <Button
              label={`Next Case · #${formatCaseNumber(nextCase.number)}`}
              fullWidth
              size="lg"
              onPress={() => navigation.replace('CaseIntro', { caseId: nextCase.id })}
            />
          ) : (
            <Button label="Back to Main Menu" fullWidth size="lg" onPress={toMenu} />
          )}
          <Button label="Replay Case" variant="ghost" fullWidth style={{ marginTop: spacing.sm }} onPress={() => navigation.replace('InvestigationBoard', { caseId: def.id })} />
          <Button label="Main Menu" variant="ghost" fullWidth style={{ marginTop: spacing.sm }} onPress={toMenu} />
        </>
      }
    >
      <View style={styles.hero}>
        <View style={styles.trophyWrap}>
          <Animated.View
            style={[
              styles.ring,
              ringStyle,
              { borderColor: colors.primary },
            ]}
            pointerEvents="none"
          />
          {angles.map((a, i) => (
            <Sparkle key={i} angle={a} delay={400 + i * 70} distance={72} />
          ))}
          <Animated.View
            style={[
              styles.badge,
              popStyle,
              { backgroundColor: colors.muted, borderColor: colors.primary },
            ]}
          >
            <Icon name="trophy" size={56} color={colors.primary} strokeWidth={1.5} />
          </Animated.View>
        </View>

        <Text variant="label" center>
          Case Closed
        </Text>
        <Text variant="title" center style={{ marginTop: spacing.xs }}>
          {def.title}
        </Text>
        <Animated.View entering={ZoomIn.delay(500)} style={{ marginTop: spacing.lg }}>
          <StarRating value={cp?.stars ?? 3} size={40} glowing />
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(400).duration(500)}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <Stat label="Time" value={formatTime(cp?.totalTimeSec ?? 0)} />
            <Stat label="Mistakes" value={String(cp?.totalMistakes ?? 0)} />
            <Stat label="Clues" value={`${cp?.cluesFound ?? 0}/${cp?.cluesTotal ?? def.evidence.length}`} />
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(550).duration(450)}>
        <Card style={{ marginTop: spacing.lg }}>
          <Text variant="label">Evidence Summary</Text>
          {def.evidenceSummary.map((e) => (
            <View key={e} style={styles.summaryRow}>
              <Icon name="checkCircle" size={16} color={colors.primary} strokeWidth={1.75} />
              <Text variant="body">{e}</Text>
            </View>
          ))}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(700).duration(450)}>
        <Card style={{ marginTop: spacing.lg }}>
          <Text variant="label" muted>The Verdict</Text>
          <Text variant="body" muted style={{ marginTop: spacing.sm, lineHeight: 23 }}>
            {def.endingNarrative}
          </Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(850).duration(450)}>
        <Card style={{ marginTop: spacing.lg }}>
          <Text variant="label">Rewards</Text>
          <Divider />
          {coinsEarned > 0 ? (
            <>
              <View style={styles.rewardRow}>
                <Text variant="body" muted>Case reward</Text>
                <IconText name="coin" muted={false} variant="bodyStrong" size={15}>
                  +{baseCoins}
                </IconText>
              </View>
              {starBonus > 0 ? (
                <View style={styles.rewardRow}>
                  <Text variant="body" muted>Star bonus ({cp?.stars ?? 0}★)</Text>
                  <IconText name="coin" muted={false} variant="bodyStrong" size={15}>
                    +{starBonus}
                  </IconText>
                </View>
              ) : null}
              <View style={styles.rewardRow}>
                <Text variant="body" muted>Total earned</Text>
                <IconText name="coin" muted={false} variant="bodyStrong" size={15}>
                  +{coinsEarned}
                </IconText>
              </View>
            </>
          ) : (
            <View style={styles.rewardRow}>
              <Text variant="body" muted>Coins earned</Text>
              <Text variant="bodyStrong" muted>Replay — no bonus</Text>
            </View>
          )}
          <View style={styles.rewardRow}>
            <Text variant="body" muted>Detective rank</Text>
            <Text variant="bodyStrong">{currentRank(player)}</Text>
          </View>
          {coinsEarned > 0 ? (
            <View style={styles.rewardRow}>
              <Text variant="body" muted>Badge unlocked</Text>
              <IconText name="medal" muted={false} variant="bodyStrong" size={16}>
                Case #{formatCaseNumber(def.number)}
              </IconText>
            </View>
          ) : null}
        </Card>
      </Animated.View>
    </ScreenContainer>
  );
}

const BADGE = 112;

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: spacing.xl },
  trophyWrap: {
    width: BADGE + 64,
    height: BADGE + 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  ring: {
    position: 'absolute',
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 1.5,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: spacing.lg,
  },
  sparkle: { position: 'absolute' },
  statsCard: { marginTop: spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center', gap: 2 },
  summaryRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, alignItems: 'center' },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
});
