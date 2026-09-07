// Airport fixture data — used when fsap-booking-service is unreachable
import type { Airport } from '../types/state';

type FixtureOutcome = 'success' | 'fail';
let outcome: FixtureOutcome = 'success';
export function setLoadAirportsOutcome(o: FixtureOutcome): void { outcome = o; }

export const AIRPORTS: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
  { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'VN', group: 'Popular' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'VN', group: 'Popular' },
  { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Popular' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang', country: 'VN', group: 'Vietnam' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phú Quốc', country: 'VN', group: 'Vietnam' },
  { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'VN', group: 'Vietnam' },
  { code: 'HUI', name: 'Phú Bài', city: 'Huế', country: 'VN', group: 'Vietnam' },
  { code: 'VCA', name: 'Cần Thơ', city: 'Cần Thơ', country: 'VN', group: 'Vietnam' },
  { code: 'BMV', name: 'Buôn Ma Thuột', city: 'Buôn Ma Thuột', country: 'VN', group: 'Vietnam' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'SG', group: 'International' },
  { code: 'KUL', name: 'KLIA', city: 'Kuala Lumpur', country: 'MY', group: 'International' },
];

export async function loadAirports(): Promise<Airport[]> {
  await new Promise(r => setTimeout(r, 300));
  if (outcome === 'fail') throw new Error('fixture: load-airports failed');
  return AIRPORTS;
}
