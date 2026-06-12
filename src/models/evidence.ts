/**
 * Evidence & clues.
 *
 * Every investigation node rewards the player with a piece of `Evidence` on
 * puzzle completion. Evidence carries the narrative reveal text plus the
 * deductive `implications` that drive suspect elimination, and a set of
 * `notebookEntries` that get appended to the detective's notebook.
 */

export type EvidenceType =
  | 'physical' // fingerprint, object
  | 'testimony' // witness statement
  | 'forensic' // lab analysis
  | 'footage' // CCTV
  | 'document'; // emails, files

export type NotebookEntryType = 'evidence' | 'deduction' | 'suspect' | 'motive';

/** A single line written into the detective notebook. */
export interface NotebookEntryTemplate {
  id: string;
  type: NotebookEntryType;
  label: string;
  value: string;
}

/** How a piece of evidence affects the suspect pool. */
export interface SuspectImplication {
  /** Suspects this evidence clears. */
  eliminates: string[];
  /** Suspects this evidence points toward. */
  implicates: string[];
}

export interface Evidence {
  id: string;
  type: EvidenceType;
  /** Short title, e.g. "Fingerprint on the Desk". */
  title: string;
  /** Emoji / glyph used as the evidence icon in the MVP. */
  icon: string;
  /** Headline shown in the reveal animation, e.g. "Evidence Recovered". */
  revealHeadline: string;
  /** Multi-line narrative reveal body. */
  revealBody: string;
  /** Optional structured detail rows (e.g. fingerprint match table). */
  detailRows?: { label: string; value: string }[];
  /** Node that grants this evidence. */
  nodeId: string;
  notebookEntries: NotebookEntryTemplate[];
  implications: SuspectImplication;
}

/**
 * A clue is a derived, human-facing deduction summarizing what a piece of
 * evidence tells the detective. In the MVP these are surfaced through
 * notebook entries, but the type is kept distinct for future deduction UIs.
 */
export interface Clue {
  id: string;
  evidenceId: string;
  text: string;
}
