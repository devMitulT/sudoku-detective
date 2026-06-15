import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { adjustColor } from '@/theme/depth';
import { createShadows, radius, useTheme } from '@/theme';
import { findConflicts } from '@/features/sudoku/engine';
import { PuzzleSession } from '@/models';
import { SudokuCell } from './SudokuCell';

export interface SudokuGridProps {
  session: PuzzleSession;
  size: number;
  onSelect: (row: number, col: number) => void;
}

export const BOARD_OUTER_RADIUS = radius.lg;
const BOARD_INNER_RADIUS = BOARD_OUTER_RADIUS - 2;
const TRAY_INSET = 5;

export function SudokuGrid({ session, size, onSelect }: SudokuGridProps) {
  const { colors } = useTheme();
  const shadows = useMemo(() => createShadows(colors), [colors]);
  const cell = Math.floor(size / 9);
  const boardSize = cell * 9;
  const outerSize = boardSize + TRAY_INSET * 2;

  const conflicts = useMemo(() => findConflicts(session.board), [session.board]);
  const selected = session.selected;
  const activeNumber = session.highlightedNumber ?? 0;

  const foggedSet = useMemo(() => {
    const all = new Set(session.puzzle.foggedCells ?? []);
    session.revealedFog.forEach((k) => all.delete(k));
    return all;
  }, [session.puzzle.foggedCells, session.revealedFog]);

  return (
    <View
      style={[
        styles.outer,
        {
          width: outerSize,
          height: outerSize,
          borderRadius: BOARD_OUTER_RADIUS + 2,
          backgroundColor: colors.grid,
          borderColor: colors.borderStrong,
        },
        shadows.lg,
      ]}
    >
        <View
          style={[
            styles.tray,
            {
              width: boardSize,
              height: boardSize,
              margin: TRAY_INSET,
              borderRadius: BOARD_INNER_RADIUS,
              backgroundColor: adjustColor(colors.grid, -10),
              borderColor: adjustColor(colors.borderStrong, -15),
            },
          ]}
        >
          {session.board.map((rowVals, r) => (
            <View key={r} style={styles.row}>
              {rowVals.map((value, c) => {
                const key = `${r},${c}`;
                const given = session.puzzle.givens[r][c] !== 0;
                const isSelected = !!selected && selected.row === r && selected.col === c;
                const inSameRow = !!selected && !isSelected && selected.row === r;
                const inSameCol = !!selected && !isSelected && selected.col === c;
                const sameNumber = activeNumber !== 0 && value === activeNumber;
                const error = !given && value !== 0 && value !== session.puzzle.solution[r][c];

                return (
                  <SudokuCell
                    key={key}
                    row={r}
                    col={c}
                    value={value}
                    notes={session.notes[key] ?? []}
                    given={given}
                    selected={isSelected}
                    inSameRow={inSameRow}
                    inSameCol={inSameCol}
                    sameNumber={sameNumber}
                    highlightedNumber={activeNumber}
                    conflict={conflicts.has(key)}
                    error={error}
                    fogged={foggedSet.has(key)}
                    size={cell}
                    cornerRadius={cornerRadius(r, c)}
                    onPress={onSelect}
                  />
                );
              })}
            </View>
          ))}
        </View>
    </View>
  );
}

function cornerRadius(row: number, col: number) {
  const r = BOARD_INNER_RADIUS - 1;
  if (row === 0 && col === 0) return { borderTopLeftRadius: r };
  if (row === 0 && col === 8) return { borderTopRightRadius: r };
  if (row === 8 && col === 0) return { borderBottomLeftRadius: r };
  if (row === 8 && col === 8) return { borderBottomRightRadius: r };
  return undefined;
}

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
    marginBottom: 6,
    borderWidth: 2,
    overflow: 'hidden',
  },
  tray: {
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  row: { flexDirection: 'row' },
});
