// src/fixtures/index.ts
import type {
  Airport,
  CityPair,
  FlightOffer,
  SearchSession,
  PassengerWithId,
  MealOption,
  BaggageOption,
  SeatOption,
  AncillaryCatalog,
  PaymentInquiryPayload,
} from '../types';

// ─── Outcome switches (deterministic, testable) ───────────────────────────────
export type FixtureOutcome = 'success' | 'fail';

let submitSearchOutcome: FixtureOutcome = 'success';
let submitPassengersOutcome: FixtureOutcome = 'success';
let submitServicesOutcome: FixtureOutcome = 'success';
let fetchPaymentPayloadOutcome: FixtureOutcome = 'success';
let paymentOutcome: FixtureOutcome = 'success';
let paymentHubAvailable = true;

export function setSubmitSearchOutcome(o: FixtureOutcome): void { submitSearchOutcome = o; }
export function setSubmitPassengersOutcome(o: FixtureOutcome): void { submitPassengersOutcome = o; }
export function setSubmitServicesOutcome(o: FixtureOutcome): void { submitServicesOutcome = o; }
export function setFetchPaymentPayloadOutcome(o: FixtureOutcome): void { fetchPaymentPayloadOutcome = o; }
export function setPaymentOutcome(o: FixtureOutcome): void { paymentOutcome = o; }
export function setPaymentHubAvailable(v: boolean): void { paymentHubAvailable = v; }

// ─── Airport data ─────────────────────────────────────────────────────────────
export const AIRPORTS: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
  { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'VN', group: 'Popular' },
  { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Popular' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'VN', group: 'Vietnam' },
  { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'VN', group: 'Vietnam' },
  { code: 'HUI', name: 'Phú Bài', city: 'Huế', country: 'VN', group: 'Vietnam' },
  { code: 'VCA', name: 'Cần Thơ', city: 'Cần Thơ', country: 'VN', group: 'Vietnam' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phú Quốc', country: 'VN', group: 'Vietnam' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang', country: 'VN', group: 'Vietnam' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'SG', group: 'International' },
];

export const CITY_PAIRS: CityPair[] = [
  { origin: 'SGN', destination: 'HAN' },
  { origin: 'HAN', destination: 'SGN' },
  { origin: 'SGN', destination: 'DLI' },
  { origin: 'DLI', destination: 'SGN' },
  { origin: 'SGN', destination: 'DAD' },
  { origin: 'DAD', destination: 'SGN' },
  { origin: 'SGN', destination: 'PQC' },
  { origin: 'PQC', destination: 'SGN' },
  { origin: 'HAN', destination: 'DAD' },
  { origin: 'DAD', destination: 'HAN' },
  { origin: 'HAN', destination: 'DLI' },
  { origin: 'DLI', destination: 'HAN' },
  { origin: 'SGN', destination: 'CXR' },
  { origin: 'CXR', destination: 'SGN' },
  { origin: 'SGN', destination: 'BKK' },
  { origin: 'BKK', destination: 'SGN' },
  { origin: 'SGN', destination: 'SIN' },
  { origin: 'SIN', destination: 'SGN' },
];

function makeOffers(origin: string, destination: string, date: string): FlightOffer[] {
  return [
    {
      offer_id: `offer-${origin}-${destination}-${date}-VJ123-eco`,
      flight_number: 'VJ123',
      aircraft_type: 'Airbus A321',
      departure_time: '08:45',
      arrival_time: '10:30',
      duration_minutes: 105,
      stops: 0,
      fare_class: 'Eco',
      fare_label: 'Eco',
      price_amount: 2500000,
      available_seats: 12,
      baggage_allowance: 'Xách tay 7kg và 01 túi xách nhỏ',
    },
    {
      offer_id: `offer-${origin}-${destination}-${date}-VJ123-flex`,
      flight_number: 'VJ123',
      aircraft_type: 'Airbus A321',
      departure_time: '08:45',
      arrival_time: '10:30',
      duration_minutes: 105,
      stops: 0,
      fare_class: 'Flex',
      fare_label: 'Flex',
      price_amount: 3200000,
      available_seats: 5,
      baggage_allowance: 'Xách tay 7kg + Ký gửi 20kg',
    },
    {
      offer_id: `offer-${origin}-${destination}-${date}-VJ456-eco`,
      flight_number: 'VJ456',
      aircraft_type: 'Boeing 737',
      departure_time: '14:20',
      arrival_time: '16:05',
      duration_minutes: 105,
      stops: 0,
      fare_class: 'Eco',
      fare_label: 'Eco',
      price_amount: 2800000,
      available_seats: 20,
      baggage_allowance: 'Xách tay 7kg và 01 túi xách nhỏ',
    },
  ];
}

// ─── API fixture implementations ──────────────────────────────────────────────
export async function fixtureLoadAirports(): Promise<Airport[]> {
  await delay(300);
  return AIRPORTS;
}

export async function fixtureLoadCityPairs(): Promise<CityPair[]> {
  await delay(200);
  return CITY_PAIRS;
}

export async function fixtureSubmitSearch(
  origin: string,
  destination: string,
  departureDate: string
): Promise<SearchSession> {
  await delay(800);
  if (submitSearchOutcome === 'fail') {
    throw new Error('search.error');
  }
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  return {
    session_id: `sess_${Math.random().toString(36).slice(2, 10)}`,
    expires_at: expiresAt,
    offers: makeOffers(origin, destination, departureDate),
  };
}

export async function fixtureSubmitPassengers(
  _sessionId: string,
  passengers: { last_name: string; first_name: string }[]
): Promise<PassengerWithId[]> {
  await delay(600);
  if (submitPassengersOutcome === 'fail') {
    throw new Error('passenger.error');
  }
  return passengers.map((p, i) => ({
    ...p,
    gender: 'M' as const,
    date_of_birth: null,
    phone: null,
    email: null,
    passenger_id: `pax_${i + 1}`,
  }));
}

export async function fixtureFetchAncillaryCatalog(_sessionId: string): Promise<AncillaryCatalog> {
  await delay(400);
  const meals: MealOption[] = [
    { option_id: 'meal_001', name: '🍖 Cơm gà', price_amount: 150000, available: true },
    { option_id: 'meal_002', name: '🍜 Mì xào', price_amount: 120000, available: true },
    { option_id: 'meal_003', name: '🥗 Salad', price_amount: 100000, available: true },
  ];
  const baggage: BaggageOption[] = [
    { option_id: 'bag_2kg', name: 'Hành lý ký gửi +2kg', price_amount: 200000, available: true },
    { option_id: 'bag_20kg', name: 'Hành lý ký gửi 20kg', price_amount: 500000, available: true },
    { option_id: 'bag_30kg', name: 'Hành lý ký gửi 30kg', price_amount: 700000, available: true },
  ];
  return { meals, baggage };
}

export async function fixtureFetchSeatMap(_sessionId: string): Promise<SeatOption[]> {
  await delay(500);
  const zones: Array<SeatOption['zone']> = ['Front', 'Front', 'Premium', 'Standard', 'Standard', 'Standard', 'Relax'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats: SeatOption[] = [];
  rows.forEach((row) => {
    const zoneIndex = Math.min(Math.floor((row - 1) / 2), zones.length - 1);
    const zone = zones[zoneIndex];
    const price = zone === 'Front' ? 500000 : zone === 'Premium' ? 350000 : zone === 'Standard' ? 200000 : 150000;
    cols.forEach((col) => {
      const seatNum = `${row}${col}`;
      const taken = ['2B', '3C', '5A', '7D', '10F'].includes(seatNum);
      seats.push({
        seat_number: seatNum,
        zone,
        price_amount: price,
        available: !taken,
      });
    });
  });
  return seats;
}

export async function fixtureSubmitAncillarySelections(_sessionId: string): Promise<void> {
  await delay(500);
  if (submitServicesOutcome === 'fail') {
    throw new Error('services.saveError');
  }
}

export async function fixtureSubmitSeatSelections(_sessionId: string): Promise<void> {
  await delay(400);
  if (submitServicesOutcome === 'fail') {
    throw new Error('services.saveError');
  }
}

export async function fixtureFetchPaymentPayload(_sessionId: string): Promise<PaymentInquiryPayload> {
  await delay(400);
  if (fetchPaymentPayloadOutcome === 'fail') {
    throw new Error('payment.loadError');
  }
  return {
    booking_key: 'VJA' + Math.random().toString(36).toUpperCase().slice(2, 10),
    amount: 6000000,
  };
}

export async function fixtureInitiatePayment(): Promise<{
  paymentSessionId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
}> {
  await delay(1200);
  if (!paymentHubAvailable) {
    throw new Error('payment.unavailable');
  }
  if (paymentOutcome === 'fail') {
    return { paymentSessionId: '', status: 'failed' };
  }
  return {
    paymentSessionId: `pay_${Math.random().toString(36).slice(2, 10)}`,
    status: 'success',
  };
}

export async function fixturePollPaymentResult(): Promise<{ transactionId: string; status: 'success' | 'failed' }> {
  await delay(600);
  return {
    transactionId: `TXN${Math.random().toString(36).toUpperCase().slice(2, 10)}`,
    status: 'success',
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
