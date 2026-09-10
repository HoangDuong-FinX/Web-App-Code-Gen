import type { CityPair } from '../types';

let shouldFail = false;

export function setLoadCityPairsOutcome(fail: boolean): void {
  shouldFail = fail;
}

const cityPairsData: CityPair[] = [
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'DAD' },
  { origin: 'DAD', destination: 'SGN' },
  { origin: 'HAN', destination: 'DAD' },
  { origin: 'DAD', destination: 'HAN' },
  { origin: 'SGN', destination: 'CXR' },
  { origin: 'CXR', destination: 'SGN' },
  { origin: 'SGN', destination: 'PQC' },
  { origin: 'PQC', destination: 'SGN' },
  { origin: 'SGN', destination: 'BKK' },
  { origin: 'BKK', destination: 'SGN' },
  { origin: 'HAN', destination: 'ICN' },
  { origin: 'ICN', destination: 'HAN' },
  { origin: 'SGN', destination: 'NRT' },
  { origin: 'NRT', destination: 'SGN' },
  { origin: 'SGN', destination: 'SIN' },
  { origin: 'SIN', destination: 'SGN' },
];

export async function loadCityPairs(): Promise<CityPair[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (shouldFail) {
    throw new Error('FIXTURE: city pairs load failed');
  }
  return cityPairsData;
}
