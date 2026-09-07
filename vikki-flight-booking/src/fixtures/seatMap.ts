// Fixture: Seat map
// Waiting on: GET /internal/vja/sessions/{id}/seat-options

export interface SeatOption {
  seatNumber: string;
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
  priceAmount: number | null;
  available: boolean;
}

type SeatMapOutcome = 'success' | 'fail';
let _outcome: SeatMapOutcome = 'success';

export function setSeatMapOutcome(o: SeatMapOutcome): void {
  _outcome = o;
}

function makeSeat(
  row: number,
  col: string,
  zone: SeatOption['zone'],
  price: number | null,
  available: boolean,
): SeatOption {
  return { seatNumber: `${row}${col}`, zone, priceAmount: price, available };
}

export const FIXTURE_SEAT_MAP: SeatOption[] = [
  // Front rows 1-4
  ...([1, 2, 3, 4] as const).flatMap(r =>
    ['A', 'B', 'C', 'D', 'E', 'F'].map((c, i) =>
      makeSeat(r, c, 'Front', 500000, i !== 2),
    ),
  ),
  // Premium rows 5-8
  ...([5, 6, 7, 8] as const).flatMap(r =>
    ['A', 'B', 'C', 'D', 'E', 'F'].map((c, i) =>
      makeSeat(r, c, 'Premium', 300000, i !== 3),
    ),
  ),
  // Standard rows 9-20
  ...([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const).flatMap(r =>
    ['A', 'B', 'C', 'D', 'E', 'F'].map((c, i) =>
      makeSeat(r, c, 'Standard', 150000, i !== 1 || r !== 12),
    ),
  ),
  // Relax rows 21-25 (exit rows, no price)
  ...([21, 22, 23, 24, 25] as const).flatMap(r =>
    ['A', 'B', 'C', 'D', 'E', 'F'].map(c =>
      makeSeat(r, c, 'Relax', null, false),
    ),
  ),
];

export async function fixtureLoadSeatMap(_sessionId: string): Promise<SeatOption[]> {
  await new Promise(r => setTimeout(r, 400));
  if (_outcome === 'fail') throw new Error('fixture: seat-map failed');
  return FIXTURE_SEAT_MAP;
}
