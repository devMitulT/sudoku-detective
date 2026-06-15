import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  generatePuzzle,
  matchesSolution,
  remainingCells,
  SIZE,
} from '@/features/sudoku/engine';
import { InvestigationNode, PuzzleSession, SudokuGrid } from '@/models';
import { persistStorage, STORAGE_KEYS } from './storage';

const key = (row: number, col: number) => `${row},${col}`;

const cloneBoard = (g: SudokuGrid): SudokuGrid => g.map((r) => r.slice()) as SudokuGrid;

/** Peers (same row, column, box) of a cell, excluding the cell itself. */
function peersOf(row: number, col: number): [number, number][] {
  const peers: [number, number][] = [];
  for (let i = 0; i < SIZE; i++) {
    if (i !== col) peers.push([row, i]);
    if (i !== row) peers.push([i, col]);
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const rr = br + r;
      const cc = bc + c;
      if (rr !== row && cc !== col) peers.push([rr, cc]);
    }
  }
  return peers;
}

interface GameState {
  caseId: string | null;
  nodeId: string | null;
  session: PuzzleSession | null;
  hydrated: boolean;

  startNode: (caseId: string, node: InvestigationNode) => void;
  selectCell: (row: number, col: number) => void;
  inputValue: (num: number) => void;
  erase: () => void;
  toggleNoteMode: () => void;
  useHint: () => void;
  grantBonusHint: () => void;
  revealFog: (row: number, col: number) => void;
  tick: (deltaSec: number) => void;
  setStatus: (status: PuzzleSession['status']) => void;
  clearSession: () => void;
  _setHydrated: () => void;
}

const isGiven = (session: PuzzleSession, row: number, col: number) =>
  session.puzzle.givens[row][col] !== 0;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      caseId: null,
      nodeId: null,
      session: null,
      hydrated: false,

      startNode: (caseId, node) => {
        const existing = get().session;
        // Resume an unfinished puzzle for the same node instead of regenerating.
        if (
          existing &&
          get().caseId === caseId &&
          get().nodeId === node.id &&
          (existing.status === 'playing' || existing.status === 'paused')
        ) {
          set({ session: { ...existing, status: 'playing', startedAt: Date.now() } });
          return;
        }

        const puzzle = generatePuzzle(node.puzzle, { id: `${caseId}:${node.id}` });
        const session: PuzzleSession = {
          puzzle,
          board: cloneBoard(puzzle.givens),
          notes: {},
          selected: null,
          highlightedNumber: null,
          noteMode: false,
          revealedFog: [],
          mistakes: 0,
          hintsUsed: 0,
          bonusHints: 0,
          elapsedSec: 0,
          remainingSec: puzzle.config.timeLimitSec ?? null,
          status: 'playing',
          startedAt: Date.now(),
        };
        set({ caseId, nodeId: node.id, session });
      },

      selectCell: (row, col) =>
        set((state) => {
          if (!state.session || state.session.status !== 'playing') return state;
          const val = state.session.board[row][col];
          return {
            session: {
              ...state.session,
              selected: { row, col },
              // Filled cell → highlight that digit everywhere; empty cell → keep pad highlight.
              highlightedNumber: val !== 0 ? val : state.session.highlightedNumber,
            },
          };
        }),

      inputValue: (num) =>
        set((state) => {
          const s = state.session;
          if (!s || s.status !== 'playing') return state;

          // Tapping a pad digit always highlights it across the board/pad,
          // even when no editable cell is selected.
          const highlighted = { ...s, highlightedNumber: num };
          if (!s.selected) return { session: highlighted };
          const { row, col } = s.selected;
          if (isGiven(s, row, col)) return { session: highlighted };

          // Note mode: toggle a pencil mark.
          if (s.noteMode) {
            const k = key(row, col);
            const current = s.notes[k] ?? [];
            const next = current.includes(num)
              ? current.filter((n) => n !== num)
              : [...current, num].sort((a, b) => a - b);
            return { session: { ...highlighted, notes: { ...s.notes, [k]: next } } };
          }

          const board = cloneBoard(s.board);
          board[row][col] = num as SudokuGrid[number][number];
          const notes: Record<string, number[]> = { ...s.notes, [key(row, col)]: [] };

          // Auto-clear this value from peers' pencil marks.
          for (const [pr, pc] of peersOf(row, col)) {
            const pk = key(pr, pc);
            if (notes[pk]?.includes(num)) {
              notes[pk] = notes[pk].filter((n) => n !== num);
            }
          }

          let mistakes = s.mistakes;
          let status: PuzzleSession['status'] = s.status;
          const correct = s.puzzle.solution[row][col] === num;
          if (!correct) {
            mistakes += 1;
            const cap = s.puzzle.config.maxMistakes;
            if (cap !== undefined && mistakes > cap) status = 'failed';
          }

          if (status === 'playing' && remainingCells(board) === 0 && matchesSolution(board, s.puzzle.solution)) {
            status = 'solved';
          }

          return { session: { ...highlighted, board, notes, mistakes, status } };
        }),

      erase: () =>
        set((state) => {
          const s = state.session;
          if (!s || s.status !== 'playing' || !s.selected) return state;
          const { row, col } = s.selected;
          if (isGiven(s, row, col)) return state;
          const board = cloneBoard(s.board);
          board[row][col] = 0;
          return { session: { ...s, board, notes: { ...s.notes, [key(row, col)]: [] } } };
        }),

      toggleNoteMode: () =>
        set((state) =>
          state.session ? { session: { ...state.session, noteMode: !state.session.noteMode } } : state,
        ),

      useHint: () =>
        set((state) => {
          const s = state.session;
          if (!s || s.status !== 'playing') return state;
          const bonus = s.bonusHints ?? 0;
          if (!s.puzzle.config.hintsAllowed && bonus === 0) return state;
          const maxFree = s.puzzle.config.maxHints;
          if (maxFree !== undefined && s.hintsUsed >= maxFree + bonus) return state;

          // Prefer the selected empty cell; otherwise the first empty cell.
          let target = s.selected;
          if (!target || s.board[target.row][target.col] !== 0 || isGiven(s, target.row, target.col)) {
            target = null;
            outer: for (let r = 0; r < SIZE; r++) {
              for (let c = 0; c < SIZE; c++) {
                if (s.board[r][c] === 0) {
                  target = { row: r, col: c };
                  break outer;
                }
              }
            }
          }
          if (!target) return state;

          const { row, col } = target;
          const board = cloneBoard(s.board);
          board[row][col] = s.puzzle.solution[row][col];
          const revealedFog = s.revealedFog.includes(key(row, col))
            ? s.revealedFog
            : [...s.revealedFog, key(row, col)];

          let status: PuzzleSession['status'] = s.status;
          if (remainingCells(board) === 0 && matchesSolution(board, s.puzzle.solution)) {
            status = 'solved';
          }

          return {
            session: {
              ...s,
              board,
              notes: { ...s.notes, [key(row, col)]: [] },
              revealedFog,
              hintsUsed: s.hintsUsed + 1,
              selected: { row, col },
              status,
            },
          };
        }),

      grantBonusHint: () =>
        set((state) =>
          state.session
            ? { session: { ...state.session, bonusHints: (state.session.bonusHints ?? 0) + 1 } }
            : state,
        ),

      revealFog: (row, col) =>
        set((state) => {
          const s = state.session;
          if (!s) return state;
          const k = key(row, col);
          if (s.revealedFog.includes(k)) return state;
          return { session: { ...s, revealedFog: [...s.revealedFog, k] } };
        }),

      tick: (deltaSec) =>
        set((state) => {
          const s = state.session;
          if (!s || s.status !== 'playing') return state;
          const elapsedSec = s.elapsedSec + deltaSec;
          let remainingSec = s.remainingSec;
          let status: PuzzleSession['status'] = s.status;
          if (remainingSec !== null) {
            remainingSec = Math.max(0, remainingSec - deltaSec);
            if (remainingSec === 0) status = 'failed';
          }
          return { session: { ...s, elapsedSec, remainingSec, status } };
        }),

      setStatus: (status) =>
        set((state) => (state.session ? { session: { ...state.session, status } } : state)),

      clearSession: () => set({ caseId: null, nodeId: null, session: null }),

      _setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.game,
      storage: persistStorage,
      partialize: (state) => ({
        caseId: state.caseId,
        nodeId: state.nodeId,
        session: state.session,
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    },
  ),
);
