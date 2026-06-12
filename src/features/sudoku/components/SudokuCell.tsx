import React, { memo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, Text } from '@/components';
import { useTheme } from '@/theme';

export interface SudokuCellProps {
  row: number;
  col: number;
  value: number;
  notes: number[];
  given: boolean;
  selected: boolean;
  inSameRow: boolean;
  inSameCol: boolean;
  sameNumber: boolean;
  highlightedNumber: number;
  conflict: boolean;
  error: boolean;
  fogged: boolean;
  size: number;
  cornerRadius?: ViewStyle;
  onPress: (row: number, col: number) => void;
}

function CellBase({
  row,
  col,
  value,
  notes,
  given,
  selected,
  inSameRow,
  inSameCol,
  sameNumber,
  highlightedNumber,
  conflict,
  error,
  fogged,
  size,
  cornerRadius,
  onPress,
}: SudokuCellProps) {
  const { colors } = useTheme();
  const borderRightWidth = col === 2 || col === 5 ? 2 : col === 8 ? 0 : StyleSheet.hairlineWidth;
  const borderBottomWidth = row === 2 || row === 5 ? 2 : row === 8 ? 0 : StyleSheet.hairlineWidth;

  const isSameNumberCell = sameNumber && value !== 0;
  const isRowColHighlight = (inSameRow || inSameCol) && !selected && !isSameNumberCell;

  let bg: string = colors.cellEmpty;
  if (given) bg = colors.cellGiven;
  if (inSameRow) bg = colors.cellSameRow;
  if (inSameCol) bg = colors.cellSameCol;
  if (sameNumber && value !== 0) bg = colors.cellSame;
  if (selected) bg = colors.cellSelected;
  if (error || conflict) bg = colors.cellError;
  if (fogged) bg = colors.cellFog;

  let textColor: string = colors.foreground;
  let textWeight: '500' | '600' | '700' = given ? '500' : '600';
  if (error || conflict) {
    textColor = colors.destructive;
  } else if (selected || isSameNumberCell) {
    textColor = colors.cellHighlightText;
    textWeight = '700';
  } else if (isRowColHighlight && value !== 0) {
    textColor = colors.cellRowColText;
    textWeight = given ? '600' : '600';
  } else if (given) {
    textColor = colors.mutedForeground;
  }

  return (
    <Pressable
      onPress={() => onPress(row, col)}
      style={({ pressed }) => [
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: bg,
          borderRightWidth,
          borderBottomWidth,
          borderColor: colors.borderStrong,
          zIndex: selected ? 5 : isSameNumberCell ? 2 : 1,
          transform: [{ scale: pressed && !selected ? 0.97 : 1 }],
        },
        cornerRadius,
      ]}
      accessibilityLabel={`Cell ${row + 1}, ${col + 1}${value ? `, value ${value}` : ', empty'}`}
    >
      {selected ? (
        <View
          pointerEvents="none"
          style={[styles.selectionRing, cornerRadius, { borderColor: colors.ring }]}
        />
      ) : null}
      {fogged ? (
        <Icon name="fog" size={size * 0.38} color={colors.mutedForeground} strokeWidth={1.5} />
      ) : value !== 0 ? (
        <Text style={{ fontSize: size * 0.48, fontWeight: textWeight }} color={textColor}>
          {value}
        </Text>
      ) : notes.length > 0 ? (
        <View style={styles.notesGrid}>
          {Array.from({ length: 9 }).map((_, i) => {
            const n = i + 1;
            const isHighlightedNote =
              highlightedNumber !== 0 && n === highlightedNumber && notes.includes(n);
            const noteColor = isHighlightedNote
              ? isRowColHighlight
                ? colors.cellRowColText
                : colors.cellHighlightText
              : colors.mutedForeground;
            return (
              <View key={i} style={[styles.noteCell, { width: size / 3, height: size / 3 }]}>
                <Text
                  style={{ fontSize: size * 0.17, fontWeight: isHighlightedNote ? '700' : '400' }}
                  color={noteColor}
                >
                  {notes.includes(n) ? n : ''}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  selectionRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    zIndex: 3,
  },
  notesGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: '100%' },
  noteCell: { alignItems: 'center', justifyContent: 'center' },
});

export const SudokuCell = memo(CellBase);
