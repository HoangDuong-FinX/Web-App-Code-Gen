import type { SeatInfo } from '../types';

const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

export function generateSeatMap(): SeatInfo[] {
  const seats: SeatInfo[] = [];
  for (let row = 1; row <= 15; row++) {
    for (const col of columns) {
      const isExit = row === 12 || row === 13;
      const isUnavailable = (row === 3 && (col === 'C' || col === 'D')) ||
        (row === 7 && col === 'A');
      let tier = 'Standard';
      let price: number | null = 80000;
      if (row <= 3) {
        tier = 'Hot Seat';
        price = 250000;
      } else if (isExit) {
        tier = 'Exit Row';
        price = 180000;
      }
      if (isUnavailable) {
        price = null;
      }
      seats.push({
        seatId: `${row}${col}`,
        row,
        column: col,
        available: !isUnavailable,
        priceAmount: price,
        fareTier: tier,
      });
    }
  }
  return seats;
}

let fixtureSeatOutcome: 'success' | 'fail' = 'success';
export function setSeatOutcome(outcome: 'success' | 'fail'): void {
  fixtureSeatOutcome = outcome;
}
export function getSeatOutcome(): 'success' | 'fail' {
  return fixtureSeatOutcome;
}
