import { PuzzleConfig } from './puzzle';

/**
 * The Investigation Board: an ordered list of nodes the player unlocks
 * sequentially. Each node hosts a Sudoku puzzle and rewards a piece of
 * evidence on completion.
 */

export type NodeKind = 'crimeScene' | 'witness' | 'forensics' | 'cctv' | 'analysis';

export type NodeStatus = 'locked' | 'unlocked' | 'completed';

export interface InvestigationNode {
  id: string;
  kind: NodeKind;
  /** Sequential order (0-based). */
  order: number;
  /** Display title, e.g. "Crime Scene". */
  title: string;
  /** Short tagline shown on the node card. */
  tagline: string;
  /** Glyph/emoji icon for the MVP. */
  icon: string;
  /** Puzzle configuration for this node. */
  puzzle: PuzzleConfig;
  /** Evidence id awarded when this node's puzzle is solved. */
  rewardEvidenceId: string;
}

export interface InvestigationBoard {
  caseId: string;
  nodes: InvestigationNode[];
}
