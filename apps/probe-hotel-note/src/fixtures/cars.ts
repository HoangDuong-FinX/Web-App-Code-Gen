import type { Car } from '../types';

let saveOutcome: 'success' | 'fail' = 'success';
export function setSaveOutcome(o: 'success' | 'fail'): void { saveOutcome = o; }
export function getSaveOutcome(): 'success' | 'fail' { return saveOutcome; }

let submitInquiryOutcome: 'success' | 'fail' = 'success';
export function setSubmitInquiryOutcome(o: 'success' | 'fail'): void { submitInquiryOutcome = o; }
export function getSubmitInquiryOutcome(): 'success' | 'fail' { return submitInquiryOutcome; }

let submitReservationOutcome: 'success' | 'fail' = 'success';
export function setSubmitReservationOutcome(o: 'success' | 'fail'): void { submitReservationOutcome = o; }
export function getSubmitReservationOutcome(): 'success' | 'fail' { return submitReservationOutcome; }

export const FIXTURE_CARS: Car[] = [
  {
    id: 'car-001',
    brand: 'Toyota',
    model: 'Camry',
    name: 'Toyota Camry 2.5Q',
    year: 2024,
    condition: 'new',
    color: 'Tr\u1eafng',
    seats: 5,
    mileage: 0,
    fuelType: 'gasoline',
    transmission: 'automatic',
    engineCapacity: '2.5L',
    price: 1405000000,
    promoPrice: 1350000000,
    description: 'Toyota Camry 2.5Q 2024 - Sedan h\u1ea1ng D h\u00e0ng \u0111\u1ea7u v\u1edbi n\u1ed9i th\u1ea5t sang tr\u1ecdng, \u0111\u1ed9ng c\u01a1 m\u1ea1nh m\u1ebd v\u00e0 h\u1ec7 th\u1ed1ng an to\u00e0n Toyota Safety Sense.',
    photos: ['https://placehold.co/800x600/e2e8f0/475569?text=Camry+Front', 'https://placehold.co/800x600/e2e8f0/475569?text=Camry+Side', 'https://placehold.co/800x600/e2e8f0/475569?text=Camry+Interior'],
    status: 'active',
    featured: true,
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'car-002',
    brand: 'Honda',
    model: 'Civic',
    name: 'Honda Civic RS',
    year: 2024,
    condition: 'new',
    color: '\u0110\u1ecf',
    seats: 5,
    mileage: 0,
    fuelType: 'gasoline',
    transmission: 'automatic',
    engineCapacity: '1.5L Turbo',
    price: 870000000,
    promoPrice: null,
    description: 'Honda Civic RS 2024 - Sedan th\u1ec3 thao v\u1edbi \u0111\u1ed9ng c\u01a1 1.5L VTEC Turbo, thi\u1ebft k\u1ebf hi\u1ec7n \u0111\u1ea1i v\u00e0 c\u00f4ng ngh\u1ec7 Honda SENSING.',
    photos: ['https://placehold.co/800x600/fee2e2/991b1b?text=Civic+Front', 'https://placehold.co/800x600/fee2e2/991b1b?text=Civic+Interior'],
    status: 'active',
    featured: true,
    createdAt: '2024-11-28T08:00:00Z',
  },
  {
    id: 'car-003',
    brand: 'Hyundai',
    model: 'Tucson',
    name: 'Hyundai Tucson 2.0 \u0110\u1eb7c bi\u1ec7t',
    year: 2023,
    condition: 'used',
    color: 'X\u00e1m',
    seats: 5,
    mileage: 15000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    engineCapacity: '2.0L',
    price: 920000000,
    promoPrice: 880000000,
    description: 'Hyundai Tucson 2023 - SUV \u0111\u00f4 th\u1ecb v\u1edbi thi\u1ebft k\u1ebf \u1ea5n t\u01b0\u1ee3ng, n\u1ed9i th\u1ea5t r\u1ed9ng r\u00e3i. Xe \u0111\u00e3 qua s\u1eed d\u1ee5ng, t\u00ecnh tr\u1ea1ng t\u1ed1t.',
    photos: ['https://placehold.co/800x600/e0e7ff/3730a3?text=Tucson+Front', 'https://placehold.co/800x600/e0e7ff/3730a3?text=Tucson+Rear'],
    status: 'active',
    featured: true,
    createdAt: '2024-11-25T14:00:00Z',
  },
  {
    id: 'car-004',
    brand: 'Mazda',
    model: 'CX-5',
    name: 'Mazda CX-5 Premium',
    year: 2024,
    condition: 'new',
    color: '\u0110en',
    seats: 5,
    mileage: 0,
    fuelType: 'gasoline',
    transmission: 'automatic',
    engineCapacity: '2.0L',
    price: 979000000,
    promoPrice: null,
    description: 'Mazda CX-5 Premium 2024 - SUV sang tr\u1ecdng v\u1edbi tri\u1ebft l\u00fd thi\u1ebft k\u1ebf KODO, n\u1ed9i th\u1ea5t tinh t\u1ebf v\u00e0 kh\u1ea3 n\u0103ng v\u1eadn h\u00e0nh \u00eam \u00e1i.',
    photos: ['https://placehold.co/800x600/fef3c7/92400e?text=CX5+Front'],
    status: 'active',
    featured: false,
    createdAt: '2024-12-05T09:00:00Z',
  },
  {
    id: 'car-005',
    brand: 'VinFast',
    model: 'VF 8',
    name: 'VinFast VF 8 Plus',
    year: 2024,
    condition: 'new',
    color: 'Xanh',
    seats: 5,
    mileage: 0,
    fuelType: 'electric',
    transmission: 'automatic',
    engineCapacity: 'N/A',
    price: 1259000000,
    promoPrice: 1159000000,
    description: 'VinFast VF 8 Plus 2024 - SUV \u0111i\u1ec7n th\u00f4ng minh v\u1edbi t\u1ea7m ho\u1ea1t \u0111\u1ed9ng l\u00ean \u0111\u1ebfn 471 km, c\u00f4ng su\u1ea5t 402 m\u00e3 l\u1ef1c.',
    photos: ['https://placehold.co/800x600/d1fae5/065f46?text=VF8+Front', 'https://placehold.co/800x600/d1fae5/065f46?text=VF8+Side'],
    status: 'active',
    featured: true,
    createdAt: '2024-12-10T11:00:00Z',
  },
  {
    id: 'car-006',
    brand: 'Kia',
    model: 'Seltos',
    name: 'Kia Seltos 1.6 Luxury',
    year: 2023,
    condition: 'used',
    color: 'Tr\u1eafng',
    seats: 5,
    mileage: 22000,
    fuelType: 'gasoline',
    transmission: 'automatic',
    engineCapacity: '1.6L',
    price: 650000000,
    promoPrice: null,
    description: 'Kia Seltos 2023 - SUV c\u1ee1 nh\u1ecf ti\u1ebft ki\u1ec7m nhi\u00ean li\u1ec7u, ph\u00f9 h\u1ee3p di chuy\u1ec3n \u0111\u00f4 th\u1ecb. \u0110\u00e3 qua s\u1eed d\u1ee5ng, b\u1ea3o d\u01b0\u1ee1ng \u0111\u1ea7y \u0111\u1ee7.',
    photos: ['https://placehold.co/800x600/fce7f3/9d174d?text=Seltos+Front'],
    status: 'sold',
    featured: false,
    createdAt: '2024-10-15T07:00:00Z',
  },
  {
    id: 'car-007',
    brand: 'Ford',
    model: 'Ranger',
    name: 'Ford Ranger Wildtrak 2.0L',
    year: 2024,
    condition: 'new',
    color: 'Cam',
    seats: 5,
    mileage: 0,
    fuelType: 'diesel',
    transmission: 'automatic',
    engineCapacity: '2.0L Bi-Turbo',
    price: 1069000000,
    promoPrice: null,
    description: 'Ford Ranger Wildtrak 2024 - B\u00e1n t\u1ea3i m\u1ea1nh m\u1ebd v\u1edbi \u0111\u1ed9ng c\u01a1 Bi-Turbo, h\u1ec7 th\u1ed1ng treo \u0111\u1ed9c l\u1eadp v\u00e0 trang b\u1ecb off-road chuy\u00ean nghi\u1ec7p.',
    photos: ['https://placehold.co/800x600/fff7ed/9a3412?text=Ranger+Front'],
    status: 'draft',
    featured: false,
    createdAt: '2024-12-12T15:00:00Z',
  },
];

export function formatPrice(price: number): string {
  if (price >= 1000000000) {
    const billions = price / 1000000000;
    return `${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(3)} t\u1ef7 VN\u0110`;
  }
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${millions.toFixed(0)} tri\u1ec7u VN\u0110`;
  }
  return `${price.toLocaleString('vi-VN')} VN\u0110`;
}

export function formatMileage(km: number): string {
  return km.toLocaleString('vi-VN');
}
