import type { CityPair } from '../types';

export const fixtureCityPairs: CityPair[] = [
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
];
