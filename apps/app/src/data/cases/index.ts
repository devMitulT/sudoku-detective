import { Case } from '@/models';
import { ALL_BLUEPRINTS } from './case-catalog';
import { buildCaseFromBlueprint } from './build-case';
import { CASE_001 } from './case-001';

const GENERATED_CASES = ALL_BLUEPRINTS.map(buildCaseFromBlueprint);

/** All cases shipped with the app, in display order (#001–#025). */
export const CASES: Case[] = [CASE_001, ...GENERATED_CASES];

export const TOTAL_PLANNED_CASES = CASES.length;

export const getCaseById = (id: string): Case | undefined =>
  CASES.find((c) => c.id === id);

export const getCaseByNumber = (n: number): Case | undefined =>
  CASES.find((c) => c.number === n);

export { CASE_001 };
