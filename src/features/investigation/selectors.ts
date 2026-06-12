import { Case, CaseProgress, InvestigationNode, NodeStatus, Suspect } from '@/models';

/** Derive a node's lock state from completed nodes (sequential unlock). */
export function getNodeStatus(
  node: InvestigationNode,
  progress?: CaseProgress,
): NodeStatus {
  if (progress?.nodes[node.id]?.status === 'completed') return 'completed';
  // Unlocked when every earlier-ordered node is completed.
  if (!progress) return node.order === 0 ? 'unlocked' : 'locked';
  const earlierComplete = Object.values(progress.nodes).filter(
    (n) => n.status === 'completed',
  ).length;
  return node.order <= earlierComplete ? 'unlocked' : 'locked';
}

export function completedNodeCount(progress?: CaseProgress): number {
  if (!progress) return 0;
  return Object.values(progress.nodes).filter((n) => n.status === 'completed').length;
}

export function allNodesComplete(def: Case, progress?: CaseProgress): boolean {
  return completedNodeCount(progress) >= def.board.nodes.length;
}

/** The next node the player can play, or null if all are complete. */
export function nextPlayableNode(
  def: Case,
  progress?: CaseProgress,
): InvestigationNode | null {
  const ordered = [...def.board.nodes].sort((a, b) => a.order - b.order);
  for (const node of ordered) {
    if (getNodeStatus(node, progress) !== 'completed') return node;
  }
  return null;
}

export function remainingSuspects(def: Case, progress?: CaseProgress): Suspect[] {
  const eliminated = new Set(progress?.eliminatedSuspectIds ?? []);
  return def.suspects.filter((s) => !eliminated.has(s.id));
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export const difficultyLabel = (d: string): string => DIFFICULTY_LABEL[d] ?? d;

const MODIFIER_LABEL: Record<string, string> = {
  classic: 'Classic',
  mistakeLimit: '3 Mistakes Max',
  foggedCells: 'Fogged Cells',
  timed: 'Timed',
  noHints: 'No Hints',
};

export const modifierLabel = (m: string): string => MODIFIER_LABEL[m] ?? m;
