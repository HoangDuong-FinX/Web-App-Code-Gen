import type { Airport } from '../types';

let shouldFail = false;

export function setLoadAirportsOutcome(fail: boolean): void {
  shouldFail = fail;
}

export function loadAirportsFixture(): Promise<Airport[]> {
  if (shouldFail) {
    return Promise.reject(new Error('fixture: airports load failed'));
  }
  return Promise.resolve([
    { code: 'SGN', name: 'TP. Hồ Chí Minh (Tân Sơn Nhất)', group: 'popular' },
    { code: 'HAN', name: 'Hà Nội (Nội Bài)', group: 'popular' },
    { code: 'DAD', name: 'Đà Nẵng', group: 'popular' },
    { code: 'CXR', name: 'Nha Trang (Cam Ranh)', group: 'vietnam' },
    { code: 'PQC', name: 'Phú Quốc', group: 'vietnam' },
    { code: 'VDO', name: 'Vân Đồn', group: 'vietnam' },
    { code: 'HPH', name: 'Hải Phòng (Cát Bi)', group: 'vietnam' },
    { code: 'HUI', name: 'Huế (Phú Bài)', group: 'vietnam' },
    { code: 'VII', name: 'Vinh', group: 'vietnam' },
    { code: 'UIH', name: 'Quy Nhơn (Phù Cát)', group: 'vietnam' },
    { code: 'DLI', name: 'Đà Lạt (Liên Khương)', group: 'vietnam' },
    { code: 'BMV', name: 'Buôn Ma Thuột', group: 'vietnam' },
    { code: 'VCA', name: 'Cần Thơ', group: 'vietnam' },
    { code: 'BKK', name: 'Bangkok (Suvarnabhumi)', group: 'international' },
    { code: 'ICN', name: 'Seoul (Incheon)', group: 'international' },
    { code: 'NRT', name: 'Tokyo (Narita)', group: 'international' },
    { code: 'SIN', name: 'Singapore (Changi)', group: 'international' },
  ]);
}