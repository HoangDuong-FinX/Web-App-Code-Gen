import type { Car, Brand, BodyType } from '../types';

const sampleDealer = {
  id: 'dealer-01',
  name: 'AutoMart Sài Gòn',
  rating: 4.8,
  location: 'Quận 7, TP. Hồ Chí Minh',
  avatarUrl: 'https://placehold.co/80x80/1e40af/ffffff?text=AM',
  phone: '0901234567',
};

const samplePhotos = [
  { url: 'https://placehold.co/800x500/374151/ffffff?text=Photo+1', thumbnailUrl: 'https://placehold.co/200x140/374151/ffffff?text=1' },
  { url: 'https://placehold.co/800x500/4b5563/ffffff?text=Photo+2', thumbnailUrl: 'https://placehold.co/200x140/4b5563/ffffff?text=2' },
  { url: 'https://placehold.co/800x500/6b7280/ffffff?text=Photo+3', thumbnailUrl: 'https://placehold.co/200x140/6b7280/ffffff?text=3' },
  { url: 'https://placehold.co/800x500/9ca3af/ffffff?text=Photo+4', thumbnailUrl: 'https://placehold.co/200x140/9ca3af/ffffff?text=4' },
];

export const featuredCars: Car[] = [
  {
    id: 'car-001', name: 'Toyota Camry 2024', price: 1150000000, thumbnail: 'https://placehold.co/400x260/1e3a5f/ffffff?text=Camry+2024',
    brand: 'Toyota', model: 'Camry', year: 2024, mileage: 0, fuelType: 'Xăng', transmission: 'Tự động',
    engine: '2.5L 4 xi-lanh', exteriorColor: 'Trắng ngọc trai', interiorColor: 'Đen', condition: 'new', tag: 'Mới',
    description: 'Toyota Camry 2024 thế hệ mới với thiết kế sang trọng, động cơ mạnh mẽ và hệ thống an toàn tiên tiến.',
    photos: samplePhotos, dealer: sampleDealer, features: ['Cruise Control', 'Cảm biến lùi', 'Camera 360'], dimensions: '4885 x 1840 x 1445 mm',
  },
  {
    id: 'car-002', name: 'Honda CR-V 2024', price: 1100000000, thumbnail: 'https://placehold.co/400x260/1a4731/ffffff?text=CR-V+2024',
    brand: 'Honda', model: 'CR-V', year: 2024, mileage: 0, fuelType: 'Xăng', transmission: 'Tự động',
    engine: '1.5L Turbo', exteriorColor: 'Xám', interiorColor: 'Kem', condition: 'new', tag: 'Mới',
    description: 'Honda CR-V 2024 SUV gia đình với không gian rộng rãi và tiết kiệm nhiên liệu.',
    photos: samplePhotos, dealer: sampleDealer, features: ['Honda Sensing', 'Ghế chỉnh điện', 'Cửa sổ trời'], dimensions: '4694 x 1855 x 1679 mm',
  },
  {
    id: 'car-003', name: 'Mercedes C300 AMG 2023', price: 1950000000, thumbnail: 'https://placehold.co/400x260/2d1b4e/ffffff?text=C300+AMG',
    brand: 'Mercedes-Benz', model: 'C300 AMG', year: 2023, mileage: 12000, fuelType: 'Xăng', transmission: 'Tự động',
    engine: '2.0L Turbo', exteriorColor: 'Đen', interiorColor: 'Đỏ', condition: 'used', tag: 'Đã qua sử dụng',
    description: 'Mercedes C300 AMG 2023 với gói thể thao AMG Line, nội thất sang trọng.',
    photos: samplePhotos, dealer: { ...sampleDealer, id: 'dealer-02', name: 'Premium Auto' },
    features: ['AMG Line', 'MBUX', 'Đèn LED thích ứng'], dimensions: '4751 x 1820 x 1438 mm',
  },
  {
    id: 'car-004', name: 'VinFast VF 8 2024', price: 1060000000, thumbnail: 'https://placehold.co/400x260/7f1d1d/ffffff?text=VF8+2024',
    brand: 'VinFast', model: 'VF 8', year: 2024, mileage: 0, fuelType: 'Điện', transmission: 'Tự động',
    engine: 'Động cơ điện kép', exteriorColor: 'Xanh dương', interiorColor: 'Đen', condition: 'new', tag: 'Khuyến mãi',
    description: 'VinFast VF 8 - SUV điện thông minh với công nghệ tự lái cấp độ 2.',
    photos: samplePhotos, dealer: { ...sampleDealer, id: 'dealer-03', name: 'VinFast Thủ Đức' },
    features: ['Tự lái L2', 'Màn hình 15.6"', 'Sạc nhanh'], dimensions: '4750 x 1900 x 1660 mm',
  },
  {
    id: 'car-005', name: 'Mazda CX-5 2024', price: 840000000, thumbnail: 'https://placehold.co/400x260/713f12/ffffff?text=CX-5+2024',
    brand: 'Mazda', model: 'CX-5', year: 2024, mileage: 0, fuelType: 'Xăng', transmission: 'Tự động',
    engine: '2.0L SkyActiv-G', exteriorColor: 'Đỏ pha lê', interiorColor: 'Đen', condition: 'new',
    description: 'Mazda CX-5 2024 với thiết kế KODO đẳng cấp và vận hành mượt mà.',
    photos: samplePhotos, dealer: sampleDealer, features: ['i-Activsense', 'GVC Plus', 'Bose 10 loa'], dimensions: '4575 x 1845 x 1680 mm',
  },
  {
    id: 'car-006', name: 'Hyundai Tucson 2023', price: 780000000, thumbnail: 'https://placehold.co/400x260/1e3a5f/ffffff?text=Tucson+2023',
    brand: 'Hyundai', model: 'Tucson', year: 2023, mileage: 8000, fuelType: 'Xăng', transmission: 'Tự động',
    engine: '2.0L MPI', exteriorColor: 'Bạc', interiorColor: 'Xám', condition: 'used',
    description: 'Hyundai Tucson 2023 thiết kế mới, tiện nghi đầy đủ, giá hấp dẫn.',
    photos: samplePhotos, dealer: { ...sampleDealer, id: 'dealer-02', name: 'Premium Auto' },
    features: ['SmartSense', 'Sạc không dây', 'Đèn LED'], dimensions: '4630 x 1865 x 1665 mm',
  },
];

export const brands: Brand[] = [
  { id: 'toyota', name: 'Toyota', logoUrl: 'https://placehold.co/60x60/dc2626/ffffff?text=T' },
  { id: 'honda', name: 'Honda', logoUrl: 'https://placehold.co/60x60/1d4ed8/ffffff?text=H' },
  { id: 'mercedes', name: 'Mercedes', logoUrl: 'https://placehold.co/60x60/111827/ffffff?text=M' },
  { id: 'vinfast', name: 'VinFast', logoUrl: 'https://placehold.co/60x60/15803d/ffffff?text=VF' },
  { id: 'mazda', name: 'Mazda', logoUrl: 'https://placehold.co/60x60/7c2d12/ffffff?text=Mz' },
  { id: 'hyundai', name: 'Hyundai', logoUrl: 'https://placehold.co/60x60/1e40af/ffffff?text=Hy' },
];

export const bodyTypes: BodyType[] = [
  { id: 'sedan', label: 'Sedan', iconUrl: 'https://placehold.co/60x40/6b7280/ffffff?text=Sedan' },
  { id: 'suv', label: 'SUV', iconUrl: 'https://placehold.co/60x40/6b7280/ffffff?text=SUV' },
  { id: 'hatchback', label: 'Hatchback', iconUrl: 'https://placehold.co/60x40/6b7280/ffffff?text=Hatch' },
  { id: 'pickup', label: 'Bán tải', iconUrl: 'https://placehold.co/60x40/6b7280/ffffff?text=Pickup' },
  { id: 'mpv', label: 'MPV', iconUrl: 'https://placehold.co/60x40/6b7280/ffffff?text=MPV' },
];

export function getAllCars(): Car[] {
  return featuredCars;
}

export function getCarById(id: string): Car | undefined {
  return featuredCars.find(c => c.id === id);
}

export function searchCars(keyword: string, filters: Record<string, string>): { results: Car[]; totalCount: number } {
  let results = [...featuredCars];
  if (keyword) {
    const kw = keyword.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(kw) ||
      c.brand.toLowerCase().includes(kw) ||
      c.model.toLowerCase().includes(kw)
    );
  }
  if (filters.brand) {
    results = results.filter(c => c.brand.toLowerCase() === filters.brand.toLowerCase());
  }
  if (filters.fuelType) {
    results = results.filter(c => c.fuelType === filters.fuelType);
  }
  if (filters.condition) {
    results = results.filter(c => c.condition === filters.condition);
  }
  if (filters.sort) {
    switch (filters.sort) {
      case 'price-asc': results.sort((a, b) => a.price - b.price); break;
      case 'price-desc': results.sort((a, b) => b.price - a.price); break;
      case 'year': results.sort((a, b) => b.year - a.year); break;
      case 'mileage': results.sort((a, b) => a.mileage - b.mileage); break;
    }
  }
  return { results, totalCount: results.length };
}

export type FixtureOutcome = 'success' | 'fail';
let toggleWishlistOutcome: FixtureOutcome = 'success';
export function setToggleWishlistOutcome(o: FixtureOutcome): void { toggleWishlistOutcome = o; }
export function getToggleWishlistOutcome(): FixtureOutcome { return toggleWishlistOutcome; }
