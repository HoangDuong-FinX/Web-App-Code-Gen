import type { Car, Favorite, AvailableSlot, InventoryCar } from "../types";

const PHOTO_BASE = "https://placehold.co/600x400/e2e8f0/475569?text=";

function carPhoto(name: string): string {
  return `${PHOTO_BASE}${encodeURIComponent(name)}`;
}

export const sampleCars: Car[] = [
  {
    id: "car-001",
    make: "Toyota",
    model: "Camry",
    year: 2024,
    price: 850000000,
    currency: "VND",
    priceNegotiable: true,
    thumbnailUrl: carPhoto("Toyota+Camry"),
    summarySpecs: "2.5L, Automatic, Gasoline, 15,000 km",
    photos: [
      { url: carPhoto("Camry+Front"), alt: "Toyota Camry front view" },
      { url: carPhoto("Camry+Side"), alt: "Toyota Camry side view" },
      { url: carPhoto("Camry+Interior"), alt: "Toyota Camry interior" },
    ],
    engine: "2.5L 4-Cylinder",
    transmission: "Automatic",
    fuelType: "Gasoline",
    mileage: 15000,
    color: "Pearl White",
    interior: "Black Leather",
    features: ["Sunroof", "Lane Assist", "Apple CarPlay", "Heated Seats", "Blind Spot Monitor"],
    seller: { name: "Saigon Auto Center", contact: "0901-234-567" },
    status: "available",
  },
  {
    id: "car-002",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    price: 1050000000,
    currency: "VND",
    priceNegotiable: false,
    thumbnailUrl: carPhoto("Honda+CRV"),
    summarySpecs: "1.5L Turbo, CVT, Gasoline, 22,000 km",
    photos: [
      { url: carPhoto("CRV+Front"), alt: "Honda CR-V front view" },
      { url: carPhoto("CRV+Side"), alt: "Honda CR-V side view" },
      { url: carPhoto("CRV+Interior"), alt: "Honda CR-V interior" },
    ],
    engine: "1.5L Turbo",
    transmission: "CVT",
    fuelType: "Gasoline",
    mileage: 22000,
    color: "Crystal Black",
    interior: "Ivory Leather",
    features: ["Honda Sensing", "Wireless CarPlay", "Power Tailgate", "Panoramic Roof"],
    seller: { name: "Honda Vietnam Dealer", contact: "0902-345-678" },
    status: "available",
  },
  {
    id: "car-003",
    make: "Hyundai",
    model: "Tucson",
    year: 2024,
    price: 920000000,
    currency: "VND",
    priceNegotiable: true,
    thumbnailUrl: carPhoto("Hyundai+Tucson"),
    summarySpecs: "2.0L, Automatic, Gasoline, 8,000 km",
    photos: [
      { url: carPhoto("Tucson+Front"), alt: "Hyundai Tucson front view" },
      { url: carPhoto("Tucson+Side"), alt: "Hyundai Tucson side view" },
      { url: carPhoto("Tucson+Interior"), alt: "Hyundai Tucson interior" },
    ],
    engine: "2.0L SmartStream",
    transmission: "6-Speed Automatic",
    fuelType: "Gasoline",
    mileage: 8000,
    color: "Shimmering Silver",
    interior: "Gray Fabric",
    features: ["SmartSense Safety", "10.25 Touchscreen", "Wireless Charging", "LED Headlights"],
    seller: { name: "TC Motor Showroom", contact: "0903-456-789" },
    status: "available",
  },
  {
    id: "car-004",
    make: "Mercedes-Benz",
    model: "C200",
    year: 2023,
    price: 1680000000,
    currency: "VND",
    priceNegotiable: true,
    thumbnailUrl: carPhoto("Mercedes+C200"),
    summarySpecs: "1.5L Turbo, 9G-TRONIC, Gasoline, 12,000 km",
    photos: [
      { url: carPhoto("C200+Front"), alt: "Mercedes C200 front view" },
      { url: carPhoto("C200+Side"), alt: "Mercedes C200 side view" },
      { url: carPhoto("C200+Interior"), alt: "Mercedes C200 interior" },
    ],
    engine: "1.5L Turbo + EQ Boost",
    transmission: "9G-TRONIC",
    fuelType: "Gasoline",
    mileage: 12000,
    color: "Obsidian Black",
    interior: "Beige Leather",
    features: ["MBUX System", "Burmester Sound", "64-Color Ambient Light", "Digital Cockpit", "Parking Assist"],
    seller: { name: "Mercedes Vietnam", contact: "0904-567-890" },
    status: "available",
  },
  {
    id: "car-005",
    make: "VinFast",
    model: "VF 8",
    year: 2024,
    price: 1130000000,
    currency: "VND",
    priceNegotiable: false,
    thumbnailUrl: carPhoto("VinFast+VF8"),
    summarySpecs: "Electric, Automatic, 5,000 km",
    photos: [
      { url: carPhoto("VF8+Front"), alt: "VinFast VF 8 front view" },
      { url: carPhoto("VF8+Side"), alt: "VinFast VF 8 side view" },
      { url: carPhoto("VF8+Interior"), alt: "VinFast VF 8 interior" },
    ],
    engine: "Electric Dual Motor",
    transmission: "Single-Speed Automatic",
    fuelType: "Electric",
    mileage: 5000,
    color: "Brazen Blue",
    interior: "Vegan Leather Black",
    features: ["ADAS Suite", "15.6 Touchscreen", "V2L Charging", "OTA Updates", "Smart Summon"],
    seller: { name: "VinFast Store", contact: "0905-678-901" },
    status: "available",
  },
  {
    id: "car-006",
    make: "Mazda",
    model: "CX-5",
    year: 2023,
    price: 780000000,
    currency: "VND",
    priceNegotiable: true,
    thumbnailUrl: carPhoto("Mazda+CX5"),
    summarySpecs: "2.0L SkyActiv, Automatic, Gasoline, 30,000 km",
    photos: [
      { url: carPhoto("CX5+Front"), alt: "Mazda CX-5 front view" },
      { url: carPhoto("CX5+Side"), alt: "Mazda CX-5 side view" },
      { url: carPhoto("CX5+Interior"), alt: "Mazda CX-5 interior" },
    ],
    engine: "2.0L SkyActiv-G",
    transmission: "6-Speed Automatic",
    fuelType: "Gasoline",
    mileage: 30000,
    color: "Soul Red Crystal",
    interior: "Parchment Leather",
    features: ["i-Activsense", "Bose Sound", "Head-Up Display", "360 Camera"],
    seller: { name: "Thaco Mazda", contact: "0906-789-012" },
    status: "available",
  },
];

export function getCarById(id: string): Car | undefined {
  return sampleCars.find((c) => c.id === id);
}

export function toFavorite(car: Car): Favorite {
  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    currency: car.currency,
    thumbnailUrl: car.thumbnailUrl,
  };
}

export const sampleAvailableSlots: AvailableSlot[] = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false },
  { time: "16:00", available: true },
];

export const sampleInventory: InventoryCar[] = sampleCars.map((c) => ({
  id: c.id,
  make: c.make,
  model: c.model,
  year: c.year,
  price: c.price,
  status: c.status,
  thumbnailUrl: c.thumbnailUrl,
}));

type OutcomeSwitch = "success" | "fail";

let _loadCatalogOutcome: OutcomeSwitch = "success";
let _saveFavoriteOutcome: OutcomeSwitch = "success";
let _removeFavoriteOutcome: OutcomeSwitch = "success";
let _submitTestDriveOutcome: OutcomeSwitch = "success";
let _submitInquiryOutcome: OutcomeSwitch = "success";
let _submitCarChangesOutcome: OutcomeSwitch = "success";
let _deleteCarOutcome: OutcomeSwitch = "success";
let _submitResponseOutcome: OutcomeSwitch = "success";

export function setLoadCatalogOutcome(o: OutcomeSwitch): void { _loadCatalogOutcome = o; }
export function setSaveFavoriteOutcome(o: OutcomeSwitch): void { _saveFavoriteOutcome = o; }
export function setRemoveFavoriteOutcome(o: OutcomeSwitch): void { _removeFavoriteOutcome = o; }
export function setSubmitTestDriveOutcome(o: OutcomeSwitch): void { _submitTestDriveOutcome = o; }
export function setSubmitInquiryOutcome(o: OutcomeSwitch): void { _submitInquiryOutcome = o; }
export function setSubmitCarChangesOutcome(o: OutcomeSwitch): void { _submitCarChangesOutcome = o; }
export function setDeleteCarOutcome(o: OutcomeSwitch): void { _deleteCarOutcome = o; }
export function setSubmitResponseOutcome(o: OutcomeSwitch): void { _submitResponseOutcome = o; }

export function getLoadCatalogOutcome(): OutcomeSwitch { return _loadCatalogOutcome; }
export function getSaveFavoriteOutcome(): OutcomeSwitch { return _saveFavoriteOutcome; }
export function getRemoveFavoriteOutcome(): OutcomeSwitch { return _removeFavoriteOutcome; }
export function getSubmitTestDriveOutcome(): OutcomeSwitch { return _submitTestDriveOutcome; }
export function getSubmitInquiryOutcome(): OutcomeSwitch { return _submitInquiryOutcome; }
export function getSubmitCarChangesOutcome(): OutcomeSwitch { return _submitCarChangesOutcome; }
export function getDeleteCarOutcome(): OutcomeSwitch { return _deleteCarOutcome; }
export function getSubmitResponseOutcome(): OutcomeSwitch { return _submitResponseOutcome; }