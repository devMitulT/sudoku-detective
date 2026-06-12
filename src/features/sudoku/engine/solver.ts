import { Rng, shuffle } from './rng';

/** Internal mutable grid type for the engine (0 = empty). */
export type Grid = number[][];

export const SIZE = 9;
export const BOX = 3;

export const cloneGrid = (g: Grid): Grid => g.map((row) => row.slice());

export const emptyGrid = (): Grid =>
  Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0));

/** Can `val` be placed at (row,col) without breaking Sudoku constraints? */
export function isPlacementValid(grid: Grid, row: number, col: number, val: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (grid[row][i] === val) return false;
    if (grid[i][col] === val) return false;
  }
  const br = Math.floor(row / BOX) * BOX;
  const bc = Math.floor(col / BOX) * BOX;
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      if (grid[br + r][bc + c] === val) return false;
    }
  }
  return true;
}

/** Find the first empty cell, or null if the grid is full. */
function findEmpty(grid: Grid): [number, number] | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return [r, c];
    }
  }
  return null;
}

/**
 * Fill an empty grid with a complete, valid solution using randomized
 * backtracking. Returns true on success (mutates `grid`).
 */
export function fillSolution(grid: Grid, rng: Rng): boolean {
  const spot = findEmpty(grid);
  if (!spot) return true;
  const [row, col] = spot;
  const candidates = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
  for (const val of candidates) {
    if (isPlacementValid(grid, row, col, val)) {
      grid[row][col] = val;
      if (fillSolution(grid, rng)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
}

/**
 * Count solutions up to `limit` (default 2). Used to verify uniqueness when
 * digging holes — we only ever need to know whether the count is 0, 1, or ≥2.
 */
export function countSolutions(grid: Grid, limit = 2): number {
  const work = cloneGrid(grid);
  let count = 0;

  const recurse = (): boolean => {
    const spot = findEmpty(work);
    if (!spot) {
      count++;
      return count >= limit; // signal early stop
    }
    const [row, col] = spot;
    for (let val = 1; val <= SIZE; val++) {
      if (isPlacementValid(work, row, col, val)) {
        work[row][col] = val;
        if (recurse()) {
          work[row][col] = 0;
          return true;
        }
        work[row][col] = 0;
      }
    }
    return false;
  };

  recurse();
  return count;
}

export const hasUniqueSolution = (grid: Grid): boolean => countSolutions(grid, 2) === 1;

/** Solve a puzzle deterministically (first solution). Returns null if unsolvable. */
export function solve(grid: Grid): Grid | null {
  const work = cloneGrid(grid);
  const recurse = (): boolean => {
    const spot = findEmpty(work);
    if (!spot) return true;
    const [row, col] = spot;
    for (let val = 1; val <= SIZE; val++) {
      if (isPlacementValid(work, row, col, val)) {
        work[row][col] = val;
        if (recurse()) return true;
        work[row][col] = 0;
      }
    }
    return false;
  };
  return recurse() ? work : null;
}
