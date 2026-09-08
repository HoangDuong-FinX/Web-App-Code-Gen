import type { Car, Category } from '../types';

let submitInquiryOutcome: 'success' | 'fail' = 'success';
export function setSubmitInquiryOutcome(o: 'success' | 'fail'): void {
  submitInquiryOutcome = o;
}

let submitReservationOutcome: 'success' | 'fail' = 'success';
export function setSubmitReservationOutcome(o: 'success' | 'fail'): void {
  submitReservationOutcome = o;
}

let saveListingOutcome: 'success' | 'fail' = 'success';
export function setSaveListingOutcome(o: 'success' | 'fail'): void {
  saveListingOutcome = o;
}

let markSoldOutcome: 'success' | 'fail' = 'success';
export function setMarkSoldOutcome(o: 'success' | 'fail'): void {
  markSoldOutcome = o;
}

let deleteListingOutcome: 'success' | 'fail' = 'success';
export function setDeleteListingOutcome(o: 'success' | 'fail'): void {
  deleteListingOutcome = o;
}

export const fixtureCategories: Category[] = [
  { id: 'cat-1', name: 'Toyota', type: 'brand' },
  { id: 'cat-2', name: 'Honda', type: 'brand' },
  { id: 'cat-3', name: 'SUV', type: 'bodyType' },
  { id: 'cat-4', name: 'Sedan', type: 'bodyType' },
  { id: 'cat-5', name: 'D\u01b0\u1edbi 500 tri\u1ec7u', type: 'priceRange' },
  { id: 'cat-6', name: 'Tr\u00ean 1 t\u1ef7', type: 'priceRange' },
];

const baseCars: Car[] = [
  {
    id: 'car-1', name: 'Toyota Camry 2024', brand: 'Toyota', model: 'Camry', year: 2024,
    price: 1050000000, promoPrice: 999000000, installment: '15.500.000', mileage: 0,
    fuelType: 'X\u0103ng', transmission: 'T\u1ef1 \u0111\u1ed9ng', engineCapacity: '2.5L',
    color: 'Tr\u1eafng Ng\u1ecdc Trai', seats: 5, condition: 'M\u1edbi',
    description: 'Toyota Camry 2024 ho\u00e0n to\u00e0n m\u1edbi v\u1edbi thi\u1ebft k\u1ebf sang tr\u1ecdng, \u0111\u1ed9ng c\u01a1 2.5L m\u1ea1nh m\u1ebd v\u00e0 ti\u1ebft ki\u1ec7m nhi\u00ean li\u1ec7u.',
    photos: ['https://placehold.co/800x450/e2e8f0/475569?text=Camry+Front', 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Side', 'https://placehold.co/800x450/e2e8f0/475569?text=Camry+Interior'],
    thumbnailUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Camry',
    keySpecs: '2024 \u00b7 M\u1edbi \u00b7 2.5L \u00b7 T\u1ef1 \u0111\u1ed9ng',
    specs: [{ label: 'N\u0103m', value: '2024' }, { label: 'S\u1ed1 km', value: '0 km' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' }, { label: 'H\u1ed9p s\u1ed1', value: 'T\u1ef1 \u0111\u1ed9ng' }, { label: '\u0110\u1ed9ng c\u01a1', value: '2.5L' }, { label: 'M\u00e0u', value: 'Tr\u1eafng Ng\u1ecdc Trai' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' }],
    status: 'active',
  },
  {
    id: 'car-2', name: 'Honda Civic RS 2023', brand: 'Honda', model: 'Civic', year: 2023,
    price: 870000000, mileage: 12000, fuelType: 'X\u0103ng', transmission: 'T\u1ef1 \u0111\u1ed9ng',
    engineCapacity: '1.5L Turbo', color: '\u0110\u1ecf', seats: 5, condition: '\u0110\u00e3 s\u1eed d\u1ee5ng',
    description: 'Honda Civic RS 2023 phi\u00ean b\u1ea3n th\u1ec3 thao v\u1edbi \u0111\u1ed9ng c\u01a1 1.5L Turbo m\u1ea1nh m\u1ebd.',
    photos: ['https://placehold.co/800x450/fce4ec/c62828?text=Civic+Front', 'https://placehold.co/800x450/fce4ec/c62828?text=Civic+Side'],
    thumbnailUrl: 'https://placehold.co/400x300/fce4ec/c62828?text=Civic',
    keySpecs: '2023 \u00b7 12.000 km \u00b7 1.5L Turbo',
    specs: [{ label: 'N\u0103m', value: '2023' }, { label: 'S\u1ed1 km', value: '12.000 km' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' }, { label: 'H\u1ed9p s\u1ed1', value: 'T\u1ef1 \u0111\u1ed9ng' }, { label: '\u0110\u1ed9ng c\u01a1', value: '1.5L Turbo' }, { label: 'M\u00e0u', value: '\u0110\u1ecf' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' }],
    status: 'active',
  },
  {
    id: 'car-3', name: 'Hyundai Tucson 2024', brand: 'Hyundai', model: 'Tucson', year: 2024,
    price: 920000000, promoPrice: 879000000, installment: '13.800.000', mileage: 0,
    fuelType: 'X\u0103ng', transmission: 'T\u1ef1 \u0111\u1ed9ng', engineCapacity: '2.0L',
    color: 'Xanh \u0110en', seats: 5, condition: 'M\u1edbi',
    description: 'Hyundai Tucson 2024 SUV c\u1ee1 trung v\u1edbi thi\u1ebft k\u1ebf hi\u1ec7n \u0111\u1ea1i.',
    photos: ['https://placehold.co/800x450/e8eaf6/283593?text=Tucson+Front', 'https://placehold.co/800x450/e8eaf6/283593?text=Tucson+Side'],
    thumbnailUrl: 'https://placehold.co/400x300/e8eaf6/283593?text=Tucson',
    keySpecs: '2024 \u00b7 M\u1edbi \u00b7 2.0L \u00b7 SUV',
    specs: [{ label: 'N\u0103m', value: '2024' }, { label: 'S\u1ed1 km', value: '0 km' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' }, { label: 'H\u1ed9p s\u1ed1', value: 'T\u1ef1 \u0111\u1ed9ng' }, { label: '\u0110\u1ed9ng c\u01a1', value: '2.0L' }, { label: 'M\u00e0u', value: 'Xanh \u0110en' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' }],
    status: 'active',
  },
  {
    id: 'car-4', name: 'Mazda CX-5 2023', brand: 'Mazda', model: 'CX-5', year: 2023,
    price: 749000000, mileage: 25000, fuelType: 'X\u0103ng', transmission: 'T\u1ef1 \u0111\u1ed9ng',
    engineCapacity: '2.0L', color: 'Xanh D\u01b0\u01a1ng', seats: 5, condition: '\u0110\u00e3 s\u1eed d\u1ee5ng',
    description: 'Mazda CX-5 2023 thi\u1ebft k\u1ebf KODO, n\u1ed9i th\u1ea5t sang tr\u1ecdng.',
    photos: ['https://placehold.co/800x450/e3f2fd/1565c0?text=CX5+Front'],
    thumbnailUrl: 'https://placehold.co/400x300/e3f2fd/1565c0?text=CX5',
    keySpecs: '2023 \u00b7 25.000 km \u00b7 2.0L',
    specs: [{ label: 'N\u0103m', value: '2023' }, { label: 'S\u1ed1 km', value: '25.000 km' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' }, { label: 'H\u1ed9p s\u1ed1', value: 'T\u1ef1 \u0111\u1ed9ng' }, { label: '\u0110\u1ed9ng c\u01a1', value: '2.0L' }, { label: 'M\u00e0u', value: 'Xanh D\u01b0\u01a1ng' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' }],
    status: 'active',
  },
  {
    id: 'car-5', name: 'VinFast VF 8 2024', brand: 'VinFast', model: 'VF 8', year: 2024,
    price: 1129000000, promoPrice: 1059000000, installment: '16.200.000', mileage: 0,
    fuelType: '\u0110i\u1ec7n', transmission: 'T\u1ef1 \u0111\u1ed9ng', engineCapacity: 'Electric',
    color: '\u0110en', seats: 5, condition: 'M\u1edbi',
    description: 'VinFast VF 8 2024 SUV \u0111i\u1ec7n th\u00f4ng minh, c\u00f4ng ngh\u1ec7 t\u1ef1 l\u00e1i h\u1ed7 tr\u1ee3 ADAS.',
    photos: ['https://placehold.co/800x450/e8f5e9/2e7d32?text=VF8+Front', 'https://placehold.co/800x450/e8f5e9/2e7d32?text=VF8+Side'],
    thumbnailUrl: 'https://placehold.co/400x300/e8f5e9/2e7d32?text=VF8',
    keySpecs: '2024 \u00b7 M\u1edbi \u00b7 \u0110i\u1ec7n \u00b7 SUV',
    specs: [{ label: 'N\u0103m', value: '2024' }, { label: 'S\u1ed1 km', value: '0 km' }, { label: 'Nhi\u00ean li\u1ec7u', value: '\u0110i\u1ec7n' }, { label: 'H\u1ed9p s\u1ed1', value: 'T\u1ef1 \u0111\u1ed9ng' }, { label: '\u0110\u1ed9ng c\u01a1', value: 'Electric' }, { label: 'M\u00e0u', value: '\u0110en' }, { label: 'S\u1ed1 ch\u1ed7', value: '5' }],
    status: 'active',
  },
  {
    id: 'car-6', name: 'Kia Morning 2022', brand: 'Kia', model: 'Morning', year: 2022,
    price: 349000000, mileage: 35000, fuelType: 'X\u0103ng', transmission: 'T\u1ef1 \u0111\u1ed9ng',
    engineCapacity: '1.25L', color: 'B\u1ea1c', seats: 4, condition: '\u0110\u00e3 s\u1eed d\u1ee5ng',
    description: 'Kia Morning 2022 xe nh\u1ecf g\u1ecdn, ti\u1ebft ki\u1ec7m nhi\u00ean li\u1ec7u.',
    photos: ['https://placehold.co/800x450/fff3e0/e65100?text=Morning+Front'],
    thumbnailUrl: 'https://placehold.co/400x300/fff3e0/e65100?text=Morning',
    keySpecs: '2022 \u00b7 35.000 km \u00b7 1.25L',
    specs: [{ label: 'N\u0103m', value: '2022' }, { label: 'S\u1ed1 km', value: '35.000 km' }, { label: 'Nhi\u00ean li\u1ec7u', value: 'X\u0103ng' }, { label: 'H\u1ed9p s\u1ed1', value: 'T\u1ef1 \u0111\u1ed9ng' }, { label: '\u0110\u1ed9ng c\u01a1', value: '1.25L' }, { label: 'M\u00e0u', value: 'B\u1ea1c' }, { label: 'S\u1ed1 ch\u1ed7', value: '4' }],
    status: 'active',
  },
];

const HERO_BANNER_URL = 'https://placehold.co/800x450/1e293b/f8fafc?text=AutoMini+-+Mua+Ban+Oto';

export function loadFeaturedCars(): { featuredCars: Car[]; categories: Category[]; heroBannerUrl: string } {
  return { featuredCars: baseCars.filter((c) => c.status === 'active').slice(0, 4), categories: fixtureCategories, heroBannerUrl: HERO_BANNER_URL };
}

export function loadCatalogCars(filters: { brand?: string; fuelType?: string }, page: number, pageSize: number = 12): { cars: Car[]; totalCount: number; hasMore: boolean } {
  let filtered = baseCars.filter((c) => c.status === 'active');
  if (filters.brand) filtered = filtered.filter((c) => c.brand.toLowerCase() === filters.brand!.toLowerCase());
  if (filters.fuelType) filtered = filtered.filter((c) => c.fuelType === filters.fuelType);
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);
  return { cars: paged, totalCount: filtered.length, hasMore: start + pageSize < filtered.length };
}

export function loadCarDetail(carId: string): Car | null {
  return baseCars.find((c) => c.id === carId) ?? null;
}

export function searchCars(keyword: string, page: number, pageSize: number = 12): { cars: Car[]; totalCount: number; hasMore: boolean } {
  const kw = keyword.toLowerCase();
  const matched = baseCars.filter((c) => c.status === 'active' && (c.name.toLowerCase().includes(kw) || c.brand.toLowerCase().includes(kw) || c.model.toLowerCase().includes(kw)));
  const start = (page - 1) * pageSize;
  const paged = matched.slice(start, start + pageSize);
  return { cars: paged, totalCount: matched.length, hasMore: start + pageSize < matched.length };
}

export function submitInquiryFixture(): { success: boolean; inquiryId: string } {
  if (submitInquiryOutcome === 'fail') return { success: false, inquiryId: '' };
  return { success: true, inquiryId: 'inq-' + Date.now() };
}

export function submitReservationFixture(): { success: boolean; reservationId: string } {
  if (submitReservationOutcome === 'fail') return { success: false, reservationId: '' };
  return { success: true, reservationId: 'res-' + Date.now() };
}

export function getAdminListings(statusFilter?: string): Car[] {
  if (!statusFilter || statusFilter === 'all') return [...baseCars];
  return baseCars.filter((c) => c.status === statusFilter);
}

export function saveCarListingFixture(): { success: boolean; carId: string } {
  if (saveListingOutcome === 'fail') return { success: false, carId: '' };
  return { success: true, carId: 'car-' + Date.now() };
}

export function markCarSoldFixture(): { success: boolean } {
  if (markSoldOutcome === 'fail') return { success: false };
  return { success: true };
}

export function deleteCarListingFixture(): { success: boolean } {
  if (deleteListingOutcome === 'fail') return { success: false };
  return { success: true };
}

export function uploadCarPhotoFixture(): { success: boolean; photoUrl: string; photoId: string } {
  return { success: true, photoUrl: 'https://placehold.co/400x300/e2e8f0/475569?text=Uploaded', photoId: 'photo-' + Date.now() };
}

export function getCarsByIds(ids: string[]): Car[] {
  return ids.map((id) => baseCars.find((c) => c.id === id)).filter((c): c is Car => c !== undefined);
}
