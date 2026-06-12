import { Case, Evidence, InvestigationNode, Suspect } from '@/models';

/**
 * CASE #001 — "The Midnight Laboratory"
 *
 * Authored from the game design brief. The five investigation nodes form the
 * core loop (Crime Scene → Witness → Forensics → CCTV → Case Analysis), each
 * gated behind a Sudoku puzzle of escalating difficulty. Solving a node's
 * puzzle reveals the evidence below, which narrows the suspect pool until only
 * the culprit — Richard Clark — remains.
 */

// --- Suspect ids ---
const SARAH = 'sarah-miller';
const MICHAEL = 'michael-ross';
const RICHARD = 'richard-clark';
const EMILY = 'emily-stone';

// --- Node ids ---
const N_CRIME = 'node-crime-scene';
const N_WITNESS = 'node-witness';
const N_FORENSICS = 'node-forensics';
const N_CCTV = 'node-cctv';
const N_ANALYSIS = 'node-analysis';

// --- Evidence ids ---
const E_FINGERPRINT = 'ev-fingerprint';
const E_WITNESS = 'ev-witness-statement';
const E_MATCH = 'ev-fingerprint-match';
const E_FOOTAGE = 'ev-cctv-footage';
const E_EMAIL = 'ev-private-email';

const suspects: Suspect[] = [
  {
    id: SARAH,
    name: 'Sarah Miller',
    role: 'Research Assistant',
    age: 27,
    relationship: 'Worked directly under the victim.',
    motive: 'Promotion dispute.',
    description:
      'Ambitious and meticulous. Had been passed over for a promotion Dr. Reed promised her.',
    accent: '#FF4D6D',
    initials: 'SM',
  },
  {
    id: MICHAEL,
    name: 'Michael Ross',
    role: 'Graduate Student',
    age: 24,
    relationship: 'His research project was rejected by the victim.',
    motive: 'Academic revenge.',
    description:
      'Brilliant but bitter. Dr. Reed rejected the proposal that would have funded his doctorate.',
    accent: '#4CC9F0',
    initials: 'MR',
  },
  {
    id: RICHARD,
    name: 'Richard Clark',
    role: 'Senior Professor',
    age: 52,
    relationship: 'A long-standing professional rival.',
    motive: 'Research funding conflict.',
    description:
      'Distinguished, proud, and protective of his reputation. Controlled the department’s funding.',
    accent: '#F7B731',
    initials: 'RC',
  },
  {
    id: EMILY,
    name: 'Emily Stone',
    role: 'Night Janitor',
    age: 38,
    relationship: 'Holds after-hours access to the building.',
    motive: 'Unknown.',
    description:
      'Quiet and dependable. On shift the night of the murder, with keys to every room.',
    accent: '#52D273',
    initials: 'ES',
  },
];

const evidence: Evidence[] = [
  {
    id: E_FINGERPRINT,
    type: 'physical',
    title: 'Fingerprint on the Desk',
    icon: 'fingerprint',
    revealHeadline: 'Evidence Recovered',
    revealBody: "A fingerprint was found\non the victim's desk.",
    nodeId: N_CRIME,
    notebookEntries: [
      { id: 'nb-fingerprint', type: 'evidence', label: 'Fingerprint', value: 'Found — owner unknown' },
    ],
    implications: { eliminates: [], implicates: [] },
  },
  {
    id: E_WITNESS,
    type: 'testimony',
    title: 'Witness Statement',
    icon: 'eye',
    revealHeadline: 'Statement Recorded',
    revealBody:
      'I saw someone wearing\na blue jacket entering\nthe laboratory around\n9 PM.',
    nodeId: N_WITNESS,
    detailRows: [
      { label: 'Sarah Miller', value: 'Red Coat' },
      { label: 'Michael Ross', value: 'Blue Jacket' },
      { label: 'Richard Clark', value: 'Blue Jacket' },
      { label: 'Emily Stone', value: 'Grey Uniform' },
    ],
    notebookEntries: [
      { id: 'nb-witness', type: 'deduction', label: 'Witness', value: 'Suspect wore a blue jacket' },
    ],
    // Red coat (Sarah) and grey uniform (Emily) are cleared.
    implications: { eliminates: [SARAH, EMILY], implicates: [MICHAEL, RICHARD] },
  },
  {
    id: E_MATCH,
    type: 'forensic',
    title: 'Fingerprint Match Results',
    icon: 'microscope',
    revealHeadline: 'Analysis Complete',
    revealBody: 'The desk fingerprint\nhas been matched.',
    nodeId: N_FORENSICS,
    detailRows: [
      { label: 'Sarah Miller', value: 'No match' },
      { label: 'Michael Ross', value: 'No match' },
      { label: 'Richard Clark', value: 'Match' },
      { label: 'Emily Stone', value: 'No match' },
    ],
    notebookEntries: [
      { id: 'nb-match', type: 'evidence', label: 'Fingerprint', value: 'Matches Richard Clark' },
      { id: 'nb-desk', type: 'deduction', label: 'Desk', value: 'Richard linked to the desk' },
    ],
    implications: { eliminates: [MICHAEL], implicates: [RICHARD] },
  },
  {
    id: E_FOOTAGE,
    type: 'footage',
    title: 'Restored Security Footage',
    icon: 'cctv',
    revealHeadline: 'Footage Restored',
    revealBody: 'Richard entered\nthe laboratory\nat 9:12 PM.',
    nodeId: N_CCTV,
    detailRows: [
      { label: 'Entry', value: 'Richard Clark — 9:12 PM' },
      { label: 'Exit', value: 'No footage of him leaving' },
    ],
    notebookEntries: [
      { id: 'nb-cctv', type: 'deduction', label: 'CCTV', value: 'Richard inside the lab' },
    ],
    implications: { eliminates: [], implicates: [RICHARD] },
  },
  {
    id: E_EMAIL,
    type: 'document',
    title: 'Private Email Recovered',
    icon: 'email',
    revealHeadline: 'Document Recovered',
    revealBody:
      'From: Dr. Jonathan Reed\nTo: University Board\nSubject: Funding Misconduct\n\n“I am preparing evidence against\nProfessor Richard Clark.”',
    nodeId: N_ANALYSIS,
    notebookEntries: [
      { id: 'nb-motive', type: 'motive', label: 'Motive', value: 'Confirmed — Richard Clark' },
    ],
    implications: { eliminates: [], implicates: [RICHARD] },
  },
];

const nodes: InvestigationNode[] = [
  {
    id: N_CRIME,
    kind: 'crimeScene',
    order: 0,
    title: 'Crime Scene',
    tagline: 'Sweep the laboratory for physical evidence.',
    icon: 'crimeScene',
    rewardEvidenceId: E_FINGERPRINT,
    puzzle: { difficulty: 'easy', modifiers: ['classic'], hintsAllowed: true, maxHints: 3 },
  },
  {
    id: N_WITNESS,
    kind: 'witness',
    order: 1,
    title: 'Witness Interview',
    tagline: 'Press the night guard for what he saw.',
    icon: 'witness',
    rewardEvidenceId: E_WITNESS,
    puzzle: {
      difficulty: 'easy',
      modifiers: ['mistakeLimit'],
      maxMistakes: 3,
      hintsAllowed: true,
      maxHints: 3,
    },
  },
  {
    id: N_FORENSICS,
    kind: 'forensics',
    order: 2,
    title: 'Forensics Lab',
    tagline: 'Run the fingerprint against every suspect.',
    icon: 'forensics',
    rewardEvidenceId: E_MATCH,
    puzzle: {
      difficulty: 'medium',
      modifiers: ['foggedCells'],
      hintsAllowed: true,
      maxHints: 2,
    },
  },
  {
    id: N_CCTV,
    kind: 'cctv',
    order: 3,
    title: 'Security Footage',
    tagline: 'Reconstruct the corrupted CCTV feed.',
    icon: 'cctv',
    rewardEvidenceId: E_FOOTAGE,
    puzzle: {
      difficulty: 'hard',
      modifiers: ['classic'],
      hintsAllowed: true,
      maxHints: 2,
    },
  },
  {
    id: N_ANALYSIS,
    kind: 'analysis',
    order: 4,
    title: 'Case Analysis',
    tagline: 'Piece the motive together. No help this time.',
    icon: 'analysis',
    rewardEvidenceId: E_EMAIL,
    puzzle: {
      difficulty: 'hard',
      modifiers: ['noHints'],
      hintsAllowed: false,
    },
  },
];

export const CASE_001: Case = {
  id: 'case-001',
  number: 1,
  title: 'The Midnight Laboratory',
  subtitle: 'A locked-room murder at the university research lab.',
  victim: 'Dr. Jonathan Reed',
  location: 'University Research Lab',
  timeOfDeath: '11:45 PM',
  synopsis:
    'At 11:45 PM, renowned scientist Dr. Jonathan Reed was found dead inside the university research laboratory. The laboratory was locked from the inside. Only a small group of people had access to the building that night. Your mission is to uncover the truth.',
  difficulty: 'Beginner',
  estimatedMinutes: '5–8',
  suspects,
  evidence,
  board: { caseId: 'case-001', nodes },
  culpritId: RICHARD,
  endingNarrative:
    'Richard Clark had been manipulating research funding for years. Dr. Reed discovered the fraud and planned to expose him. Fearing exposure, Richard confronted Dr. Reed in the laboratory. The argument escalated, resulting in murder. Richard was arrested the following morning. Justice was served.',
  evidenceSummary: [
    'Fingerprint Match',
    'Witness Confirmation',
    'CCTV Evidence',
    'Motive Established',
  ],
  rewards: { coins: 100, rankDelta: 1, badgeId: 'badge-midnight-laboratory' },
  isAvailable: true,
};
