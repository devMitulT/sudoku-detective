import { Difficulty, Puzzle, PuzzleConfig, SudokuGrid } from '@/models';
import { createRng, randomSeed, Rng, shuffle } from './rng';
import {
  cloneGrid,
  countSolutions,
  emptyGrid,
  fillSolution,
  Grid,
  SIZE,
} from './solver';

/** Target number of starting clues (givens) per difficulty. */
const TARGET_GIVENS: Record<Difficulty, number> = {
  easy: 42,
  medium: 34,
  hard: 28,
};

/** Fraction of empty cells obscured for the `foggedCells` modifier. */
const FOG_RATIO = 0.35;

/**
 * Remove clues from a complete solution until ~`targetGivens` remain, keeping a
 * unique solution at every step. Removal order is randomized via `rng`.
 */
function digHoles(solution: Grid, targetGivens: number, rng: Rng): Grid {
  const puzzle = cloneGrid(solution);
  const positions = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, i) => i),
    rng,
  );
  let givens = SIZE * SIZE;

  for (const pos of positions) {
    if (givens <= targetGivens) break;
    const r = Math.floor(pos / SIZE);
    const c = pos % SIZE;
    if (puzzle[r][c] === 0) continue;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    // Keep the hole only if the puzzle still has exactly one solution.
    if (countSolutions(puzzle, 2) !== 1) {
      puzzle[r][c] = backup;
    } else {
      givens--;
    }
  }
  return puzzle;
}

function pickFoggedCells(puzzle: Grid, rng: Rng): string[] {
  const empties: string[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (puzzle[r][c] === 0) empties.push(`${r},${c}`);
    }
  }
  shuffle(empties, rng);
  const n = Math.floor(empties.length * FOG_RATIO);
  return empties.slice(0, n);
}

export interface GenerateOptions {
  seed?: number;
  id?: string;
}

/**
 * Generate a complete, uniquely-solvable puzzle for the given configuration.
 * Generation is offline and synchronous; a seeded RNG keeps it reproducible.
 */
export function generatePuzzle(config: PuzzleConfig, options: GenerateOptions = {}): Puzzle {
  const seed = options.seed ?? randomSeed();
  const rng = createRng(seed);

  const solution = emptyGrid();
  fillSolution(solution, rng);

  const givens = digHoles(solution, TARGET_GIVENS[config.difficulty], rng);

  const puzzle: Puzzle = {
    id: options.id ?? `puzzle-${seed}`,
    config,
    givens: cloneGrid(givens) as SudokuGrid,
    solution: cloneGrid(solution) as SudokuGrid,
  };

  if (config.modifiers.includes('foggedCells')) {
    puzzle.foggedCells = pickFoggedCells(givens, rng);
  }

  return puzzle;
}
