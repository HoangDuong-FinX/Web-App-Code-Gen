import type { Car } from "../types";

const dealer1 = {
  name: "Vikki Auto Qu\u1eadn 1",
  address: "123 Nguy\u1ec5n Hu\u1ec7, Qu\u1eadn 1, TP.HCM",
  phone: "028-1234-5678",
};

const dealer2 = {
  name: "Vikki Auto Qu\u1eadn 7",
  address: "456 Nguy\u1ec5n V\u0103n Linh, Qu\u1eadn 7, TP.HCM",
  phone: "028-8765-4321",
};

const baseSpecs = [
  { label: "\u0110\u1ed9ng c\u01a1", value: "1.5L Turbo" },
  { label: "C\u00f4ng su\u1ea5t", value: "170 m\u00e3 l\u1ef1c" },
  { label: "H\u1ed9p s\u1ed1", value: "T\u1ef1 \u0111\u1ed9ng CVT" },
  { label: "Nhi\u00ean li\u1ec7u", value: "X\u0103ng" },
  { label: "S\u1ed1 ch\u1ed7", value: "5" },
];

export const featuredCars: Car[] = [
  {
    id: "car-001",
    name: "Honda Civic RS 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Civic+RS",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Civic+RS+1", label: "M\u1eb7t tr\u01b0\u1edbc" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Civic+RS+2", label: "M\u1eb7t b\u00ean" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Civic+RS+3", label: "N\u1ed9i th\u1ea5t" },
    ],
    formattedPrice: "870.000.000 \u20ab",
    price: 870000000,
    condition: "M\u1edbi",
    specsSummary: "1.5L Turbo | CVT | X\u0103ng",
    specs: baseSpecs,
    bodyType: "Sedan",
    make: "Honda",
    fuelType: "X\u0103ng",
    transmission: "T\u1ef1 \u0111\u1ed9ng",
    year: 2024,
    monthlyInstallment: "12.500.000 \u20ab",
    promoLabel: "Gi\u1ea3m 30 tri\u1ec7u",
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
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Camry+1", label: "M\u1eb7t tr\u01b0\u1edbc" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Camry+2", label: "M\u1eb7t b\u00ean" },
    ],
    formattedPrice: "1.310.000.000 \u20ab",
    price: 1310000000,
    condition: "M\u1edbi",
    specsSummary: "2.5L | 8AT | X\u0103ng",
    specs: [
      { label: "\u0110\u1ed9ng c\u01a1", value: "2.5L" },
      { label: "C\u00f4ng su\u1ea5t", value: "207 m\u00e3 l\u1ef1c" },
      { label: "H\u1ed9p s\u1ed1", value: "T\u1ef1 \u0111\u1ed9ng 8 c\u1ea5p" },
      { label: "Nhi\u00ean li\u1ec7u", value: "X\u0103ng" },
      { label: "S\u1ed1 ch\u1ed7", value: "5" },
    ],
    bodyType: "Sedan",
    make: "Toyota",
    fuelType: "X\u0103ng",
    transmission: "T\u1ef1 \u0111\u1ed9ng",
    year: 2024,
    monthlyInstallment: "18.800.000 \u20ab",
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
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=CX5+1", label: "M\u1eb7t tr\u01b0\u1edbc" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=CX5+2", label: "M\u1eb7t b\u00ean" },
    ],
    formattedPrice: "979.000.000 \u20ab",
    price: 979000000,
    condition: "M\u1edbi",
    specsSummary: "2.0L | 6AT | X\u0103ng",
    specs: [
      { label: "\u0110\u1ed9ng c\u01a1", value: "2.0L Skyactiv-G" },
      { label: "C\u00f4ng su\u1ea5t", value: "154 m\u00e3 l\u1ef1c" },
      { label: "H\u1ed9p s\u1ed1", value: "T\u1ef1 \u0111\u1ed9ng 6 c\u1ea5p" },
      { label: "Nhi\u00ean li\u1ec7u", value: "X\u0103ng" },
      { label: "S\u1ed1 ch\u1ed7", value: "5" },
    ],
    bodyType: "SUV",
    make: "Mazda",
    fuelType: "X\u0103ng",
    transmission: "T\u1ef1 \u0111\u1ed9ng",
    year: 2024,
    monthlyInstallment: "14.000.000 \u20ab",
    promoLabel: "T\u1eb7ng ph\u1ee5 ki\u1ec7n 20 tri\u1ec7u",
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
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Ranger+1", label: "M\u1eb7t tr\u01b0\u1edbc" },
    ],
    formattedPrice: "1.049.000.000 \u20ab",
    price: 1049000000,
    condition: "M\u1edbi",
    specsSummary: "2.0L Bi-Turbo | 10AT | Diesel",
    specs: [
      { label: "\u0110\u1ed9ng c\u01a1", value: "2.0L Bi-Turbo" },
      { label: "C\u00f4ng su\u1ea5t", value: "210 m\u00e3 l\u1ef1c" },
      { label: "H\u1ed9p s\u1ed1", value: "T\u1ef1 \u0111\u1ed9ng 10 c\u1ea5p" },
      { label: "Nhi\u00ean li\u1ec7u", value: "Diesel" },
      { label: "S\u1ed1 ch\u1ed7", value: "5" },
    ],
    bodyType: "Truck",
    make: "Ford",
    fuelType: "Diesel",
    transmission: "T\u1ef1 \u0111\u1ed9ng",
    year: 2024,
    monthlyInstallment: "15.200.000 \u20ab",
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
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=VF8+1", label: "M\u1eb7t tr\u01b0\u1edbc" },
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=VF8+2", label: "N\u1ed9i th\u1ea5t" },
    ],
    formattedPrice: "1.199.000.000 \u20ab",
    price: 1199000000,
    condition: "M\u1edbi",
    specsSummary: "\u0110i\u1ec7n | 1 c\u1ea5p | 402 m\u00e3 l\u1ef1c",
    specs: [
      { label: "\u0110\u1ed9ng c\u01a1", value: "\u0110i\u1ec7n" },
      { label: "C\u00f4ng su\u1ea5t", value: "402 m\u00e3 l\u1ef1c" },
      { label: "H\u1ed9p s\u1ed1", value: "1 c\u1ea5p" },
      { label: "Nhi\u00ean li\u1ec7u", value: "\u0110i\u1ec7n" },
      { label: "S\u1ed1 ch\u1ed7", value: "5" },
    ],
    bodyType: "SUV",
    make: "VinFast",
    fuelType: "\u0110i\u1ec7n",
    transmission: "T\u1ef1 \u0111\u1ed9ng",
    year: 2024,
    monthlyInstallment: "17.500.000 \u20ab",
    promoLabel: "",
    hasActivePromo: false,
    status: "reserved",
    dealer: dealer1,
    isInCompare: false,
  },
  {
    id: "car-006",
    name: "Hyundai Tucson 2.0 \u0110\u1eb7c bi\u1ec7t 2024",
    thumbnailUrl: "https://placehold.co/400x300/e2e8f0/475569?text=Tucson+2.0",
    photos: [
      { url: "https://placehold.co/800x450/e2e8f0/475569?text=Tucson+1", label: "M\u1eb7t tr\u01b0\u1edbc" },
    ],
    formattedPrice: "920.000.000 \u20ab",
    price: 920000000,
    condition: "M\u1edbi",
    specsSummary: "2.0L | 6AT | X\u0103ng",
    specs: [
      { label: "\u0110\u1ed9ng c\u01a1", value: "2.0L" },
      { label: "C\u00f4ng su\u1ea5t", value: "156 m\u00e3 l\u1ef1c" },
      { label: "H\u1ed9p s\u1ed1", value: "T\u1ef1 \u0111\u1ed9ng 6 c\u1ea5p" },
      { label: "Nhi\u00ean li\u1ec7u", value: "X\u0103ng" },
      { label: "S\u1ed1 ch\u1ed7", value: "5" },
    ],
    bodyType: "SUV",
    make: "Hyundai",
    fuelType: "X\u0103ng",
    transmission: "T\u1ef1 \u0111\u1ed9ng",
    year: 2024,
    monthlyInstallment: "13.200.000 \u20ab",
    promoLabel: "Gi\u1ea3m 50 tri\u1ec7u",
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
