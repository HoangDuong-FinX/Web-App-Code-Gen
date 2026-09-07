// Seat map fixture
import type { SeatOption } from '../types/state';

type FixtureOutcome = 'success' | 'fail';
let outcome: FixtureOutcome = 'success';
export function setFetchSeatMapOutcome(o: FixtureOutcome): void { outcome = o; }

function makeSeat(
  num: string,
  zone: SeatOption['zone'],
  price: number | null,
  available: boolean
): SeatOption {
  return { seatNumber: num, zone, priceAmount: price, available };
}

export const SEAT_MAP: SeatOption[] = [
  // Front zone (rows 1-5)
  makeSeat('1A', 'Front', 500000, true),
  makeSeat('1B', 'Front', 500000, false),
  makeSeat('1C', 'Front', 500000, true),
  makeSeat('1D', 'Front', 500000, true),
  makeSeat('1E', 'Front', 500000, false),
  makeSeat('1F', 'Front', 500000, true),
  makeSeat('2A', 'Front', 500000, true),
  makeSeat('2B', 'Front', 500000, true),
  makeSeat('2C', 'Front', 500000, false),
  makeSeat('2D', 'Front', 500000, true),
  makeSeat('2E', 'Front', 500000, true),
  makeSeat('2F', 'Front', 500000, true),
  // Premium zone (rows 6-15)
  makeSeat('6A', 'Premium', 350000, true),
  makeSeat('6B', 'Premium', 350000, false),
  makeSeat('6C', 'Premium', 350000, true),
  makeSeat('6D', 'Premium', 350000, true),
  makeSeat('6E', 'Premium', 350000, true),
  makeSeat('6F', 'Premium', 350000, false),
  makeSeat('7A', 'Premium', 350000, true),
  makeSeat('7B', 'Premium', 350000, true),
  makeSeat('7C', 'Premium', 350000, true),
  makeSeat('7D', 'Premium', 350000, false),
  makeSeat('7E', 'Premium', 350000, true),
  makeSeat('7F', 'Premium', 350000, true),
  // Standard zone (rows 16-25)
  makeSeat('16A', 'Standard', 200000, true),
  makeSeat('16B', 'Standard', 200000, true),
  makeSeat('16C', 'Standard', 200000, false),
  makeSeat('16D', 'Standard', 200000, true),
  makeSeat('16E', 'Standard', 200000, true),
  makeSeat('16F', 'Standard', 200000, true),
  // Relax zone (rows 26-30) — price_amount null (not selectable per BR-08)
  makeSeat('26A', 'Relax', null, true),
  makeSeat('26B', 'Relax', null, true),
  makeSeat('26C', 'Relax', null, false),
  makeSeat('26D', 'Relax', null, true),
  makeSeat('26E', 'Relax', null, true),
  makeSeat('26F', 'Relax', null, true),
];

export async function fetchSeatMap(): Promise<SeatOption[]> {
  await new Promise(r => setTimeout(r, 400));
  if (outcome === 'fail') throw new Error('fixture: fetch-seat-map failed');
  return SEAT_MAP;
}
