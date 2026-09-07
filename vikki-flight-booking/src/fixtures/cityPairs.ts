// City pairs fixture — used when fsap-booking-service is unreachable
import type { CityPair } from '../types/state';

type FixtureOutcome = 'success' | 'fail';
let outcome: FixtureOutcome = 'success';
export function setLoadCityPairsOutcome(o: FixtureOutcome): void { outcome = o; }

export const CITY_PAIRS: CityPair[] = [
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'DAD' },
  { origin: 'DAD', destination: 'SGN' },
  { origin: 'SGN', destination: 'DLI' },
  { origin: 'DLI', destination: 'SGN' },
  { origin: 'SGN', destination: 'CXR' },
  { origin: 'CXR', destination: 'SGN' },
  { origin: 'SGN', destination: 'PQC' },
  { origin: 'PQC', destination: 'SGN' },
  { origin: 'HAN', destination: 'DAD' },
  { origin: 'DAD', destination: 'HAN' },
  { origin: 'HAN', destination: 'DLI' },
  { origin: 'DLI', destination: 'HAN' },
  { origin: 'HAN', destination: 'PQC' },
  { origin: 'PQC', destination: 'HAN' },
  { origin: 'SGN', destination: 'BKK' },
  { origin: 'BKK', destination: 'SGN' },
  { origin: 'SGN', destination: 'SIN' },
  { origin: 'SIN', destination: 'SGN' },
  { origin: 'HAN', destination: 'SIN' },
  { origin: 'SIN', destination: 'HAN' },
];

export async function loadCityPairs(): Promise<CityPair[]> {
  await new Promise(r => setTimeout(r, 200));
  if (outcome === 'fail') throw new Error('fixture: load-city-pairs failed');
  return CITY_PAIRS;
}

export function isValidRoute(origin: string, destination: string): boolean {
  return CITY_PAIRS.some(p => p.origin === origin && p.destination === destination);
}
