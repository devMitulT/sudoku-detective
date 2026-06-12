import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppModal, Button, Card, Icon, IconName, IconText, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { getCaseById } from '@/data/cases';
import { radius, spacing, useTheme } from '@/theme';
import { COIN_PRICES, canAfford } from '@/store/economy';
import { useProgressStore } from '@/store';
import {
  allNodesComplete,
  completedNodeCount,
  difficultyLabel,
  getNodeStatus,
  modifierLabel,
} from '@/features/investigation/selectors';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

export function InvestigationBoardScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'InvestigationBoard'>();
  const def = getCaseById(params.caseId);
  const cp = useProgressStore((s) => s.player.cases[params.caseId]);
  const coins = useProgressStore((s) => s.player.coins);
  const skipNode = useProgressStore((s) => s.skipNode);
  const { colors } = useTheme();
  const [skipTarget, setSkipTarget] = useState<{ id: string; title: string } | null>(null);

  if (!def) return null;

  const done = completedNodeCount(cp);
  const total = def.board.nodes.length;
  const ready = allNodesComplete(def, cp);

  return (
    <ScreenContainer
      scroll
      footer={
        <Button
          label={ready ? 'Proceed to Courtroom' : `Investigate · ${done}/${total} solved`}
          variant={ready ? 'primary' : 'primary'}
          disabled={!ready}
          icon={ready ? 'scale' : undefined}
          onPress={() => navigation.navigate('Courtroom', { caseId: def.id })}
          fullWidth
          size="lg"
        />
      }
    >
      <TopBar title="Investigation Board" subtitle={def.title} onBack={() => navigation.goBack()} />

      <Card style={styles.summary}>
        <View style={styles.summaryRow}>
          <View>
            <Text variant="label" muted>Evidence Recovered</Text>
            <Text variant="heading">{cp?.cluesFound ?? 0}/{total}</Text>
          </View>
          <View style={styles.links}>
            <Button iconOnly label="Notebook" icon="notebook" size="sm" variant="outline" onPress={() => navigation.navigate('Notebook', { caseId: def.id })} />
            <Button iconOnly label="Suspects" icon="people" size="sm" variant="outline" onPress={() => navigation.navigate('SuspectBoard', { caseId: def.id })} />
          </View>
        </View>
        <View style={[styles.track, { backgroundColor: colors.muted }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${(done / total) * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
      </Card>

      {def.board.nodes
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((node, i) => {
          const status = getNodeStatus(node, cp);
          const locked = status === 'locked';
          const completed = status === 'completed';
          return (
            <Animated.View key={node.id} entering={FadeInDown.delay(60 * i).duration(380)}>
              <Card
                style={styles.node}
                accent={completed ? colors.primary : undefined}
                disabled={locked}
                onPress={locked ? undefined : () => navigation.navigate('Sudoku', { caseId: def.id, nodeId: node.id })}
              >
                <View style={styles.nodeRow}>
                  <View
                    style={[
                      styles.nodeIcon,
                      {
                        backgroundColor: colors.muted,
                        borderColor: completed ? colors.primary : colors.border,
                      },
                      locked && styles.nodeIconLocked,
                    ]}
                  >
                    <Icon
                      name={locked ? 'lock' : completed ? 'check' : (node.icon as IconName)}
                      size={22}
                      color={locked ? colors.mutedForeground : colors.primary}
                      strokeWidth={1.75}
                    />
                  </View>
                  <View style={styles.nodeBody}>
                    <View style={styles.nodeHead}>
                      <Text variant="subtitle" color={locked ? colors.mutedForeground : colors.foreground}>
                        {node.title}
                      </Text>
                      <Text variant="label" muted>
                        Node {node.order + 1}
                      </Text>
                    </View>
                    <Text variant="caption" muted numberOfLines={2}>
                      {node.tagline}
                    </Text>
                    {!locked ? (
                      <View style={styles.tagRow}>
                        <Tag label={difficultyLabel(node.puzzle.difficulty)} variant="muted" />
                        {node.puzzle.modifiers
                          .filter((m) => m !== 'classic')
                          .map((m) => (
                            <Tag key={m} label={modifierLabel(m)} variant="outline" />
                          ))}
                        {completed ? <Tag label="Solved" variant="default" /> : null}
                      </View>
                    ) : null}
                    {!locked && !completed ? (
                      <Button
                        label={`Skip · ${COIN_PRICES.skipNode}`}
                        variant="ghost"
                        size="sm"
                        icon="coin"
                        disabled={!canAfford(coins, 'skipNode')}
                        onPress={() => setSkipTarget({ id: node.id, title: node.title })}
                        style={styles.skipBtn}
                      />
                    ) : null}
                  </View>
                </View>
              </Card>
            </Animated.View>
          );
        })}

      <AppModal visible={!!skipTarget} onRequestClose={() => setSkipTarget(null)}>
        <Text variant="heading" center>
          Skip this node?
        </Text>
        <Text variant="body" muted center style={{ marginTop: spacing.md }}>
          Pay {COIN_PRICES.skipNode} coins to complete "{skipTarget?.title}" instantly and collect its evidence.
        </Text>
        <IconText
          name="coin"
          muted={false}
          variant="bodyStrong"
          style={{ marginTop: spacing.md, alignSelf: 'center' }}
        >
          Balance: {coins}
        </IconText>
        <Button
          label={`Skip for ${COIN_PRICES.skipNode} coins`}
          fullWidth
          style={{ marginTop: spacing.xl }}
          disabled={!canAfford(coins, 'skipNode')}
          onPress={() => {
            if (!skipTarget) return;
            const nodeId = skipTarget.id;
            if (skipNode(def.id, nodeId)) {
              setSkipTarget(null);
              navigation.navigate('EvidenceReveal', { caseId: def.id, nodeId });
            }
          }}
        />
        <Button
          label="Cancel"
          variant="ghost"
          fullWidth
          style={{ marginTop: spacing.sm }}
          onPress={() => setSkipTarget(null)}
        />
      </AppModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  links: { flexDirection: 'row', gap: spacing.sm },
  track: { height: 4, borderRadius: 2, marginTop: spacing.lg, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  node: { marginBottom: spacing.md },
  nodeRow: { flexDirection: 'row', gap: spacing.lg },
  nodeIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIconLocked: { opacity: 0.5 },
  nodeBody: { flex: 1, gap: 4 },
  nodeHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  skipBtn: { alignSelf: 'flex-start', marginTop: spacing.xs },
});
