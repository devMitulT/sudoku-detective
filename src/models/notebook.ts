import { NotebookEntryType } from './evidence';

/** A concrete notebook line recorded during play. */
export interface NotebookEntry {
  id: string;
  type: NotebookEntryType;
  label: string;
  value: string;
  /** Node that produced this entry. */
  sourceNodeId: string;
  /** Monotonic order in which it was added. */
  order: number;
}

/** The detective's notebook for a single case. */
export interface Notebook {
  caseId: string;
  entries: NotebookEntry[];
}
