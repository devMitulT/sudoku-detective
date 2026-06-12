import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { AppModal, Button, IconText, ScreenContainer, Tag, Text, TopBar } from '@/components';
import { getCaseById } from '@/data/cases';
import {
  GameControls,
  NumberPad,
  SudokuGrid,
  SudokuHud,
} from '@/features/sudoku/components';
import { remainingDigitCounts } from '@/features/sudoku/engine';
import { difficultyLabel, modifierLabel } from '@/features/investigation/selectors';
import { spacing } from '@/theme';
import { COIN_PRICES, canAfford } from '@/store/economy';
import { useGameStore, useProgressStore } from '@/store';
import { haptics } from '@/utils/haptics';
import { audio } from '@/audio';
import { useAppNavigation, useScreenRoute } from '@/navigation/types';

export function SudokuScreen() {
  const navigation = useAppNavigation();
  const { params } = useScreenRoute<'Sudoku'>();
  const def = getCaseById(params.caseId);
  const node = def?.board.nodes.find((n) => n.id === params.nodeId);

  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - spacing.xl * 2, 380);

  const session = useGameStore((s) => s.session);
  const startNode = useGameStore((s) => s.startNode);
  const selectCell = useGameStore((s) => s.selectCell);
  const inputValue = useGameStore((s) => s.inputValue);
  const erase = useGameStore((s) => s.erase);
  const toggleNoteMode = useGameStore((s) => s.toggleNoteMode);
  const useHint = useGameStore((s) => s.useHint);
  const grantBonusHint = useGameStore((s) => s.grantBonusHint);
  const revealFog = useGameStore((s) => s.revealFog);
  const tick = useGameStore((s) => s.tick);
  const completeNode = useProgressStore((s) => s.completeNode);
  const purchaseExtraHint = useProgressStore((s) => s.purchaseExtraHint);
  const purchaseRetry = useProgressStore((s) => s.purchaseRetry);
  const coins = useProgressStore((s) => s.player.coins);

  const [showExit, setShowExit] = useState(false);
  const recorded = useRef(false);
  const prevMistakes = useRef(0);

  useEffect(() => {
    if (def && node) startNode(def.id, node);
    recorded.current = false;
    prevMistakes.current = 0;
  }, [def, node, startNode]);

  useEffect(() => {
    if (!session) return;
    if (session.mistakes > prevMistakes.current) {
      audio.play('error');
      haptics.error();
    }
    prevMistakes.current = session.mistakes;
  }, [session]);

  useEffect(() => {
    const id = setInterval(() => tick(1), 1000);
    return () => clearInterval(id);
  }, [tick]);

  useEffect(() => {
    if (!session || !def || !node) return;
    if (session.status === 'solved' && !recorded.current) {
      recorded.current = true;
      audio.play('success');
      haptics.success();
      completeNode(def.id, node.id, {
        mistakes: session.mistakes,
        hintsUsed: session.hintsUsed,
        timeSec: session.elapsedSec,
      });
      navigation.replace('EvidenceReveal', { caseId: def.id, nodeId: node.id });
    } else if (session.status === 'failed') {
      haptics.error();
    }
  }, [session, def, node, completeNode, navigation]);

  const remaining = useMemo(
    () => (session ? remainingDigitCounts(session.board) : {}),
    [session],
  );

  if (!def || !node || !session) {
    return (
      <ScreenContainer>
        <TopBar onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text muted>Preparing puzzle…</Text>
        </View>
      </ScreenContainer>
    );
  }

  const foggedRemaining = new Set(session.puzzle.foggedCells ?? []);
  session.revealedFog.forEach((k) => foggedRemaining.delete(k));

  const onSelect = (row: number, col: number) => {
    const k = `${row},${col}`;
    if (foggedRemaining.has(k)) {
      haptics.medium();
      revealFog(row, col);
    }
    selectCell(row, col);
  };

  const maxFree = node.puzzle.hintsAllowed ? (node.puzzle.maxHints ?? Infinity) : 0;
  const bonusHints = session.bonusHints ?? 0;
  const hintBudget = maxFree === Infinity ? Infinity : maxFree + bonusHints;
  const hintsRemaining =
    hintBudget === Infinity ? null : Math.max(0, hintBudget - session.hintsUsed);
  const canBuyHint = hintsRemaining === 0 && canAfford(coins, 'extraHint');

  const onHintPress = () => {
    if (hintsRemaining === null || hintsRemaining > 0) {
      useHint();
      return;
    }
    if (purchaseExtraHint()) {
      grantBonusHint();
      useHint();
    }
  };

  const onRetry = () => {
    if (!purchaseRetry()) return;
    recorded.current = false;
    startNode(def.id, node);
  };

  const failed = session.status === 'failed';
  const failReason =
    session.remainingSec === 0 ? "Time's up. The footage was wiped." : 'Too many mistakes. The trail went cold.';

  return (
    <ScreenContainer padded contentStyle={styles.content}>
      <TopBar
        title={node.title}
        subtitle={def.title}
        onBack={() => setShowExit(true)}
        right={<Tag label={difficultyLabel(node.puzzle.difficulty)} variant="muted" />}
      />

      <SudokuHud
        difficultyLabel={difficultyLabel(node.puzzle.difficulty)}
        mistakes={session.mistakes}
        maxMistakes={node.puzzle.maxMistakes}
        elapsedSec={session.elapsedSec}
        remainingSec={session.remainingSec}
      />

      {node.puzzle.modifiers.filter((m) => m !== 'classic').length > 0 ? (
        <View style={styles.modRow}>
          {node.puzzle.modifiers
            .filter((m) => m !== 'classic')
            .map((m) => (
              <Tag key={m} label={modifierLabel(m)} variant="outline" />
            ))}
        </View>
      ) : null}

      <View style={styles.gridWrap}>
        <SudokuGrid session={session} size={boardSize} onSelect={onSelect} />
      </View>

      <View style={styles.controls}>
        <GameControls
          onErase={erase}
          onToggleNotes={toggleNoteMode}
          onHint={onHintPress}
          noteMode={session.noteMode}
          hintsRemaining={hintsRemaining}
          hintsAllowed={node.puzzle.hintsAllowed || bonusHints > 0}
          canBuyHint={canBuyHint}
          buyHintPrice={COIN_PRICES.extraHint}
        />
      </View>

      <NumberPad
        onPress={inputValue}
        remaining={remaining}
        noteMode={session.noteMode}
        highlightedNumber={session.highlightedNumber}
      />

      <AppModal visible={failed || showExit} dismissOnBackdrop={!failed} onRequestClose={() => setShowExit(false)}>
        {failed ? (
          <>
            <Text variant="heading" center>
              Investigation Stalled
            </Text>
            <Text variant="body" muted center style={{ marginTop: spacing.md }}>
              {failReason}
            </Text>
            <Button
              label={`Retry · ${COIN_PRICES.retryPuzzle} coins`}
              fullWidth
              style={{ marginTop: spacing.xl }}
              disabled={!canAfford(coins, 'retryPuzzle')}
              onPress={onRetry}
            />
            <IconText
              name="coin"
              muted
              variant="caption"
              style={{ marginTop: spacing.sm, alignSelf: 'center' }}
            >
              Balance: {coins}
            </IconText>
            <Button
              label="Back to Board"
              variant="ghost"
              fullWidth
              style={{ marginTop: spacing.sm }}
              onPress={() => navigation.goBack()}
            />
          </>
        ) : (
          <>
            <Text variant="heading" center>
              Leave the puzzle?
            </Text>
            <Text variant="body" muted center style={{ marginTop: spacing.md }}>
              Your progress on this node is saved. You can resume any time.
            </Text>
            <Button
              label="Keep Solving"
              fullWidth
              style={{ marginTop: spacing.xl }}
              onPress={() => setShowExit(false)}
            />
            <Button
              label="Back to Board"
              variant="ghost"
              fullWidth
              style={{ marginTop: spacing.sm }}
              onPress={() => {
                setShowExit(false);
                navigation.goBack();
              }}
            />
          </>
        )}
      </AppModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center' },
  gridWrap: { alignItems: 'center', marginVertical: spacing.xs },
  controls: { marginVertical: spacing.xs },
});
