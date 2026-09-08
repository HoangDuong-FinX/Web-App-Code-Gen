import type { SearchResult, DayPrice } from '../types';

const depDate = new Date();
depDate.setDate(depDate.getDate() + 7);

export const fixtureSearchResult: SearchResult = {
  outbound: {
    sessionId: 'sess-out-001',
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    flights: [
      {
        flightCode: 'VJ123',
        aircraftType: 'A321',
        departureTime: '06:00',
        arrivalTime: '08:10',
        departureAirport: 'SGN',
        arrivalAirport: 'HAN',
        duration: '2h 10m',
        fareClasses: [
          { classId: 'eco', className: 'Eco', price: 890000, soldOut: false },
          { classId: 'deluxe', className: 'Deluxe', price: 1250000, soldOut: false },
          { classId: 'biz', className: 'SkyBoss', price: 3500000, soldOut: true },
        ],
      },
      {
        flightCode: 'VJ456',
        aircraftType: 'A320',
        departureTime: '10:30',
        arrivalTime: '12:35',
        departureAirport: 'SGN',
        arrivalAirport: 'HAN',
        duration: '2h 05m',
        fareClasses: [
          { classId: 'eco', className: 'Eco', price: 950000, soldOut: false },
          { classId: 'deluxe', className: 'Deluxe', price: 1350000, soldOut: false },
          { classId: 'biz', className: 'SkyBoss', price: 3700000, soldOut: false },
        ],
      },
      {
        flightCode: 'VJ789',
        aircraftType: 'A321',
        departureTime: '18:00',
        arrivalTime: '20:15',
        departureAirport: 'SGN',
        arrivalAirport: 'HAN',
        duration: '2h 15m',
        fareClasses: [
          { classId: 'eco', className: 'Eco', price: 1100000, soldOut: false },
          { classId: 'deluxe', className: 'Deluxe', price: 1500000, soldOut: false },
          { classId: 'biz', className: 'SkyBoss', price: 4000000, soldOut: false },
        ],
      },
    ],
  },
  inbound: null,
};

export const fixtureDayPrices: DayPrice[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(depDate);
  d.setDate(d.getDate() + i - 3);
  return {
    date: d.toISOString().slice(0, 10),
    price: 890000 + i * 50000,
    hasFlights: true,
  };
});
