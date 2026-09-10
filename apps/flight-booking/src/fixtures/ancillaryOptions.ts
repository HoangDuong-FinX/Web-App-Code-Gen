import type { AncillaryOption } from '../types';

let shouldFail = false;

export function setLoadAncillaryOutcome(fail: boolean): void {
  shouldFail = fail;
}

let submitOutcome: 'success' | 'fail' = 'success';

export function setSubmitAncillaryOutcome(outcome: 'success' | 'fail'): void {
  submitOutcome = outcome;
}

const ancillaryData: AncillaryOption[] = [
  { optionId: 'meal-01', name: 'C\u01a1m g\u00e0', category: 'meal', priceAmount: 89000 },
  { optionId: 'meal-02', name: 'Ph\u1edf b\u00f2', category: 'meal', priceAmount: 89000 },
  { optionId: 'meal-03', name: 'M\u00ec x\u00e0o h\u1ea3i s\u1ea3n', category: 'meal', priceAmount: 99000 },
  { optionId: 'bag-01', name: 'H\u00e0nh l\u00fd 20kg', category: 'baggage', priceAmount: 250000 },
  { optionId: 'bag-02', name: 'H\u00e0nh l\u00fd 30kg', category: 'baggage', priceAmount: 350000 },
  { optionId: 'bag-03', name: 'H\u00e0nh l\u00fd 40kg', category: 'baggage', priceAmount: 450000 },
];

export async function loadAncillaryOptions(): Promise<AncillaryOption[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (shouldFail) {
    throw new Error('FIXTURE: ancillary options load failed');
  }
  return ancillaryData;
}

export async function submitAncillarySelections(
  _sessionId: string,
  _selections: Array<{ passengerId: string; optionId: string }>
): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  if (submitOutcome === 'fail') {
    throw new Error('FIXTURE: ancillary submit failed');
  }
}
