import type { SearchSession, Flight } from '../types';

let searchOutcome: 'success' | 'fail' = 'success';

export function setSearchOutcome(outcome: 'success' | 'fail'): void {
  searchOutcome = outcome;
}

const sampleFlights: Flight[] = [
  {
    flightNumber: 'VJ162',
    departureTime: '06:00',
    arrivalTime: '08:10',
    duration: '2h 10m',
    originCode: 'SGN',
    destCode: 'HAN',
    fareClasses: [
      { fareClassName: 'Eco', offerId: 'offer-eco-1', priceAmount: 1290000, available: true },
      { fareClassName: 'Deluxe', offerId: 'offer-dlx-1', priceAmount: 1890000, available: true },
      { fareClassName: 'SkyBoss', offerId: 'offer-sky-1', priceAmount: 3490000, available: false },
    ],
  },
  {
    flightNumber: 'VJ168',
    departureTime: '10:30',
    arrivalTime: '12:40',
    duration: '2h 10m',
    originCode: 'SGN',
    destCode: 'HAN',
    fareClasses: [
      { fareClassName: 'Eco', offerId: 'offer-eco-2', priceAmount: 1490000, available: true },
      { fareClassName: 'Deluxe', offerId: 'offer-dlx-2', priceAmount: 2090000, available: true },
      { fareClassName: 'SkyBoss', offerId: 'offer-sky-2', priceAmount: 3690000, available: true },
    ],
  },
  {
    flightNumber: 'VJ172',
    departureTime: '15:45',
    arrivalTime: '17:55',
    duration: '2h 10m',
    originCode: 'SGN',
    destCode: 'HAN',
    fareClasses: [
      { fareClassName: 'Eco', offerId: 'offer-eco-3', priceAmount: 1190000, available: true },
      { fareClassName: 'Deluxe', offerId: 'offer-dlx-3', priceAmount: 1790000, available: true },
      { fareClassName: 'SkyBoss', offerId: 'offer-sky-3', priceAmount: 3290000, available: true },
    ],
  },
];

export async function submitSearch(
  origin: string,
  destination: string,
  _departureDate: string,
  _adults: number,
  _children: number,
  _infants: number
): Promise<SearchSession> {
  await new Promise((r) => setTimeout(r, 500));
  if (searchOutcome === 'fail') {
    throw new Error('FIXTURE: search failed');
  }
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  return {
    sessionId: `session-${Date.now()}`,
    expiresAt,
    offers: sampleFlights.map((f) => ({
      ...f,
      originCode: origin,
      destCode: destination,
    })),
  };
}
