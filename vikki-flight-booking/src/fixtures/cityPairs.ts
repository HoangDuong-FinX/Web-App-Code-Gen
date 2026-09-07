// Fixture: City pairs data
// Waiting on: GET /internal/vja/city-pairs
import type { CityPair } from '../types/state';

export const FIXTURE_CITY_PAIRS: CityPair[] = [
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'DLI' },
  { origin: 'DLI', destination: 'SGN' },
  { origin: 'SGN', destination: 'DAD' },
  { origin: 'DAD', destination: 'SGN' },
  { origin: 'HAN', destination: 'DAD' },
  { origin: 'DAD', destination: 'HAN' },
  { origin: 'SGN', destination: 'CXR' },
  { origin: 'CXR', destination: 'SGN' },
  { origin: 'SGN', destination: 'PQC' },
  { origin: 'PQC', destination: 'SGN' },
  { origin: 'HAN', destination: 'DLI' },
  { origin: 'DLI', destination: 'HAN' },
  { origin: 'SGN', destination: 'BKK' },
  { origin: 'BKK', destination: 'SGN' },
  { origin: 'SGN', destination: 'SIN' },
  { origin: 'SIN', destination: 'SGN' },
];

type LoadCityPairsOutcome = 'success' | 'fail';
let _outcome: LoadCityPairsOutcome = 'success';

export function setLoadCityPairsOutcome(o: LoadCityPairsOutcome): void {
  _outcome = o;
}

export async function fixtureLoadCityPairs(): Promise<CityPair[]> {
  await new Promise(r => setTimeout(r, 200));
  if (_outcome === 'fail') throw new Error('fixture: load-city-pairs failed');
  return FIXTURE_CITY_PAIRS;
}
