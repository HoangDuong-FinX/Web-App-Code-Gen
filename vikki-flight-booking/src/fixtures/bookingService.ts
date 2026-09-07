// Fixture module for fsap-booking-service
// All API calls go through this module while the real service is unavailable.
// Callers can control outcomes via setXxxOutcome() for deterministic testing.

import type {
  Airport,
  CityPair,
  FlightOffer,
  SearchResult,
  Passenger,
  AncillaryCatalog,
  SeatInfo,
  PaymentInquiryPayload,
} from '../types';

export type Outcome = 'success' | 'fail' | 'timeout';

let loadAirportsOutcome: Outcome = 'success';
let loadCityPairsOutcome: Outcome = 'success';
let submitSearchOutcome: Outcome = 'success';
let submitPassengersOutcome: Outcome = 'success';
let fetchAncillaryCatalogOutcome: Outcome = 'success';
let fetchSeatMapOutcome: Outcome = 'success';
let submitAncillaryOutcome: Outcome = 'success';
let submitSeatsOutcome: Outcome = 'success';
let fetchPaymentPayloadOutcome: Outcome = 'success';

export function setLoadAirportsOutcome(o: Outcome) { loadAirportsOutcome = o; }
export function setLoadCityPairsOutcome(o: Outcome) { loadCityPairsOutcome = o; }
export function setSubmitSearchOutcome(o: Outcome) { submitSearchOutcome = o; }
export function setSubmitPassengersOutcome(o: Outcome) { submitPassengersOutcome = o; }
export function setFetchAncillaryCatalogOutcome(o: Outcome) { fetchAncillaryCatalogOutcome = o; }
export function setFetchSeatMapOutcome(o: Outcome) { fetchSeatMapOutcome = o; }
export function setSubmitAncillaryOutcome(o: Outcome) { submitAncillaryOutcome = o; }
export function setSubmitSeatsOutcome(o: Outcome) { submitSeatsOutcome = o; }
export function setFetchPaymentPayloadOutcome(o: Outcome) { fetchPaymentPayloadOutcome = o; }

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function simulateCall<T>(outcome: Outcome, data: T): Promise<T> {
  await delay(300);
  if (outcome === 'timeout') throw new Error('FIXTURE_TIMEOUT');
  if (outcome === 'fail') throw new Error('FIXTURE_API_ERROR');
  return data;
}

export const FIXTURE_AIRPORTS: Airport[] = [
  { code: 'SGN', name: 'Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'VN', group: 'Popular' },
  { code: 'HAN', name: 'Nội Bài', city: 'Hà Nội', country: 'VN', group: 'Popular' },
  { code: 'DLI', name: 'Liên Khương', city: 'Đà Lạt', country: 'VN', group: 'Popular' },
  { code: 'DAD', name: 'Đà Nẵng', city: 'Đà Nẵng', country: 'VN', group: 'Vietnam' },
  { code: 'PQC', name: 'Phú Quốc', city: 'Phú Quốc', country: 'VN', group: 'Vietnam' },
  { code: 'HPH', name: 'Cát Bi', city: 'Hải Phòng', country: 'VN', group: 'Vietnam' },
  { code: 'HUI', name: 'Phú Bài', city: 'Huế', country: 'VN', group: 'Vietnam' },
  { code: 'CXR', name: 'Cam Ranh', city: 'Nha Trang', country: 'VN', group: 'Vietnam' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH', group: 'International' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'SG', group: 'International' },
];

export const FIXTURE_CITY_PAIRS: CityPair[] = [
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

function makeOffers(origin: string, destination: string, dateStr: string): FlightOffer[] {
  return [
    {
      offerId: `offer-${origin}-${destination}-${dateStr}-1`,
      flightNumber: 'VJ123',
      departureTime: '08:45',
      arrivalTime: '10:30',
      durationMinutes: 105,
      aircraft: 'Airbus A321',
      stops: 0,
      fareClasses: [
        { fareId: 'eco', name: 'Eco', priceAmount: 2500000, availableSeats: 12, baggageIncluded: 'Xách tay 7kg và 01 túi xách nhỏ' },
        { fareId: 'deluxe', name: 'Deluxe', priceAmount: 3200000, availableSeats: 6, baggageIncluded: 'Xách tay 7kg + Ký gửi 20kg' },
      ],
    },
    {
      offerId: `offer-${origin}-${destination}-${dateStr}-2`,
      flightNumber: 'VJ456',
      departureTime: '14:20',
      arrivalTime: '16:05',
      durationMinutes: 105,
      aircraft: 'Airbus A320',
      stops: 0,
      fareClasses: [
        { fareId: 'eco', name: 'Eco', priceAmount: 2200000, availableSeats: 20, baggageIncluded: 'Xách tay 7kg và 01 túi xách nhỏ' },
        { fareId: 'deluxe', name: 'Deluxe', priceAmount: 2900000, availableSeats: 8, baggageIncluded: 'Xách tay 7kg + Ký gửi 20kg' },
      ],
    },
    {
      offerId: `offer-${origin}-${destination}-${dateStr}-3`,
      flightNumber: 'VJ789',
      departureTime: '19:10',
      arrivalTime: '20:55',
      durationMinutes: 105,
      aircraft: 'Boeing 737',
      stops: 0,
      fareClasses: [
        { fareId: 'eco', name: 'Eco', priceAmount: 1900000, availableSeats: 4, baggageIncluded: 'Xách tay 7kg và 01 túi xách nhỏ' },
      ],
    },
  ];
}

let sessionCounter = 1;

export async function loadAirports(): Promise<Airport[]> {
  return simulateCall(loadAirportsOutcome, FIXTURE_AIRPORTS);
}

export async function loadCityPairs(): Promise<CityPair[]> {
  return simulateCall(loadCityPairsOutcome, FIXTURE_CITY_PAIRS);
}

export interface SearchParams {
  tripType: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
}

export async function submitSearch(params: SearchParams): Promise<SearchResult> {
  const sessionId = `sess_${Date.now()}_${sessionCounter++}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const offers = makeOffers(params.origin, params.destination, params.departureDate);
  return simulateCall(submitSearchOutcome, { sessionId, expiresAt, offers });
}

export async function fetchDailyPrices(
  params: SearchParams,
  dates: string[]
): Promise<Record<string, number>> {
  await delay(200);
  const prices: Record<string, number> = {};
  for (const d of dates) {
    const base = 1800000 + Math.floor(Math.abs(d.charCodeAt(8) - 48) * 100000);
    prices[d] = base;
  }
  return prices;
}

export async function submitPassengers(
  sessionId: string,
  passengers: Passenger[]
): Promise<{ passengers: Array<{ passengerId: string }> }> {
  const result = {
    passengers: passengers.map((_, i) => ({ passengerId: `pax_${sessionId}_${i + 1}` })),
  };
  return simulateCall(submitPassengersOutcome, result);
}

export const FIXTURE_ANCILLARY_CATALOG: AncillaryCatalog = {
  meals: [
    { optionId: 'meal_001', name: '🍖 Cơm gà', priceAmount: 150000, available: true },
    { optionId: 'meal_002', name: '🍜 Phở bò', priceAmount: 120000, available: true },
    { optionId: 'meal_003', name: '🥗 Salad chay', priceAmount: 90000, available: true },
  ],
  baggage: [
    { optionId: 'bag_2kg', name: 'Hành lý ký gửi +2kg', priceAmount: 200000, available: true },
    { optionId: 'bag_20kg', name: 'Hành lý ký gửi 20kg', priceAmount: 500000, available: true },
    { optionId: 'bag_30kg', name: 'Hành lý ký gửi 30kg', priceAmount: 700000, available: true },
  ],
};

export async function fetchAncillaryCatalog(_sessionId: string): Promise<AncillaryCatalog> {
  return simulateCall(fetchAncillaryCatalogOutcome, FIXTURE_ANCILLARY_CATALOG);
}

export const FIXTURE_SEATS: SeatInfo[] = [
  { seatNumber: '1A', zone: 'Front', priceAmount: 500000, available: true },
  { seatNumber: '1B', zone: 'Front', priceAmount: 500000, available: false },
  { seatNumber: '1C', zone: 'Front', priceAmount: 500000, available: true },
  { seatNumber: '2A', zone: 'Front', priceAmount: 500000, available: true },
  { seatNumber: '2B', zone: 'Front', priceAmount: 500000, available: true },
  { seatNumber: '2C', zone: 'Front', priceAmount: 500000, available: false },
  { seatNumber: '5A', zone: 'Premium', priceAmount: 300000, available: true },
  { seatNumber: '5B', zone: 'Premium', priceAmount: 300000, available: true },
  { seatNumber: '5C', zone: 'Premium', priceAmount: 300000, available: false },
  { seatNumber: '6A', zone: 'Premium', priceAmount: 300000, available: true },
  { seatNumber: '10A', zone: 'Standard', priceAmount: 150000, available: true },
  { seatNumber: '10B', zone: 'Standard', priceAmount: 150000, available: true },
  { seatNumber: '10C', zone: 'Standard', priceAmount: 150000, available: true },
  { seatNumber: '11A', zone: 'Standard', priceAmount: 150000, available: false },
  { seatNumber: '11B', zone: 'Standard', priceAmount: 150000, available: true },
  { seatNumber: '20A', zone: 'Relax', priceAmount: null, available: false },
  { seatNumber: '20B', zone: 'Relax', priceAmount: null, available: false },
];

export async function fetchSeatMap(_sessionId: string): Promise<SeatInfo[]> {
  return simulateCall(fetchSeatMapOutcome, FIXTURE_SEATS);
}

export async function submitAncillarySelections(
  _sessionId: string,
  _selections: Array<{ passengerId: string; optionId: string }>
): Promise<void> {
  return simulateCall(submitAncillaryOutcome, undefined);
}

export async function submitSeatSelections(
  _sessionId: string,
  _selections: Array<{ passengerIndex: number; seatNumber: string }>
): Promise<void> {
  return simulateCall(submitSeatsOutcome, undefined);
}

export async function fetchPaymentInquiryPayload(
  sessionId: string,
  amount: number
): Promise<PaymentInquiryPayload> {
  const bookingKey = `VJA${sessionId.slice(-8).toUpperCase()}`;
  return simulateCall(fetchPaymentPayloadOutcome, { bookingKey, amount });
}
