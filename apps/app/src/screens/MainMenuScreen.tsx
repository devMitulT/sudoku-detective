import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button, Card, Icon, IconText, ScreenContainer, StarRating, Tag, Text } from '@/components';
import { CASES } from '@/data/cases';
import { getFeaturedCase, getCaseUnlockStatus, solvedCaseCount } from '@/features/investigation/unlock';
import { radius, spacing, useTheme } from '@/theme';
import { currentRank, useProgressStore } from '@/store';
import { audio } from '@/audio';
import { formatCaseNumber } from '@/utils/time';
import { useAppNavigation } from '@/navigation/types';

export function MainMenuScreen() {
  const navigation = useAppNavigation();
  const player = useProgressStore((s) => s.player);
  const { colors } = useTheme();

  useEffect(() => {
    audio.startBgm();
  }, []);

  const featured = getFeaturedCase(player);
  const featuredProgress = player.cases[featured.id];
  const featuredStatus = getCaseUnlockStatus(featured, player);
  const inProgress = featuredStatus === 'active';
  const solved = featuredStatus === 'solved';
  const lockedCount = CASES.length - solvedCaseCount(player);

  return (
    <ScreenContainer gradient scroll>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
        <View style={[styles.logoBadge, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Icon name="brand" size={36} color={colors.primary} strokeWidth={1.5} />
        </View>
        <Text variant="title" center style={{ letterSpacing: 2 }}>
          SUDOKU{' '}
          <Text variant="title" color={colors.primary}>
            DETECTIVE
          </Text>
        </Text>
        <Text variant="label" muted center style={{ marginTop: spacing.xs }}>
          Case Files · {solvedCaseCount(player)}/{CASES.length} solved
        </Text>
      </Animated.View>

      <View
        style={[
          styles.profileRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.profileItem}>
          <Text variant="label" muted>Rank</Text>
          <Text variant="bodyStrong">{currentRank(player)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.profileItem}>
          <Text variant="label" muted>Coins</Text>
          <IconText name="coin" muted={false} variant="bodyStrong" size={15}>
            {player.coins}
          </IconText>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.profileItem}>
          <Text variant="label" muted>Badges</Text>
          <Text variant="bodyStrong">{player.badges.length}</Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(120).duration(500)}>
        <Card onPress={() => navigation.navigate('CaseIntro', { caseId: featured.id })}>
          <View style={styles.caseTop}>
            <Tag label={`Case ${formatCaseNumber(featured.number)}`} variant="muted" />
            {solved ? (
              <StarRating value={featuredProgress?.stars ?? 0} size={14} />
            ) : (
              <Tag
                label={inProgress ? 'In Progress' : 'New'}
                variant={inProgress ? 'outline' : 'default'}
              />
            )}
          </View>
          <Text variant="heading" style={{ marginTop: spacing.md }}>
            {featured.title}
          </Text>
          <Text variant="caption" muted style={{ marginTop: spacing.xs }}>
            {featured.subtitle}
          </Text>
          <View style={styles.metaRow}>
            <IconText name="people">{featured.suspects.length} suspects</IconText>
            <IconText name="clue">{featured.evidence.length} clues</IconText>
            <IconText name="clock">{featured.estimatedMinutes} min</IconText>
          </View>
          <Button
            label={solved ? 'Replay Case' : inProgress ? 'Continue Investigation' : 'Open Case File'}
            onPress={() => navigation.navigate('CaseIntro', { caseId: featured.id })}
            fullWidth
            style={{ marginTop: spacing.lg }}
          />
        </Card>
      </Animated.View>

      <View style={styles.actionRow}>
        <Button
          label="All Cases"
          variant="outline"
          icon="document"
          onPress={() => navigation.navigate('CaseSelect')}
          style={styles.halfBtn}
        />
        <Button
          label="Shop"
          variant="outline"
          icon="coin"
          onPress={() => navigation.navigate('Shop')}
          style={styles.halfBtn}
        />
      </View>

      {lockedCount > 0 ? (
        <Card style={{ marginTop: spacing.md }} onPress={() => navigation.navigate('CaseSelect')}>
          <View style={styles.lockedRow}>
            <View>
              <Text variant="subtitle">Locked Cases</Text>
              <Text variant="caption" muted>
                {lockedCount} more {lockedCount === 1 ? 'mystery' : 'mysteries'} to unlock
              </Text>
            </View>
            <IconText name="lock" size={18} variant="subtitle" muted={false}>
              {String(lockedCount)}
            </IconText>
          </View>
        </Card>
      ) : null}

      <Button
        label="Settings"
        variant="outline"
        icon="settings"
        onPress={() => navigation.navigate('Settings')}
        style={{ marginTop: spacing.lg }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xxl },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  profileItem: { flex: 1, alignItems: 'center', gap: 2 },
  divider: { width: 1, height: 32 },
  caseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  halfBtn: { flex: 1 },
  lockedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
