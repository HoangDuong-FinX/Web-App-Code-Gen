import type { Airport } from '../types';

let shouldFail = false;

export function setLoadAirportsOutcome(fail: boolean): void {
  shouldFail = fail;
}

const airportsData: Airport[] = [
  { code: 'SGN', name: 'TP. H\u1ed3 Ch\u00ed Minh', group: 'popular' },
  { code: 'HAN', name: 'H\u00e0 N\u1ed9i', group: 'popular' },
  { code: 'DAD', name: '\u0110\u00e0 N\u1eb5ng', group: 'popular' },
  { code: 'CXR', name: 'Nha Trang', group: 'domestic' },
  { code: 'PQC', name: 'Ph\u00fa Qu\u1ed1c', group: 'domestic' },
  { code: 'VDO', name: 'V\u00e2n \u0110\u1ed3n', group: 'domestic' },
  { code: 'HUI', name: 'Hu\u1ebf', group: 'domestic' },
  { code: 'VCA', name: 'C\u1ea7n Th\u01a1', group: 'domestic' },
  { code: 'BKK', name: 'Bangkok', group: 'international' },
  { code: 'ICN', name: 'Seoul', group: 'international' },
  { code: 'NRT', name: 'Tokyo', group: 'international' },
  { code: 'SIN', name: 'Singapore', group: 'international' },
];

export async function loadAirports(): Promise<Airport[]> {
  await new Promise((r) => setTimeout(r, 300));
  if (shouldFail) {
    throw new Error('FIXTURE: airports load failed');
  }
  return airportsData;
}
