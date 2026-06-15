import { NodeStatus } from './board';
import { NotebookEntry } from './notebook';

/** Outcome state for a case. */
export type CaseStatus = 'locked' | 'available' | 'active' | 'solved' | 'failed';

/** Per-node progress within an active/solved case. */
export interface NodeProgress {
  nodeId: string;
  status: NodeStatus;
  mistakes: number;
  hintsUsed: number;
  timeSec: number;
  completedAt: number | null;
  /** Completed via coin purchase without playing the puzzle. */
  skipped?: boolean;
}

/** All progress for a single case. */
export interface CaseProgress {
  caseId: string;
  status: CaseStatus;
  nodes: Record<string, NodeProgress>;
  /** Evidence ids revealed so far. */
  revealedEvidenceIds: string[];
  /** Suspect ids the player has eliminated. */
  eliminatedSuspectIds: string[];
  /** The accusation the player committed to (null until courtroom). */
  accusedSuspectId: string | null;
  /** Accumulated notebook for this case. */
  notebook: NotebookEntry[];
  totalTimeSec: number;
  totalMistakes: number;
  cluesFound: number;
  cluesTotal: number;
  stars: 0 | 1 | 2 | 3;
  startedAt: number | null;
  solvedAt: number | null;
}

export type AppearanceSetting = 'dark' | 'light' | 'system';

export interface PlayerSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  highlightPeers: boolean;
  autoRemoveNotes: boolean;
  appearance: AppearanceSetting;
}

export type DetectiveRank =
  | 'Rookie'
  | 'Junior Detective'
  | 'Detective'
  | 'Senior Detective'
  | 'Inspector'
  | 'Chief Inspector';

/** Top-level persisted player profile. */
export interface PlayerProgress {
  version: number;
  coins: number;
  rankLevel: number; // index into rank ladder
  badges: string[];
  /** Per-case progress keyed by case id. */
  cases: Record<string, CaseProgress>;
  settings: PlayerSettings;
  lastPlayedCaseId: string | null;
  createdAt: number | null;
}
