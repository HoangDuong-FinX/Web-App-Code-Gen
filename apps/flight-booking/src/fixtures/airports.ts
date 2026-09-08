import type { Airport, CityPair } from '../types';

export const fixtureAirports: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', cityName: 'Hồ Chí Minh', countryCode: 'VN' },
  { code: 'HAN', name: 'Nội Bài', cityName: 'Hà Nội', countryCode: 'VN' },
  { code: 'DAD', name: 'Đà Nẵng', cityName: 'Đà Nẵng', countryCode: 'VN' },
  { code: 'CXR', name: 'Cam Ranh', cityName: 'Nha Trang', countryCode: 'VN' },
  { code: 'PQC', name: 'Phú Quốc', cityName: 'Phú Quốc', countryCode: 'VN' },
  { code: 'VDO', name: 'Vân Đồn', cityName: 'Quảng Ninh', countryCode: 'VN' },
  { code: 'HPH', name: 'Cát Bi', cityName: 'Hải Phòng', countryCode: 'VN' },
  { code: 'HUI', name: 'Phú Bài', cityName: 'Huế', countryCode: 'VN' },
  { code: 'BKK', name: 'Suvarnabhumi', cityName: 'Bangkok', countryCode: 'TH' },
  { code: 'ICN', name: 'Incheon', cityName: 'Seoul', countryCode: 'KR' },
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
  { origin: 'SGN', destination: 'BKK' },
  { origin: 'BKK', destination: 'SGN' },
  { origin: 'HAN', destination: 'ICN' },
  { origin: 'ICN', destination: 'HAN' },
];
