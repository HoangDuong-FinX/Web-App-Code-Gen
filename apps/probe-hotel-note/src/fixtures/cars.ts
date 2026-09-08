import type { Car } from '../types';

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
    formattedPrice: '1.050.000.000 \u20ab', condition: 'M\u1edbi', specsSummary: '2.5L, T\u1ef1 \u0111\u1ed9ng, X\u0103ng',
    status: 'available', hasActivePromo: true, promoLabel: 'Gi\u1ea3m 30 tri\u1ec7u', monthlyInstallment: '12.500.000 \u20ab',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Front', label: 'M\u1eb7t tr\u01b0\u1edbc' },
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Side', label: 'M\u1eb7t b\u00ean' },
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Interior', label: 'N\u1ed9i th\u1ea5t' },
    ],
    specs: [
      { label: '\u0110\u1ed9ng c\u01a1', value: '2.5L 4 xi-lanh' }, { label: 'C\u00f4ng su\u1ea5t', value: '203 m\u00e3 l\u1ef1c' },
      { label: 'H\u1ed9p s\u1ed1', value: '8 c\u1ea5p t\u1ef1 \u0111\u1ed9ng' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' },
      { label: 'Ti\u00eau hao', value: '7.8L/100km' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' },
    ],
    dealer: { name: 'Toyota Th\u1ee7 \u0110\u1ee9c', address: '123 V\u00f5 V\u0103n Ng\u00e2n, TP.HCM', phone: '028 1234 5678' },
  },
  {
    id: 'car-2', name: 'Honda CR-V 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=CR-V',
    formattedPrice: '1.130.000.000 \u20ab', condition: 'M\u1edbi', specsSummary: '1.5L Turbo, T\u1ef1 \u0111\u1ed9ng, X\u0103ng',
    status: 'available', hasActivePromo: false, promoLabel: '', monthlyInstallment: '13.800.000 \u20ab',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=CRV+Front', label: 'M\u1eb7t tr\u01b0\u1edbc' },
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=CRV+Interior', label: 'N\u1ed9i th\u1ea5t' },
    ],
    specs: [
      { label: '\u0110\u1ed9ng c\u01a1', value: '1.5L Turbo' }, { label: 'C\u00f4ng su\u1ea5t', value: '188 m\u00e3 l\u1ef1c' },
      { label: 'H\u1ed9p s\u1ed1', value: 'CVT' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' },
      { label: 'Ti\u00eau hao', value: '7.5L/100km' }, { label: 'S\u1ed1 ch\u1ed7', value: '5+2' },
    ],
    dealer: { name: 'Honda Ph\u01b0\u1edbc Th\u00e0nh', address: '456 \u0110i\u1ec7n Bi\u00ean Ph\u1ee7, TP.HCM', phone: '028 9876 5432' },
  },
  {
    id: 'car-3', name: 'Mazda CX-5 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=CX-5',
    formattedPrice: '839.000.000 \u20ab', condition: 'M\u1edbi', specsSummary: '2.0L, T\u1ef1 \u0111\u1ed9ng, X\u0103ng',
    status: 'available', hasActivePromo: true, promoLabel: 'T\u1eb7ng b\u1ea3o hi\u1ec3m 1 n\u0103m', monthlyInstallment: '10.200.000 \u20ab',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=CX5', label: 'M\u1eb7t tr\u01b0\u1edbc' },
    ],
    specs: [
      { label: '\u0110\u1ed9ng c\u01a1', value: '2.0L SkyActiv-G' }, { label: 'C\u00f4ng su\u1ea5t', value: '154 m\u00e3 l\u1ef1c' },
      { label: 'H\u1ed9p s\u1ed1', value: '6 c\u1ea5p t\u1ef1 \u0111\u1ed9ng' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' },
      { label: 'Ti\u00eau hao', value: '7.0L/100km' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' },
    ],
    dealer: { name: 'Mazda B\u00ecnh Tri\u1ec7u', address: '789 Kha V\u1ea1n C\u00e2n, TP.HCM', phone: '028 5555 6666' },
  },
  {
    id: 'car-4', name: 'Ford Ranger 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Ranger',
    formattedPrice: '925.000.000 \u20ab', condition: 'M\u1edbi', specsSummary: '2.0L Turbo, T\u1ef1 \u0111\u1ed9ng, D\u1ea7u',
    status: 'reserved', hasActivePromo: false, promoLabel: '', monthlyInstallment: '11.300.000 \u20ab',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=Ranger', label: 'M\u1eb7t tr\u01b0\u1edbc' },
    ],
    specs: [
      { label: '\u0110\u1ed9ng c\u01a1', value: '2.0L Bi-Turbo' }, { label: 'C\u00f4ng su\u1ea5t', value: '210 m\u00e3 l\u1ef1c' },
      { label: 'H\u1ed9p s\u1ed1', value: '10 c\u1ea5p t\u1ef1 \u0111\u1ed9ng' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'D\u1ea7u Diesel' },
      { label: 'Ti\u00eau hao', value: '8.5L/100km' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' },
    ],
    dealer: { name: 'Ford An L\u1ea1c', address: '101 Kinh D\u01b0\u01a1ng V\u01b0\u01a1ng, TP.HCM', phone: '028 7777 8888' },
  },
  {
    id: 'car-5', name: 'VinFast VF 8 2024', thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=VF8',
    formattedPrice: '1.129.000.000 \u20ab', condition: 'M\u1edbi', specsSummary: '\u0110i\u1ec7n, 402km, AWD',
    status: 'available', hasActivePromo: true, promoLabel: '\u01afu \u0111\u00e3i pin tr\u1ecdn \u0111\u1eddi', monthlyInstallment: '13.700.000 \u20ab',
    photos: [
      { url: 'https://placehold.co/800x450/e2e8f0/475569?text=VF8', label: 'M\u1eb7t tr\u01b0\u1edbc' },
    ],
    specs: [
      { label: '\u0110\u1ed9ng c\u01a1', value: '\u0110i\u1ec7n 2 motor' }, { label: 'C\u00f4ng su\u1ea5t', value: '402 m\u00e3 l\u1ef1c' },
      { label: 'H\u1ed9p s\u1ed1', value: '1 c\u1ea5p' }, { label: 'Nhi\u00ean li\u1ec7u', value: '\u0110i\u1ec7n' },
      { label: 'Ph\u1ea1m vi', value: '402 km' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' },
    ],
    dealer: { name: 'VinFast Th\u1ea3o \u0110i\u1ec1n', address: '200 Xa l\u1ed9 H\u00e0 N\u1ed9i, TP.HCM', phone: '028 3333 4444' },
  },
];

export async function loadFeaturedCars(): Promise<Car[]> {
  await new Promise(r => setTimeout(r, 300));
  if (featuredOutcome === 'fail') throw new Error('Network error');
  return sampleCars.slice(0, 4);
}

export async function loadCatalog(): Promise<{ cars: Car[]; resultsCount: number }> {
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
