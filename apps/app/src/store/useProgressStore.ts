import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getCaseById } from '@/data/cases';
import { isCaseUnlocked, syncCaseLocks } from '@/features/investigation/unlock';
import {
  CaseProgress,
  NodeProgress,
  NotebookEntry,
  PlayerProgress,
  PlayerSettings,
} from '@/models';
import {
  canAfford,
  COIN_PRICES,
  STAR_COIN_BONUS,
} from './economy';
import { computeStars, rankForLevel, RANK_LADDER } from './ranks';
import { persistStorage, STORAGE_KEYS } from './storage';

const PROGRESS_VERSION = 2;

const defaultSettings: PlayerSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  highlightPeers: true,
  autoRemoveNotes: true,
  appearance: 'dark',
};

const createInitialProgress = (): PlayerProgress => ({
  version: PROGRESS_VERSION,
  coins: 0,
  rankLevel: 0,
  badges: [],
  cases: {},
  settings: defaultSettings,
  lastPlayedCaseId: null,
  createdAt: null,
});

export interface NodeResult {
  mistakes: number;
  hintsUsed: number;
  timeSec: number;
}

export interface AccusationResult {
  correct: boolean;
  culpritId: string;
  stars: 1 | 2 | 3;
  coinsEarned: number;
}

interface ProgressState {
  player: PlayerProgress;
  hydrated: boolean;

  getCaseProgress: (caseId: string) => CaseProgress | undefined;
  isUnlocked: (caseId: string) => boolean;

  startCase: (caseId: string) => boolean;
  completeNode: (caseId: string, nodeId: string, result: NodeResult, skipped?: boolean) => void;
  skipNode: (caseId: string, nodeId: string) => boolean;
  spendCoins: (amount: number) => boolean;
  purchaseExtraHint: () => boolean;
  purchaseRetry: () => boolean;
  toggleSuspect: (caseId: string, suspectId: string) => void;
  makeAccusation: (caseId: string, suspectId: string) => AccusationResult | null;
  resetCase: (caseId: string) => void;
  updateSettings: (patch: Partial<PlayerSettings>) => void;

  _setHydrated: () => void;
}

const freshCaseProgress = (caseId: string, cluesTotal: number): CaseProgress => ({
  caseId,
  status: 'active',
  nodes: {},
  revealedEvidenceIds: [],
  eliminatedSuspectIds: [],
  accusedSuspectId: null,
  notebook: [],
  totalTimeSec: 0,
  totalMistakes: 0,
  cluesFound: 0,
  cluesTotal,
  stars: 0,
  startedAt: null,
  solvedAt: null,
});

function applyNodeCompletion(
  prev: CaseProgress,
  def: NonNullable<ReturnType<typeof getCaseById>>,
  nodeId: string,
  result: NodeResult,
  skipped: boolean,
): CaseProgress {
  const node = def.board.nodes.find((n) => n.id === nodeId);
  if (!node) return prev;
  if (prev.nodes[nodeId]?.status === 'completed') return prev;

  const evidence = def.evidence.find((e) => e.id === node.rewardEvidenceId);
  const nodeProgress: NodeProgress = {
    nodeId,
    status: 'completed',
    mistakes: result.mistakes,
    hintsUsed: result.hintsUsed,
    timeSec: result.timeSec,
    completedAt: Date.now(),
    skipped: skipped || undefined,
  };

  const entries: NotebookEntry[] = [...prev.notebook];
  if (evidence) {
    evidence.notebookEntries.forEach((tpl) => {
      if (entries.some((e) => e.id === tpl.id)) return;
      entries.push({
        id: tpl.id,
        type: tpl.type,
        label: tpl.label,
        value: tpl.value,
        sourceNodeId: nodeId,
        order: entries.length,
      });
    });
  }

  const eliminated = new Set(prev.eliminatedSuspectIds);
  evidence?.implications.eliminates.forEach((id) => {
    if (id !== def.culpritId) eliminated.add(id);
  });

  const revealed = new Set(prev.revealedEvidenceIds);
  if (evidence) revealed.add(evidence.id);

  return {
    ...prev,
    status: 'active',
    nodes: { ...prev.nodes, [nodeId]: nodeProgress },
    revealedEvidenceIds: [...revealed],
    eliminatedSuspectIds: [...eliminated],
    notebook: entries,
    totalTimeSec: prev.totalTimeSec + result.timeSec,
    totalMistakes: prev.totalMistakes + result.mistakes,
    cluesFound: revealed.size,
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      player: createInitialProgress(),
      hydrated: false,

      getCaseProgress: (caseId) => get().player.cases[caseId],

      isUnlocked: (caseId) => {
        const def = getCaseById(caseId);
        if (!def) return false;
        return isCaseUnlocked(def, get().player);
      },

      spendCoins: (amount) => {
        if (get().player.coins < amount) return false;
        set((state) => ({
          player: { ...state.player, coins: state.player.coins - amount },
        }));
        return true;
      },

      startCase: (caseId) => {
        const def = getCaseById(caseId);
        if (!def || !isCaseUnlocked(def, get().player)) return false;
        set((state) => {
          const existing = state.player.cases[caseId];
          if (existing && existing.status !== 'available' && existing.status !== 'locked') {
            return state;
          }
          const cp = freshCaseProgress(caseId, def.board.nodes.length);
          cp.startedAt = Date.now();
          return {
            player: {
              ...state.player,
              createdAt: state.player.createdAt ?? Date.now(),
              lastPlayedCaseId: caseId,
              cases: { ...state.player.cases, [caseId]: cp },
            },
          };
        });
        return true;
      },

      completeNode: (caseId, nodeId, result, skipped = false) => {
        const def = getCaseById(caseId);
        if (!def) return;
        set((state) => {
          const prev =
            state.player.cases[caseId] ?? freshCaseProgress(caseId, def.board.nodes.length);
          const cp = applyNodeCompletion(prev, def, nodeId, result, skipped);
          if (cp === prev) return state;
          return {
            player: {
              ...state.player,
              lastPlayedCaseId: caseId,
              cases: { ...state.player.cases, [caseId]: cp },
            },
          };
        });
      },

      skipNode: (caseId, nodeId) => {
        if (!canAfford(get().player.coins, 'skipNode')) return false;
        const def = getCaseById(caseId);
        if (!def) return false;
        if (!get().spendCoins(COIN_PRICES.skipNode)) return false;
        get().completeNode(caseId, nodeId, { mistakes: 0, hintsUsed: 0, timeSec: 0 }, true);
        return true;
      },

      purchaseExtraHint: () => {
        if (!canAfford(get().player.coins, 'extraHint')) return false;
        return get().spendCoins(COIN_PRICES.extraHint);
      },

      purchaseRetry: () => {
        if (!canAfford(get().player.coins, 'retryPuzzle')) return false;
        return get().spendCoins(COIN_PRICES.retryPuzzle);
      },

      toggleSuspect: (caseId, suspectId) => {
        const def = getCaseById(caseId);
        if (!def) return;
        set((state) => {
          const cp = state.player.cases[caseId];
          if (!cp) return state;
          const set_ = new Set(cp.eliminatedSuspectIds);
          if (set_.has(suspectId)) set_.delete(suspectId);
          else set_.add(suspectId);
          return {
            player: {
              ...state.player,
              cases: {
                ...state.player.cases,
                [caseId]: { ...cp, eliminatedSuspectIds: [...set_] },
              },
            },
          };
        });
      },

      makeAccusation: (caseId, suspectId) => {
        const def = getCaseById(caseId);
        if (!def) return null;
        const correct = suspectId === def.culpritId;
        let outcome: AccusationResult | null = null;

        set((state) => {
          const prev = state.player.cases[caseId];
          if (!prev) return state;

          const earnedStars: 1 | 2 | 3 = computeStars(prev.totalMistakes);
          let coinsEarned = 0;
          outcome = { correct, culpritId: def.culpritId, stars: correct ? earnedStars : 1, coinsEarned: 0 };

          const cp: CaseProgress = {
            ...prev,
            accusedSuspectId: suspectId,
            status: correct ? 'solved' : 'failed',
            stars: correct ? earnedStars : prev.stars,
            solvedAt: correct ? Date.now() : prev.solvedAt,
          };

          let coins = state.player.coins;
          let rankLevel = state.player.rankLevel;
          let badges = state.player.badges;

          if (correct && prev.status !== 'solved') {
            coinsEarned = def.rewards.coins + STAR_COIN_BONUS[earnedStars];
            coins += coinsEarned;
            outcome.coinsEarned = coinsEarned;
            rankLevel = Math.min(rankLevel + def.rewards.rankDelta, RANK_LADDER.length - 1);
            badges = badges.includes(def.rewards.badgeId)
              ? badges
              : [...badges, def.rewards.badgeId];
          }

          let cases = { ...state.player.cases, [caseId]: cp };
          if (correct) cases = syncCaseLocks(cases);

          return {
            player: {
              ...state.player,
              coins,
              rankLevel,
              badges,
              cases,
            },
          };
        });

        return outcome;
      },

      resetCase: (caseId) => {
        set((state) => {
          const cases = { ...state.player.cases };
          delete cases[caseId];
          return { player: { ...state.player, cases: syncCaseLocks(cases) } };
        });
      },

      updateSettings: (patch) =>
        set((state) => ({
          player: { ...state.player, settings: { ...state.player.settings, ...patch } },
        })),

      _setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.progress,
      storage: persistStorage,
      partialize: (state) => ({ player: state.player }),
      merge: (persisted, current) => {
        const p = persisted as Partial<ProgressState> | undefined;
        if (!p?.player) return current;
        const player = {
          ...current.player,
          ...p.player,
          version: PROGRESS_VERSION,
          settings: { ...defaultSettings, ...p.player.settings },
          cases: syncCaseLocks(p.player.cases ?? {}),
        };
        return { ...current, player };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.player = {
            ...state.player,
            cases: syncCaseLocks(state.player.cases),
          };
        }
        state?._setHydrated();
      },
    },
  ),
);

export const currentRank = (player: PlayerProgress) => rankForLevel(player.rankLevel);
