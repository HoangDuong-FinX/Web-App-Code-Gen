// Flight offers fixture — used when fsap-booking-service is unreachable
import type { FlightOffer, BookingSession } from '../types/state';

type FixtureOutcome = 'success' | 'fail';
let outcome: FixtureOutcome = 'success';
export function setSubmitSearchOutcome(o: FixtureOutcome): void { outcome = o; }

const OFFERS_SGN_DLI: FlightOffer[] = [
  {
    offerId: 'offer-vj123-eco',
    flightNumber: 'VJ123',
    aircraft: 'Airbus A321',
    departureTime: '08:45',
    arrivalTime: '10:30',
    durationMin: 105,
    stops: 0,
    fareClasses: [
      { fareClass: 'Eco', priceAmount: 2500000, baggageInfo: 'Xách tay 7kg và 01 túi xách nhỏ' },
      { fareClass: 'Eco+', priceAmount: 3200000, baggageInfo: 'Xách tay 7kg + Hành lý ký gửi 20kg' },
    ],
  },
  {
    offerId: 'offer-vj125-eco',
    flightNumber: 'VJ125',
    aircraft: 'Airbus A320',
    departureTime: '14:20',
    arrivalTime: '16:05',
    durationMin: 105,
    stops: 0,
    fareClasses: [
      { fareClass: 'Eco', priceAmount: 2200000, baggageInfo: 'Xách tay 7kg và 01 túi xách nhỏ' },
      { fareClass: 'Business', priceAmount: 5500000, baggageInfo: 'Xách tay 10kg + Hành lý ký gửi 30kg' },
    ],
  },
];

const OFFERS_DLI_SGN: FlightOffer[] = [
  {
    offerId: 'offer-vj124-eco',
    flightNumber: 'VJ124',
    aircraft: 'Airbus A321',
    departureTime: '11:00',
    arrivalTime: '12:45',
    durationMin: 105,
    stops: 0,
    fareClasses: [
      { fareClass: 'Eco', priceAmount: 2400000, baggageInfo: 'Xách tay 7kg và 01 túi xách nhỏ' },
      { fareClass: 'Eco+', priceAmount: 3100000, baggageInfo: 'Xách tay 7kg + Hành lý ký gửi 20kg' },
    ],
  },
];

function makeSession(offers: FlightOffer[]): BookingSession {
  const now = new Date();
  const expires = new Date(now.getTime() + 15 * 60 * 1000);
  return {
    sessionId: `sess_${Math.random().toString(36).slice(2, 10)}`,
    expiresAt: expires.toISOString(),
    offers,
  };
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  tripType: string;
  adults: number;
  children: number;
  infants: number;
}

export async function submitSearch(params: SearchParams): Promise<BookingSession> {
  await new Promise(r => setTimeout(r, 800));
  if (outcome === 'fail') throw new Error('fixture: submit-search failed');
  const key = `${params.origin}-${params.destination}`;
  const offersMap: Record<string, FlightOffer[]> = {
    'SGN-DLI': OFFERS_SGN_DLI,
    'DLI-SGN': OFFERS_DLI_SGN,
    'SGN-HAN': OFFERS_SGN_DLI,
    'HAN-SGN': OFFERS_DLI_SGN,
  };
  const offers = offersMap[key] ?? OFFERS_SGN_DLI;
  return makeSession(offers);
}
