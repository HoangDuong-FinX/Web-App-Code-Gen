// Fixture module for Vikki Flight Booking
// All service calls go through this module when the real backend is not available.
// Each fixture has a deterministic outcome switch so tests can force the failure path.

import type {
  Airport,
  CityPair,
  FlightOffer,
  SearchSession,
  MealOption,
  BaggageOption,
  SeatOption,
  PassengerInfo,
} from '../types';

// --- Outcome switches (export so tests can set them) ---
export type FixtureOutcome = 'success' | 'fail';

let searchOutcome: FixtureOutcome = 'success';
let passengersOutcome: FixtureOutcome = 'success';
let ancillaryOutcome: FixtureOutcome = 'success';
let seatOutcome: FixtureOutcome = 'success';
let paymentInquiryOutcome: FixtureOutcome = 'success';
let paymentOutcome: FixtureOutcome = 'success';
let ancillaryCatalogOutcome: FixtureOutcome = 'success';
let seatMapOutcome: FixtureOutcome = 'success';

export function setSearchOutcome(o: FixtureOutcome) { searchOutcome = o; }
export function setPassengersOutcome(o: FixtureOutcome) { passengersOutcome = o; }
export function setAncillaryOutcome(o: FixtureOutcome) { ancillaryOutcome = o; }
export function setSeatOutcome(o: FixtureOutcome) { seatOutcome = o; }
export function setPaymentInquiryOutcome(o: FixtureOutcome) { paymentInquiryOutcome = o; }
export function setPaymentOutcome(o: FixtureOutcome) { paymentOutcome = o; }
export function setAncillaryCatalogOutcome(o: FixtureOutcome) { ancillaryCatalogOutcome = o; }
export function setSeatMapOutcome(o: FixtureOutcome) { seatMapOutcome = o; }

// --- Static fixture data ---
export const FIXTURE_AIRPORTS: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
  { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'VN', group: 'Popular' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'VN', group: 'Popular' },
  { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Vietnam' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang', country: 'VN', group: 'Vietnam' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phú Quốc', country: 'VN', group: 'Vietnam' },
  { code: 'UIH', name: 'Phù Cát', city: 'Quy Nhơn', country: 'VN', group: 'Vietnam' },
  { code: 'VCA', name: 'Cần Thơ', city: 'Cần Thơ', country: 'VN', group: 'Vietnam' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'SG', group: 'International' },
];

export const FIXTURE_CITY_PAIRS: CityPair[] = [
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'DAD' },
  { origin: 'DAD', destination: 'SGN' },
  { origin: 'SGN', destination: 'DLI' },
  { origin: 'DLI', destination: 'SGN' },
  { origin: 'SGN', destination: 'CXR' },
  { origin: 'CXR', destination: 'SGN' },
  { origin: 'SGN', destination: 'PQC' },
  { origin: 'PQC', destination: 'SGN' },
  { origin: 'HAN', destination: 'DAD' },
  { origin: 'DAD', destination: 'HAN' },
  { origin: 'HAN', destination: 'DLI' },
  { origin: 'DLI', destination: 'HAN' },
  { origin: 'SGN', destination: 'BKK' },
  { origin: 'BKK', destination: 'SGN' },
  { origin: 'SGN', destination: 'SIN' },
  { origin: 'SIN', destination: 'SGN' },
];

function makeOffers(origin: string, destination: string, date: string): FlightOffer[] {
  return [
    {
      offerId: `offer-${origin}-${destination}-eco-${date}`,
      flightNumber: 'VJ123',
      aircraft: 'Airbus A321',
      departureTime: '08:45',
      arrivalTime: '10:30',
      duration: '1h 45m',
      stops: 0,
      fareClass: 'Eco',
      priceAmount: 2_500_000,
      availableSeats: 12,
      baggageInfo: 'Xách tay 7kg và 01 túi xách nhỏ',
      departureDate: date,
      origin,
      destination,
    },
    {
      offerId: `offer-${origin}-${destination}-flex-${date}`,
      flightNumber: 'VJ123',
      aircraft: 'Airbus A321',
      departureTime: '08:45',
      arrivalTime: '10:30',
      duration: '1h 45m',
      stops: 0,
      fareClass: 'Flex',
      priceAmount: 3_200_000,
      availableSeats: 5,
      baggageInfo: 'Xách tay 7kg, 01 túi xách nhỏ và 20kg hành lý ký gửi',
      departureDate: date,
      origin,
      destination,
    },
    {
      offerId: `offer-${origin}-${destination}-eco2-${date}`,
      flightNumber: 'VJ456',
      aircraft: 'Airbus A320',
      departureTime: '14:20',
      arrivalTime: '16:05',
      duration: '1h 45m',
      stops: 0,
      fareClass: 'Eco',
      priceAmount: 2_200_000,
      availableSeats: 20,
      baggageInfo: 'Xách tay 7kg và 01 túi xách nhỏ',
      departureDate: date,
      origin,
      destination,
    },
  ];
}

let sessionCounter = 0;

export async function fixtureSearch(
  origin: string,
  destination: string,
  departureDate: string,
): Promise<SearchSession> {
  await delay(400);
  if (searchOutcome === 'fail') {
    throw new Error('FIXTURE_SEARCH_FAIL');
  }
  sessionCounter += 1;
  const sessionId = `sess_${sessionCounter}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  return {
    sessionId,
    expiresAt,
    offers: makeOffers(origin, destination, departureDate),
  };
}

export async function fixtureLoadAirports(): Promise<Airport[]> {
  await delay(200);
  return FIXTURE_AIRPORTS;
}

export async function fixtureLoadCityPairs(): Promise<CityPair[]> {
  await delay(200);
  return FIXTURE_CITY_PAIRS;
}

export async function fixtureSubmitPassengers(
  _sessionId: string,
  passengers: PassengerInfo[],
): Promise<PassengerInfo[]> {
  await delay(500);
  if (passengersOutcome === 'fail') {
    throw new Error('FIXTURE_PASSENGERS_FAIL');
  }
  return passengers.map((p, i) => ({
    ...p,
    passengerId: `pax_${i + 1}_${Date.now()}`,
  }));
}

export const FIXTURE_MEALS: MealOption[] = [
  { optionId: 'meal_001', name: '🍖 Cơm gà', priceAmount: 150_000, available: true },
  { optionId: 'meal_002', name: '🥗 Cơm chay', priceAmount: 120_000, available: true },
  { optionId: 'meal_003', name: '🍜 Mì hải sản', priceAmount: 130_000, available: true },
];

export const FIXTURE_BAGGAGE: BaggageOption[] = [
  { optionId: 'bag_002', name: 'Hành lý ký gửi +2kg', priceAmount: 200_000, available: true },
  { optionId: 'bag_020', name: 'Hành lý ký gửi 20kg', priceAmount: 500_000, available: true },
  { optionId: 'bag_030', name: 'Hành lý ký gửi 30kg', priceAmount: 700_000, available: true },
];

export async function fixtureLoadAncillaryCatalog(_sessionId: string): Promise<{ meals: MealOption[]; baggage: BaggageOption[] }> {
  await delay(300);
  if (ancillaryCatalogOutcome === 'fail') {
    throw new Error('FIXTURE_ANCILLARY_CATALOG_FAIL');
  }
  return { meals: FIXTURE_MEALS, baggage: FIXTURE_BAGGAGE };
}

export const FIXTURE_SEATS: SeatOption[] = [
  { seatNumber: '1A', zone: 'Front', priceAmount: 500_000, available: true },
  { seatNumber: '1B', zone: 'Front', priceAmount: 500_000, available: false },
  { seatNumber: '1C', zone: 'Front', priceAmount: 500_000, available: true },
  { seatNumber: '2A', zone: 'Front', priceAmount: 500_000, available: true },
  { seatNumber: '2B', zone: 'Front', priceAmount: 500_000, available: true },
  { seatNumber: '2C', zone: 'Front', priceAmount: 500_000, available: true },
  { seatNumber: '5A', zone: 'Premium', priceAmount: 300_000, available: true },
  { seatNumber: '5B', zone: 'Premium', priceAmount: 300_000, available: true },
  { seatNumber: '5C', zone: 'Premium', priceAmount: 300_000, available: false },
  { seatNumber: '10A', zone: 'Standard', priceAmount: 150_000, available: true },
  { seatNumber: '10B', zone: 'Standard', priceAmount: 150_000, available: true },
  { seatNumber: '10C', zone: 'Standard', priceAmount: 150_000, available: true },
  { seatNumber: '15A', zone: 'Relax', priceAmount: null, available: false },
  { seatNumber: '15B', zone: 'Relax', priceAmount: null, available: false },
];

export async function fixtureLoadSeatMap(_sessionId: string): Promise<SeatOption[]> {
  await delay(300);
  if (seatMapOutcome === 'fail') {
    throw new Error('FIXTURE_SEAT_MAP_FAIL');
  }
  return FIXTURE_SEATS;
}

export async function fixtureSubmitAncillary(_sessionId: string): Promise<void> {
  await delay(400);
  if (ancillaryOutcome === 'fail') {
    throw new Error('FIXTURE_ANCILLARY_FAIL');
  }
}

export async function fixtureSubmitSeats(_sessionId: string): Promise<void> {
  await delay(400);
  if (seatOutcome === 'fail') {
    throw new Error('FIXTURE_SEAT_FAIL');
  }
}

export async function fixtureGetPaymentInquiry(
  _sessionId: string,
  amount: number,
): Promise<{ bookingKey: string; amount: number }> {
  await delay(300);
  if (paymentInquiryOutcome === 'fail') {
    throw new Error('FIXTURE_PAYMENT_INQUIRY_FAIL');
  }
  const key = `VJA${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  return { bookingKey: key, amount };
}

export type PaymentFixtureResult = 'success' | 'failed' | 'cancelled' | 'simulated';
let paymentFixtureResult: PaymentFixtureResult = 'simulated';
export function setPaymentFixtureResult(r: PaymentFixtureResult) { paymentFixtureResult = r; }

export async function fixtureInitiatePayment(
  _sessionId: string,
  _offerId: string,
): Promise<{ status: PaymentFixtureResult; transactionId: string | null }> {
  await delay(800);
  if (paymentOutcome === 'fail' || paymentFixtureResult === 'failed') {
    return { status: 'failed', transactionId: null };
  }
  if (paymentFixtureResult === 'cancelled') {
    return { status: 'cancelled', transactionId: null };
  }
  if (paymentFixtureResult === 'simulated') {
    const txId = `TXN${Date.now().toString(36).toUpperCase()}`;
    return { status: 'simulated', transactionId: txId };
  }
  const txId = `TXN${Date.now().toString(36).toUpperCase()}`;
  return { status: 'success', transactionId: txId };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Daily price fixture for date strip
export function fixtureDailyPrice(date: string): number {
  // Deterministic but varied price based on date string hash
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) & 0xffffffff;
  }
  const base = 1_800_000;
  const variation = Math.abs(hash % 1_200_000);
  return base + variation;
}
