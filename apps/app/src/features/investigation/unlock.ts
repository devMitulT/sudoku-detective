import { CASES, getCaseByNumber } from '@/data/cases';
import { Case, CaseProgress, PlayerProgress } from '@/models';

export function getCaseUnlockStatus(
  caseDef: Case,
  player: PlayerProgress,
): 'locked' | 'available' | 'active' | 'solved' | 'failed' {
  const cp = player.cases[caseDef.id];
  if (cp) return cp.status;
  if (caseDef.number === 1) return 'available';
  const prev = getCaseByNumber(caseDef.number - 1);
  if (!prev) return 'locked';
  const prevCp = player.cases[prev.id];
  return prevCp?.status === 'solved' ? 'available' : 'locked';
}

export function isCaseUnlocked(caseDef: Case, player: PlayerProgress): boolean {
  const status = getCaseUnlockStatus(caseDef, player);
  return status !== 'locked';
}

/** Sync lock/available flags for every case after a solve or on boot. */
export function syncCaseLocks(cases: Record<string, CaseProgress>): Record<string, CaseProgress> {
  const next = { ...cases };
  for (const def of CASES) {
    const existing = next[def.id];
    const unlocked =
      def.number === 1 ||
      next[getCaseByNumber(def.number - 1)?.id ?? '']?.status === 'solved';

    if (!existing) {
      if (unlocked) {
        next[def.id] = {
          caseId: def.id,
          status: 'available',
          nodes: {},
          revealedEvidenceIds: [],
          eliminatedSuspectIds: [],
          accusedSuspectId: null,
          notebook: [],
          totalTimeSec: 0,
          totalMistakes: 0,
          cluesFound: 0,
          cluesTotal: def.board.nodes.length,
          stars: 0,
          startedAt: null,
          solvedAt: null,
        };
      }
      continue;
    }

    if (existing.status === 'locked' && unlocked) {
      next[def.id] = { ...existing, status: 'available' };
    }
    if (existing.status === 'available' && !unlocked && def.number > 1) {
      next[def.id] = { ...existing, status: 'locked' };
    }
  }
  return next;
}

/** The next case the player should play (first unsolved unlocked case). */
export function getFeaturedCase(player: PlayerProgress): Case {
  for (const def of CASES) {
    const status = getCaseUnlockStatus(def, player);
    if (status === 'active' || status === 'available') return def;
    if (status !== 'solved') return def;
  }
  return CASES[CASES.length - 1];
}

export function solvedCaseCount(player: PlayerProgress): number {
  return CASES.filter((c) => player.cases[c.id]?.status === 'solved').length;
}
