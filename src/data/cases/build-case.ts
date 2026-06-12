import {
  Case,
  Difficulty,
  Evidence,
  InvestigationNode,
  PuzzleConfig,
  PuzzleModifier,
  Suspect,
} from '@/models';
import { caseSolveCoins } from '@/store/economy';
import { accentFor, CaseBlueprint } from './case-catalog';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function puzzleFor(caseNum: number, order: number): PuzzleConfig {
  const tier = Math.min(2, Math.floor((caseNum - 1) / 8));
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const diff = difficulties[Math.min(2, tier + Math.floor(order / 2))];

  const mods: PuzzleModifier[][] = [
    ['classic'],
    ['mistakeLimit'],
    ['foggedCells'],
    ['timed'],
    ['noHints'],
  ];
  const mod = mods[order % mods.length];

  const base: PuzzleConfig = {
    difficulty: diff,
    modifiers: mod,
    hintsAllowed: mod[0] !== 'noHints',
    maxHints: mod[0] === 'noHints' ? undefined : Math.max(1, 3 - Math.floor(order / 2)),
  };

  if (mod.includes('mistakeLimit')) base.maxMistakes = Math.max(2, 4 - Math.floor(caseNum / 10));
  if (mod.includes('timed')) base.timeLimitSec = Math.max(240, 420 - caseNum * 5);
  return base;
}

const NODE_META: { kind: InvestigationNode['kind']; title: string; tagline: string; icon: string }[] = [
  { kind: 'crimeScene', title: 'Crime Scene', tagline: 'Sweep the area for physical evidence.', icon: 'crimeScene' },
  { kind: 'witness', title: 'Witness Interview', tagline: 'Press witnesses for what they saw.', icon: 'witness' },
  { kind: 'forensics', title: 'Forensics Lab', tagline: 'Run evidence against every suspect.', icon: 'forensics' },
  { kind: 'cctv', title: 'Security Footage', tagline: 'Reconstruct the corrupted feed.', icon: 'cctv' },
  { kind: 'analysis', title: 'Case Analysis', tagline: 'Piece the motive together.', icon: 'analysis' },
];

export function buildCaseFromBlueprint(bp: CaseBlueprint): Case {
  const caseId = `case-${String(bp.number).padStart(3, '0')}`;
  const prefix = caseId;

  const suspects: Suspect[] = bp.suspects.map((s, i) => ({
    id: `${prefix}-${slugify(s.name)}`,
    name: s.name,
    role: s.role,
    age: s.age,
    relationship: s.relationship,
    motive: s.motive,
    description: `${s.role}. ${s.relationship}`,
    accent: accentFor(i),
    initials: initials(s.name),
  }));

  const culpritId = suspects[bp.culpritIndex].id;
  const forensicElimIdx = ([0, 1, 2, 3] as const).find(
    (i) => i !== bp.culpritIndex && !bp.witnessClears.includes(i),
  )!;

  const nodeIds = NODE_META.map((_, i) => `${prefix}-node-${i}`);
  const evidenceIds = NODE_META.map((_, i) => `${prefix}-ev-${i}`);

  const evidence: Evidence[] = [
    {
      id: evidenceIds[0],
      type: 'physical',
      title: bp.physicalTitle,
      icon: 'fingerprint',
      revealHeadline: 'Evidence Recovered',
      revealBody: bp.physicalBody,
      nodeId: nodeIds[0],
      notebookEntries: [
        { id: `${prefix}-nb-0`, type: 'evidence', label: 'Physical', value: bp.physicalTitle },
      ],
      implications: { eliminates: [], implicates: [] },
    },
    {
      id: evidenceIds[1],
      type: 'testimony',
      title: 'Witness Statement',
      icon: 'eye',
      revealHeadline: 'Statement Recorded',
      revealBody: bp.witnessBody,
      nodeId: nodeIds[1],
      detailRows: suspects.map((s, i) => ({ label: s.name, value: bp.witnessRows[i * 2 + 1] })),
      notebookEntries: [
        { id: `${prefix}-nb-1`, type: 'deduction', label: 'Witness', value: 'Clothing clue recorded' },
      ],
      implications: {
        eliminates: bp.witnessClears.map((i) => suspects[i].id),
        implicates: suspects.filter((_, i) => !bp.witnessClears.includes(i)).map((s) => s.id),
      },
    },
    {
      id: evidenceIds[2],
      type: 'forensic',
      title: 'Forensic Analysis',
      icon: 'microscope',
      revealHeadline: 'Analysis Complete',
      revealBody: bp.forensicBody,
      nodeId: nodeIds[2],
      detailRows: suspects.map((s) => ({
        label: s.name,
        value: s.id === culpritId ? 'Match' : 'No match',
      })),
      notebookEntries: [
        { id: `${prefix}-nb-2`, type: 'evidence', label: 'Forensics', value: `Points to ${suspects[bp.culpritIndex].name}` },
      ],
      implications: {
        eliminates: [suspects[forensicElimIdx].id],
        implicates: [culpritId],
      },
    },
    {
      id: evidenceIds[3],
      type: 'footage',
      title: 'Security Footage',
      icon: 'cctv',
      revealHeadline: 'Footage Restored',
      revealBody: bp.cctvBody,
      nodeId: nodeIds[3],
      detailRows: [
        { label: 'Entry', value: `${suspects[bp.culpritIndex].name}` },
        { label: 'Exit', value: bp.cctvExit },
      ],
      notebookEntries: [
        { id: `${prefix}-nb-3`, type: 'deduction', label: 'CCTV', value: `${suspects[bp.culpritIndex].name} on scene` },
      ],
      implications: { eliminates: [], implicates: [culpritId] },
    },
    {
      id: evidenceIds[4],
      type: 'document',
      title: 'Recovered Document',
      icon: 'email',
      revealHeadline: 'Document Recovered',
      revealBody: bp.motiveBody,
      nodeId: nodeIds[4],
      notebookEntries: [
        { id: `${prefix}-nb-4`, type: 'motive', label: 'Motive', value: `Confirmed — ${suspects[bp.culpritIndex].name}` },
      ],
      implications: { eliminates: [], implicates: [culpritId] },
    },
  ];

  const nodes: InvestigationNode[] = NODE_META.map((meta, order) => ({
    id: nodeIds[order],
    kind: meta.kind,
    order,
    title: meta.title,
    tagline: meta.tagline,
    icon: meta.icon,
    rewardEvidenceId: evidenceIds[order],
    puzzle: puzzleFor(bp.number, order),
  }));

  const nextId = `case-${String(bp.number + 1).padStart(3, '0')}`;

  return {
    id: caseId,
    number: bp.number,
    title: bp.title,
    subtitle: bp.subtitle,
    victim: bp.victim,
    location: bp.location,
    timeOfDeath: bp.timeOfDeath,
    synopsis: bp.synopsis,
    difficulty: bp.difficulty,
    estimatedMinutes: bp.estimatedMinutes,
    suspects,
    evidence,
    board: { caseId, nodes },
    culpritId,
    endingNarrative: bp.endingNarrative,
    evidenceSummary: [...bp.evidenceSummary],
    rewards: {
      coins: caseSolveCoins(bp.number),
      rankDelta: bp.number % 3 === 0 ? 1 : 0,
      badgeId: `badge-${slugify(bp.title)}`,
      unlocksCaseId: bp.number < 25 ? nextId : undefined,
    },
    isAvailable: bp.number === 1,
  };
}
