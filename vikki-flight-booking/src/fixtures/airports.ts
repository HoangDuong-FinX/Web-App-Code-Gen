// Fixture: Airports data
// Waiting on: GET /internal/vja/airports
import type { Airport } from '../types/state';

export const FIXTURE_AIRPORTS: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
  { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'VN', group: 'Popular' },
  { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Popular' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'VN', group: 'Popular' },
  { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'VN', group: 'Vietnam' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang', country: 'VN', group: 'Vietnam' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phú Quốc', country: 'VN', group: 'Vietnam' },
  { code: 'UIH', name: 'Phù Cát', city: 'Quy Nhơn', country: 'VN', group: 'Vietnam' },
  { code: 'HUI', name: 'Phú Bài', city: 'Huế', country: 'VN', group: 'Vietnam' },
  { code: 'VCA', name: 'Cần Thơ', city: 'Cần Thơ', country: 'VN', group: 'Vietnam' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'SG', group: 'International' },
  { code: 'KUL', name: 'KLIA', city: 'Kuala Lumpur', country: 'MY', group: 'International' },
];

type LoadAirportsOutcome = 'success' | 'fail';
let _outcome: LoadAirportsOutcome = 'success';

export function setLoadAirportsOutcome(o: LoadAirportsOutcome): void {
  _outcome = o;
}

export async function fixtureLoadAirports(): Promise<Airport[]> {
  await new Promise(r => setTimeout(r, 300));
  if (_outcome === 'fail') throw new Error('fixture: load-airports failed');
  return FIXTURE_AIRPORTS;
}
