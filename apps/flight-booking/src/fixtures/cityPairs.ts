import type { CityPair } from '../types';

let shouldFail = false;

export function setLoadCityPairsOutcome(fail: boolean): void {
  shouldFail = fail;
}

export function loadCityPairsFixture(): Promise<CityPair[]> {
  if (shouldFail) {
    return Promise.reject(new Error('fixture: city pairs load failed'));
  }
  return Promise.resolve([
    { origin_code: 'SGN', destination_code: 'HAN' },
    { origin_code: 'HAN', destination_code: 'SGN' },
    { origin_code: 'SGN', destination_code: 'DAD' },
    { origin_code: 'DAD', destination_code: 'SGN' },
    { origin_code: 'HAN', destination_code: 'DAD' },
    { origin_code: 'DAD', destination_code: 'HAN' },
    { origin_code: 'SGN', destination_code: 'CXR' },
    { origin_code: 'CXR', destination_code: 'SGN' },
    { origin_code: 'SGN', destination_code: 'PQC' },
    { origin_code: 'PQC', destination_code: 'SGN' },
    { origin_code: 'SGN', destination_code: 'BKK' },
    { origin_code: 'BKK', destination_code: 'SGN' },
    { origin_code: 'HAN', destination_code: 'ICN' },
    { origin_code: 'ICN', destination_code: 'HAN' },
    { origin_code: 'SGN', destination_code: 'NRT' },
    { origin_code: 'NRT', destination_code: 'SGN' },
    { origin_code: 'SGN', destination_code: 'SIN' },
    { origin_code: 'SIN', destination_code: 'SGN' },
    { origin_code: 'HAN', destination_code: 'BKK' },
    { origin_code: 'BKK', destination_code: 'HAN' },
  ]);
}