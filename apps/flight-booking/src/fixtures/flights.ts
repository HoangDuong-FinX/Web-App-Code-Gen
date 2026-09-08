import type { Session } from '../types';

let shouldFail = false;

export function setSearchFlightsOutcome(fail: boolean): void {
  shouldFail = fail;
}

export function searchFlightsFixture(
  origin: string,
  destination: string,
  _date: string
): Promise<Session> {
  if (shouldFail) {
    return Promise.reject(new Error('fixture: search flights failed'));
  }
  const now = new Date();
  const expires = new Date(now.getTime() + 15 * 60 * 1000);
  return Promise.resolve({
    session_id: `sess_${origin}_${destination}_${Date.now()}`,
    expires_at: expires.toISOString(),
    offers: [
      {
        offer_id: `offer_1_${origin}${destination}`,
        flight_number: 'VJ101',
        departure_time: '06:00',
        arrival_time: '08:10',
        duration_minutes: 130,
        stops: 0,
        aircraft: 'A321',
        fares: [
          { fare_class: 'Eco', price_amount: 1200000, available: true },
          { fare_class: 'Deluxe', price_amount: 2500000, available: true },
          { fare_class: 'SkyBoss', price_amount: 4800000, available: false },
        ],
      },
      {
        offer_id: `offer_2_${origin}${destination}`,
        flight_number: 'VJ205',
        departure_time: '10:30',
        arrival_time: '12:40',
        duration_minutes: 130,
        stops: 0,
        aircraft: 'A320',
        fares: [
          { fare_class: 'Eco', price_amount: 1450000, available: true },
          { fare_class: 'Deluxe', price_amount: 2800000, available: true },
          { fare_class: 'SkyBoss', price_amount: 5200000, available: true },
        ],
      },
      {
        offer_id: `offer_3_${origin}${destination}`,
        flight_number: 'VJ309',
        departure_time: '16:15',
        arrival_time: '18:25',
        duration_minutes: 130,
        stops: 0,
        aircraft: 'A321',
        fares: [
          { fare_class: 'Eco', price_amount: 1350000, available: true },
          { fare_class: 'Deluxe', price_amount: 2600000, available: false },
          { fare_class: 'SkyBoss', price_amount: 4900000, available: true },
        ],
      },
    ],
  });
}