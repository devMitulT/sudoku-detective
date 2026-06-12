/**
 * Sudoku puzzle domain models.
 *
 * A board is a 9x9 grid of cell values where `0` denotes an empty cell.
 * `Puzzle.givens` is the starting board the player sees; `Puzzle.solution`
 * is the unique completed board used for validation and hints.
 */

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Row-major 9x9 grid. grid[row][col]. */
export type SudokuGrid = CellValue[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Gameplay modifiers attached to a node's puzzle. These map directly to the
 * per-node twists described in the case design (fogged cells, timer, etc.).
 */
export type PuzzleModifier =
  | 'classic' // no modifier
  | 'mistakeLimit' // capped mistakes (value in PuzzleConfig.maxMistakes)
  | 'foggedCells' // some empty cells start obscured until tapped/revealed
  | 'timed' // countdown timer (value in PuzzleConfig.timeLimitSec)
  | 'noHints'; // hint button disabled

/** Static configuration for a single puzzle instance within a node. */
export interface PuzzleConfig {
  difficulty: Difficulty;
  modifiers: PuzzleModifier[];
  /** Max mistakes before failure. `undefined` = unlimited. */
  maxMistakes?: number;
  /** Countdown in seconds for `timed`. `undefined` = no limit. */
  timeLimitSec?: number;
  /** Whether the hint button is available. */
  hintsAllowed: boolean;
  /** Total hints the player may use when allowed. */
  maxHints?: number;
}

/** A fully generated, solvable puzzle. */
export interface Puzzle {
  id: string;
  config: PuzzleConfig;
  /** Starting grid shown to the player (0 = empty). */
  givens: SudokuGrid;
  /** The unique solved grid. */
  solution: SudokuGrid;
  /** Cells obscured for the `foggedCells` modifier, as "row,col" keys. */
  foggedCells?: string[];
}

/** Live, mutable state of a puzzle while the player solves it. */
export interface PuzzleSession {
  puzzle: Puzzle;
  /** Player's current grid (starts as a copy of givens). */
  board: SudokuGrid;
  /** Pencil-mark candidates per cell, keyed "row,col". */
  notes: Record<string, number[]>;
  selected: { row: number; col: number } | null;
  /** Digit currently highlighted across the board / number pad (1-9), or null. */
  highlightedNumber: number | null;
  /** Whether the player is placing pencil-marks rather than values. */
  noteMode: boolean;
  /** Fogged cells the player has already revealed ("row,col" keys). */
  revealedFog: string[];
  mistakes: number;
  hintsUsed: number;
  /** Extra hints bought with coins during this session. */
  bonusHints: number;
  elapsedSec: number;
  /** Remaining time for `timed`; null when not applicable. */
  remainingSec: number | null;
  status: 'idle' | 'playing' | 'paused' | 'solved' | 'failed';
  startedAt: number | null;
}
