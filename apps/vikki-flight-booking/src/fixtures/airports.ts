import type { Airport, CityPair } from '../types';

export const fixtureAirports: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh' },
  { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phú Quốc' },
  { code: 'VDO', name: 'Vân Đồn', city: 'Quảng Ninh' },
  { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng' },
  { code: 'HUI', name: 'Phú Bài', city: 'Huế' },
];

export const fixtureCityPairs: CityPair[] = [
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'DAD' },
  { origin: 'DAD', destination: 'SGN' },
  { origin: 'SGN', destination: 'CXR' },
  { origin: 'CXR', destination: 'SGN' },
  { origin: 'SGN', destination: 'PQC' },
  { origin: 'PQC', destination: 'SGN' },
  { origin: 'HAN', destination: 'DAD' },
  { origin: 'DAD', destination: 'HAN' },
  { origin: 'HAN', destination: 'CXR' },
  { origin: 'CXR', destination: 'HAN' },
  { origin: 'HAN', destination: 'PQC' },
  { origin: 'PQC', destination: 'HAN' },
  { origin: 'HAN', destination: 'HPH' },
  { origin: 'HPH', destination: 'HAN' },
];
