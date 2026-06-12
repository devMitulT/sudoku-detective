import { InvestigationBoard } from './board';
import { Evidence } from './evidence';
import { Suspect } from './suspect';

export type CaseDifficultyLabel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

/** Rewards granted when a case is solved. */
export interface CaseRewards {
  coins: number;
  rankDelta: number;
  badgeId: string;
  unlocksCaseId?: string;
}

/** A complete, self-contained mystery. */
export interface Case {
  id: string;
  /** Display number, e.g. 1 -> "CASE #001". */
  number: number;
  title: string;
  subtitle: string;

  // --- Briefing ---
  victim: string;
  location: string;
  timeOfDeath: string;
  /** Long-form intro shown on the case intro screen. */
  synopsis: string;

  difficulty: CaseDifficultyLabel;
  estimatedMinutes: string; // e.g. "5–8"

  suspects: Suspect[];
  evidence: Evidence[];
  board: InvestigationBoard;

  /** The correct culprit's suspect id. */
  culpritId: string;

  /** Text shown after a correct accusation. */
  endingNarrative: string;
  /** Bullet summary of the evidence chain shown on success. */
  evidenceSummary: string[];

  rewards: CaseRewards;

  /** Is this case available without unlocking? (MVP: case #001 only). */
  isAvailable: boolean;
}
