import type { FlightOffer, DateChip } from '../types';

export function generateDateChips(baseDate: string): DateChip[] {
  const base = new Date(baseDate);
  const chips: DateChip[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    chips.push({
      date: dateStr,
      label,
      lowestPrice: i === 0 ? 1190000 : (1190000 + i * 100000),
    });
  }
  return chips;
}

export function generateFlightOffers(origin: string, destination: string): FlightOffer[] {
  return [
    {
      offerId: `offer-${origin}-${destination}-1`,
      flightNumber: 'VJ101',
      departureTime: '06:00',
      arrivalTime: '08:10',
      duration: '2h 10m',
      fareClasses: [
        { fareClassName: 'Eco', priceAmount: 1190000, available: true },
        { fareClassName: 'Deluxe', priceAmount: 1690000, available: true },
        { fareClassName: 'SkyBoss', priceAmount: 3290000, available: true },
      ],
    },
    {
      offerId: `offer-${origin}-${destination}-2`,
      flightNumber: 'VJ103',
      departureTime: '10:30',
      arrivalTime: '12:40',
      duration: '2h 10m',
      fareClasses: [
        { fareClassName: 'Eco', priceAmount: 1390000, available: true },
        { fareClassName: 'Deluxe', priceAmount: 1890000, available: true },
        { fareClassName: 'SkyBoss', priceAmount: 3490000, available: false },
      ],
    },
    {
      offerId: `offer-${origin}-${destination}-3`,
      flightNumber: 'VJ105',
      departureTime: '16:00',
      arrivalTime: '18:10',
      duration: '2h 10m',
      fareClasses: [
        { fareClassName: 'Eco', priceAmount: 1290000, available: true },
        { fareClassName: 'Deluxe', priceAmount: 1790000, available: true },
        { fareClassName: 'SkyBoss', priceAmount: 3390000, available: true },
      ],
    },
  ];
}

let fixtureSearchOutcome: 'success' | 'fail' = 'success';
export function setSearchOutcome(outcome: 'success' | 'fail'): void {
  fixtureSearchOutcome = outcome;
}
export function getSearchOutcome(): 'success' | 'fail' {
  return fixtureSearchOutcome;
}
