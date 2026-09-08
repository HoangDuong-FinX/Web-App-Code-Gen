import type { Car, Promotion } from '../types';

let featuredOutcome: 'success' | 'fail' = 'success';
export function setFeaturedCarsOutcome(v: 'success' | 'fail'): void { featuredOutcome = v; }

let catalogOutcome: 'success' | 'fail' = 'success';
export function setCatalogOutcome(v: 'success' | 'fail'): void { catalogOutcome = v; }

let carDetailOutcome: 'success' | 'fail' = 'success';
export function setCarDetailOutcome(v: 'success' | 'fail'): void { carDetailOutcome = v; }

let searchOutcome: 'success' | 'fail' = 'success';
export function setSearchOutcome(v: 'success' | 'fail'): void { searchOutcome = v; }

const sampleCars: Car[] = [
  {
    id: 'car-1', name: 'Toyota Camry 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry',
    formattedPrice: '1.050.000.000 ₫', condition: 'Mới', specsSummary: '2.5L, Tự động, Xăng',
    status: 'available', hasActivePromo: true, promoLabel: 'Giảm 30 triệu', monthlyInstallment: '12.500.000 ₫',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Front', label: 'Mặt trước' },
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Side', label: 'Mặt bên' },
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Interior', label: 'Nội thất' },
    ],
    specs: [
      { label: 'Động cơ', value: '2.5L 4 xi-lanh' }, { label: 'Công suất', value: '203 mã lực' },
      { label: 'Hộp số', value: '8 cấp tự động' }, { label: 'Nhiên liệu', value: 'Xăng' },
      { label: 'Tiêu hao', value: '7.8L/100km' }, { label: 'Số chỗ', value: '5' },
    ],
    dealer: { name: 'Toyota Thủ Đức', address: '123 Võ Văn Ngân, TP.HCM', phone: '028 1234 5678' },
  },
  {
    id: 'car-2', name: 'Honda CR-V 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=CR-V',
    formattedPrice: '1.130.000.000 ₫', condition: 'Mới', specsSummary: '1.5L Turbo, Tự động, Xăng',
    status: 'available', hasActivePromo: false, promoLabel: '', monthlyInstallment: '13.800.000 ₫',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=CRV+Front', label: 'Mặt trước' },
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=CRV+Interior', label: 'Nội thất' },
    ],
    specs: [
      { label: 'Động cơ', value: '1.5L Turbo' }, { label: 'Công suất', value: '188 mã lực' },
      { label: 'Hộp số', value: 'CVT' }, { label: 'Nhiên liệu', value: 'Xăng' },
      { label: 'Tiêu hao', value: '7.5L/100km' }, { label: 'Số chỗ', value: '5+2' },
    ],
    dealer: { name: 'Honda Phước Thành', address: '456 Điện Biên Phủ, TP.HCM', phone: '028 9876 5432' },
  },
  {
    id: 'car-3', name: 'Mazda CX-5 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=CX-5',
    formattedPrice: '839.000.000 ₫', condition: 'Mới', specsSummary: '2.0L, Tự động, Xăng',
    status: 'available', hasActivePromo: true, promoLabel: 'Tặng bảo hiểm 1 năm', monthlyInstallment: '10.200.000 ₫',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=CX5', label: 'Mặt trước' },
    ],
    specs: [
      { label: 'Động cơ', value: '2.0L SkyActiv-G' }, { label: 'Công suất', value: '154 mã lực' },
      { label: 'Hộp số', value: '6 cấp tự động' }, { label: 'Nhiên liệu', value: 'Xăng' },
      { label: 'Tiêu hao', value: '7.0L/100km' }, { label: 'Số chỗ', value: '5' },
    ],
    dealer: { name: 'Mazda Bình Triệu', address: '789 Kha Vạn Cân, TP.HCM', phone: '028 5555 6666' },
  },
  {
    id: 'car-4', name: 'Ford Ranger 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Ranger',
    formattedPrice: '925.000.000 ₫', condition: 'Mới', specsSummary: '2.0L Turbo, Tự động, Dầu',
    status: 'reserved', hasActivePromo: false, promoLabel: '', monthlyInstallment: '11.300.000 ₫',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Ranger', label: 'Mặt trước' },
    ],
    specs: [
      { label: 'Động cơ', value: '2.0L Bi-Turbo' }, { label: 'Công suất', value: '210 mã lực' },
      { label: 'Hộp số', value: '10 cấp tự động' }, { label: 'Nhiên liệu', value: 'Dầu Diesel' },
      { label: 'Tiêu hao', value: '8.5L/100km' }, { label: 'Số chỗ', value: '5' },
    ],
    dealer: { name: 'Ford An Lạc', address: '101 Kinh Dương Vương, TP.HCM', phone: '028 7777 8888' },
  },
  {
    id: 'car-5', name: 'VinFast VF 8 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=VF8',
    formattedPrice: '1.129.000.000 ₫', condition: 'Mới', specsSummary: 'Điện, 402km, AWD',
    status: 'available', hasActivePromo: true, promoLabel: 'Ưu đãi pin trọn đời', monthlyInstallment: '13.700.000 ₫',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=VF8', label: 'Mặt trước' },
    ],
    specs: [
      { label: 'Động cơ', value: 'Điện 2 motor' }, { label: 'Công suất', value: '402 mã lực' },
      { label: 'Hộp số', value: '1 cấp' }, { label: 'Nhiên liệu', value: 'Điện' },
      { label: 'Phạm vi', value: '402 km' }, { label: 'Số chỗ', value: '5' },
    ],
    dealer: { name: 'VinFast Thảo Điền', address: '200 Xa lộ Hà Nội, TP.HCM', phone: '028 3333 4444' },
  },
];

export async function loadFeaturedCars(): Promise<Car[]> {
  await new Promise(r => setTimeout(r, 300));
  if (featuredOutcome === 'fail') throw new Error('Network error');
  return sampleCars.slice(0, 4);
}

export async function loadCatalog(_filters?: Record<string, string>, _sort?: string): Promise<{ cars: Car[]; resultsCount: number }> {
  await new Promise(r => setTimeout(r, 300));
  if (catalogOutcome === 'fail') throw new Error('Network error');
  return { cars: sampleCars, resultsCount: sampleCars.length };
}

export async function loadCarDetail(carId: string): Promise<Car | null> {
  await new Promise(r => setTimeout(r, 200));
  if (carDetailOutcome === 'fail') throw new Error('Network error');
  return sampleCars.find(c => c.id === carId) ?? null;
}

export async function searchCars(query: string): Promise<{ suggestions: Array<{ text: string }>; results: Car[] }> {
  await new Promise(r => setTimeout(r, 200));
  if (searchOutcome === 'fail') throw new Error('Network error');
  const q = query.toLowerCase();
  const results = sampleCars.filter(c => c.name.toLowerCase().includes(q));
  const suggestions = results.map(c => ({ text: c.name }));
  return { suggestions, results };
}

export { sampleCars };
