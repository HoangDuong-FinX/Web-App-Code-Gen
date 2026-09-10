import type { Seat } from '../types';

let loadOutcome: 'success' | 'fail' | 'empty' = 'success';

export function setLoadSeatOutcome(outcome: 'success' | 'fail' | 'empty'): void {
  loadOutcome = outcome;
}

let submitOutcome: 'success' | 'fail' = 'success';

export function setSubmitSeatOutcome(outcome: 'success' | 'fail'): void {
  submitOutcome = outcome;
}

const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
const tiers = [
  { name: 'Hot Seat', price: 250000, color: '#E12127' },
  { name: 'Standard', price: 120000, color: '#3B82F6' },
  { name: 'Quiet Zone', price: 180000, color: '#8B5CF6' },
];

function generateSeats(): Seat[] {
  const seats: Seat[] = [];
  for (let row = 1; row <= 30; row++) {
    for (const col of columns) {
      const tier = row <= 5 ? tiers[0] : row <= 10 ? tiers[2] : tiers[1];
      const available = !(row === 3 && (col === 'A' || col === 'B'));
      seats.push({
        seatCode: `${row}${col}`,
        row,
        column: col,
        available,
        priceAmount: available ? tier.price : null,
        priceTier: tier.name,
      });
    }
  }
  return seats;
}

export async function loadSeatOptions(): Promise<Seat[]> {
  await new Promise((r) => setTimeout(r, 400));
  if (loadOutcome === 'fail') {
    throw new Error('FIXTURE: seat options load failed');
  }
  if (loadOutcome === 'empty') {
    return [];
  }
  return generateSeats();
}

export async function submitSeatSelections(
  _sessionId: string,
  _selections: Array<{ passengerIndex: number; seatCode: string }>
): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  if (submitOutcome === 'fail') {
    throw new Error('FIXTURE: seat submit failed');
  }
}

export function getSeatTiers(): Array<{ name: string; price: number; color: string }> {
  return tiers;
}
