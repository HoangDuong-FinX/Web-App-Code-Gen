import type { Car, Promotion } from "../types";

const dealer1 = {
  name: "Vikki Auto Quận 1",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  phone: "028-1234-5678",
};

const dealer2 = {
  name: "Vikki Auto Quận 7",
  address: "456 Nguyễn Văn Linh, Quận 7, TP.HCM",
  phone: "028-8765-4321",
};

const baseSpecs = [
  { label: "Động cơ", value: "1.5L Turbo" },
  { label: "Công suất", value: "170 mã lực" },
  { label: "Hộp số", value: "Tự động CVT" },
  { label: "Nhiên liệu", value: "Xăng" },
  { label: "Số chỗ", value: "5" },
];

export const featuredCars: Car[] = [
  {
    id: "car-001",
    name: "Honda Civic RS 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Civic+RS",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Civic+RS+1", label: "Mặt trước" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Civic+RS+2", label: "Mặt bên" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Civic+RS+3", label: "Nội thất" },
    ],
    formattedPrice: "870.000.000 ₫",
    price: 870000000,
    condition: "Mới",
    specsSummary: "1.5L Turbo | CVT | Xăng",
    specs: baseSpecs,
    bodyType: "Sedan",
    make: "Honda",
    fuelType: "Xăng",
    transmission: "Tự động",
    year: 2024,
    monthlyInstallment: "12.500.000 ₫",
    promoLabel: "Giảm 30 triệu",
    hasActivePromo: true,
    status: "available",
    dealer: dealer1,
    isInCompare: false,
  },
  {
    id: "car-002",
    name: "Toyota Camry 2.5Q 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Camry+2.5Q",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Camry+1", label: "Mặt trước" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Camry+2", label: "Mặt bên" },
    ],
    formattedPrice: "1.310.000.000 ₫",
    price: 1310000000,
    condition: "Mới",
    specsSummary: "2.5L | 8AT | Xăng",
    specs: [
      { label: "Động cơ", value: "2.5L" },
      { label: "Công suất", value: "207 mã lực" },
      { label: "Hộp số", value: "Tự động 8 cấp" },
      { label: "Nhiên liệu", value: "Xăng" },
      { label: "Số chỗ", value: "5" },
    ],
    bodyType: "Sedan",
    make: "Toyota",
    fuelType: "Xăng",
    transmission: "Tự động",
    year: 2024,
    monthlyInstallment: "18.800.000 ₫",
    promoLabel: "",
    hasActivePromo: false,
    status: "available",
    dealer: dealer2,
    isInCompare: false,
  },
  {
    id: "car-003",
    name: "Mazda CX-5 Premium 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=CX-5+Premium",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=CX5+1", label: "Mặt trước" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=CX5+2", label: "Mặt bên" },
    ],
    formattedPrice: "979.000.000 ₫",
    price: 979000000,
    condition: "Mới",
    specsSummary: "2.0L | 6AT | Xăng",
    specs: [
      { label: "Động cơ", value: "2.0L Skyactiv-G" },
      { label: "Công suất", value: "154 mã lực" },
      { label: "Hộp số", value: "Tự động 6 cấp" },
      { label: "Nhiên liệu", value: "Xăng" },
      { label: "Số chỗ", value: "5" },
    ],
    bodyType: "SUV",
    make: "Mazda",
    fuelType: "Xăng",
    transmission: "Tự động",
    year: 2024,
    monthlyInstallment: "14.000.000 ₫",
    promoLabel: "Tặng phụ kiện 20 triệu",
    hasActivePromo: true,
    status: "available",
    dealer: dealer1,
    isInCompare: false,
  },
  {
    id: "car-004",
    name: "Ford Ranger Wildtrak 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Ranger+Wildtrak",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Ranger+1", label: "Mặt trước" },
    ],
    formattedPrice: "1.049.000.000 ₫",
    price: 1049000000,
    condition: "Mới",
    specsSummary: "2.0L Bi-Turbo | 10AT | Diesel",
    specs: [
      { label: "Động cơ", value: "2.0L Bi-Turbo" },
      { label: "Công suất", value: "210 mã lực" },
      { label: "Hộp số", value: "Tự động 10 cấp" },
      { label: "Nhiên liệu", value: "Diesel" },
      { label: "Số chỗ", value: "5" },
    ],
    bodyType: "Truck",
    make: "Ford",
    fuelType: "Diesel",
    transmission: "Tự động",
    year: 2024,
    monthlyInstallment: "15.200.000 ₫",
    promoLabel: "",
    hasActivePromo: false,
    status: "available",
    dealer: dealer2,
    isInCompare: false,
  },
  {
    id: "car-005",
    name: "VinFast VF 8 Plus 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=VF8+Plus",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=VF8+1", label: "Mặt trước" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=VF8+2", label: "Nội thất" },
    ],
    formattedPrice: "1.199.000.000 ₫",
    price: 1199000000,
    condition: "Mới",
    specsSummary: "Điện | 1 cấp | 402 mã lực",
    specs: [
      { label: "Động cơ", value: "Điện" },
      { label: "Công suất", value: "402 mã lực" },
      { label: "Hộp số", value: "1 cấp" },
      { label: "Nhiên liệu", value: "Điện" },
      { label: "Số chỗ", value: "5" },
    ],
    bodyType: "SUV",
    make: "VinFast",
    fuelType: "Điện",
    transmission: "Tự động",
    year: 2024,
    monthlyInstallment: "17.500.000 ₫",
    promoLabel: "",
    hasActivePromo: false,
    status: "reserved",
    dealer: dealer1,
    isInCompare: false,
  },
  {
    id: "car-006",
    name: "Hyundai Tucson 2.0 Đặc biệt 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Tucson+2.0",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Tucson+1", label: "Mặt trước" },
    ],
    formattedPrice: "920.000.000 ₫",
    price: 920000000,
    condition: "Mới",
    specsSummary: "2.0L | 6AT | Xăng",
    specs: [
      { label: "Động cơ", value: "2.0L" },
      { label: "Công suất", value: "156 mã lực" },
      { label: "Hộp số", value: "Tự động 6 cấp" },
      { label: "Nhiên liệu", value: "Xăng" },
      { label: "Số chỗ", value: "5" },
    ],
    bodyType: "SUV",
    make: "Hyundai",
    fuelType: "Xăng",
    transmission: "Tự động",
    year: 2024,
    monthlyInstallment: "13.200.000 ₫",
    promoLabel: "Giảm 50 triệu",
    hasActivePromo: true,
    status: "available",
    dealer: dealer2,
    isInCompare: false,
  },
];

export function getCarById(id: string): Car | undefined {
  return featuredCars.find((c) => c.id === id);
}

export function searchCars(query: string): Car[] {
  const q = query.toLowerCase();
  return featuredCars.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.make.toLowerCase().includes(q) ||
      c.bodyType.toLowerCase().includes(q),
  );
}

export function filterCars(bodyType?: string | null): Car[] {
  if (!bodyType) return [...featuredCars];
  return featuredCars.filter(
    (c) => c.bodyType.toLowerCase() === bodyType.toLowerCase(),
  );
}
