// Fixture: Flight search results
// Waiting on: POST /internal/vja/search
import type { FlightOffer } from '../types/state';

function makeOffers(origin: string, destination: string, date: string): FlightOffer[] {
  return [
    {
      offerId: `${origin}-${destination}-${date}-VJ123-ECO`,
      flightNumber: 'VJ123',
      departureTime: '08:45',
      arrivalTime: '10:30',
      duration: '1h 45m',
      aircraft: 'Airbus A321',
      fareClass: 'Eco',
      priceAmount: 2500000,
      availableSeats: 12,
      date,
      origin,
      destination,
    },
    {
      offerId: `${origin}-${destination}-${date}-VJ123-PLUS`,
      flightNumber: 'VJ123',
      departureTime: '08:45',
      arrivalTime: '10:30',
      duration: '1h 45m',
      aircraft: 'Airbus A321',
      fareClass: 'Eco Plus',
      priceAmount: 3200000,
      availableSeats: 5,
      date,
      origin,
      destination,
    },
    {
      offerId: `${origin}-${destination}-${date}-VJ456-ECO`,
      flightNumber: 'VJ456',
      departureTime: '14:20',
      arrivalTime: '16:05',
      duration: '1h 45m',
      aircraft: 'Boeing 737',
      fareClass: 'Eco',
      priceAmount: 2800000,
      availableSeats: 20,
      date,
      origin,
      destination,
    },
    {
      offerId: `${origin}-${destination}-${date}-VJ456-PLUS`,
      flightNumber: 'VJ456',
      departureTime: '14:20',
      arrivalTime: '16:05',
      duration: '1h 45m',
      aircraft: 'Boeing 737',
      fareClass: 'Eco Plus',
      priceAmount: 3500000,
      availableSeats: 3,
      date,
      origin,
      destination,
    },
  ];
}

type SearchOutcome = 'success' | 'fail';
let _outcome: SearchOutcome = 'success';

export function setSearchOutcome(o: SearchOutcome): void {
  _outcome = o;
}

export interface SearchParams {
  tripType: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
}

export interface SearchResult {
  sessionId: string;
  expiresAt: string;
  offers: FlightOffer[];
}

export async function fixtureSearch(params: SearchParams): Promise<SearchResult> {
  await new Promise(r => setTimeout(r, 600));
  if (_outcome === 'fail') throw new Error('fixture: search failed');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    sessionId,
    expiresAt,
    offers: makeOffers(params.origin, params.destination, params.departureDate),
  };
}

export async function fixtureSearchReturn(params: SearchParams): Promise<SearchResult> {
  await new Promise(r => setTimeout(r, 400));
  if (_outcome === 'fail') throw new Error('fixture: search-return failed');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const returnDate = params.returnDate ?? params.departureDate;
  return {
    sessionId,
    expiresAt,
    offers: makeOffers(params.destination, params.origin, returnDate),
  };
}

export async function fixtureFetchDailyPrices(
  origin: string,
  destination: string,
  date: string,
): Promise<number> {
  await new Promise(r => setTimeout(r, 200));
  // Return a fixture price per date (deterministic from date string)
  const base = 2000000;
  const seed = date.split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  return base + (seed % 10) * 100000;
}

export async function fixtureSubmitPassengers(
  _sessionId: string,
  passengers: Array<{ lastName: string; firstName: string }>,
): Promise<{ passengers: Array<{ passengerId: string }> }> {
  await new Promise(r => setTimeout(r, 400));
  return {
    passengers: passengers.map((_, i) => ({ passengerId: `pax_${i + 1}_${Date.now()}` })),
  };
}
