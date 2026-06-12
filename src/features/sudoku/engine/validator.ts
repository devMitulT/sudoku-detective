import { Grid, SIZE, BOX } from './solver';

export interface CellConflict {
  row: number;
  col: number;
}

/**
 * Returns the set of cells that currently conflict with a peer (same row,
 * column, or box sharing the same value). Empty cells (0) never conflict.
 * Keys are "row,col".
 */
export function findConflicts(grid: Grid): Set<string> {
  const conflicts = new Set<string>();

  const scan = (cells: [number, number][]) => {
    const seen = new Map<number, [number, number]>();
    const dupes = new Set<number>();
    for (const [r, c] of cells) {
      const v = grid[r][c];
      if (v === 0) continue;
      if (seen.has(v)) dupes.add(v);
      else seen.set(v, [r, c]);
    }
    if (dupes.size === 0) return;
    for (const [r, c] of cells) {
      if (dupes.has(grid[r][c])) conflicts.add(`${r},${c}`);
    }
  };

  for (let i = 0; i < SIZE; i++) {
    const row: [number, number][] = [];
    const col: [number, number][] = [];
    for (let j = 0; j < SIZE; j++) {
      row.push([i, j]);
      col.push([j, i]);
    }
    scan(row);
    scan(col);
  }

  for (let br = 0; br < SIZE; br += BOX) {
    for (let bc = 0; bc < SIZE; bc += BOX) {
      const box: [number, number][] = [];
      for (let r = 0; r < BOX; r++) {
        for (let c = 0; c < BOX; c++) box.push([br + r, bc + c]);
      }
      scan(box);
    }
  }

  return conflicts;
}

/** Is the grid completely filled with no conflicts? */
export function isComplete(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  return findConflicts(grid).size === 0;
}

/** Does the player's grid match the known solution at every filled cell? */
export function matchesSolution(grid: Grid, solution: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

/** Count of empty cells remaining. */
export function remainingCells(grid: Grid): number {
  let n = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) n++;
    }
  }
  return n;
}

/** How many of each digit (1-9) are still placeable (9 - placed count). */
export function remainingDigitCounts(grid: Grid): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let v = 1; v <= SIZE; v++) counts[v] = SIZE;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = grid[r][c];
      if (v !== 0) counts[v] -= 1;
    }
  }
  return counts;
}
