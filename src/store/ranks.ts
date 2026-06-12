import { DetectiveRank } from '@/models';

export const RANK_LADDER: DetectiveRank[] = [
  'Rookie',
  'Junior Detective',
  'Detective',
  'Senior Detective',
  'Inspector',
  'Chief Inspector',
];

export const rankForLevel = (level: number): DetectiveRank =>
  RANK_LADDER[Math.min(level, RANK_LADDER.length - 1)];

/** Star rating for a solved case, based on mistakes accrued. */
export function computeStars(totalMistakes: number): 1 | 2 | 3 {
  if (totalMistakes <= 3) return 3;
  if (totalMistakes <= 8) return 2;
  return 1;
}
