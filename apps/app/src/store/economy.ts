/** Coin costs for detective shop purchases. */
export const COIN_PRICES = {
  skipNode: 150,
  extraHint: 50,
  retryPuzzle: 75,
} as const;

export type PurchaseKind = keyof typeof COIN_PRICES;

/** Bonus coins awarded on first case solve, by star rating. */
export const STAR_COIN_BONUS: Record<1 | 2 | 3, number> = {
  3: 50,
  2: 25,
  1: 0,
};

/** Base case reward scales with case number. */
export function caseSolveCoins(caseNumber: number): number {
  return 80 + caseNumber * 10;
}

export function canAfford(coins: number, kind: PurchaseKind): boolean {
  return coins >= COIN_PRICES[kind];
}
