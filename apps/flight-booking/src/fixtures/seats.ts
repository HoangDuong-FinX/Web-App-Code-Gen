import type { Seat } from '../types';

let shouldFail = false;
let shouldEmpty = false;

export function setLoadSeatsOutcome(outcome: 'success' | 'fail' | 'empty'): void {
  shouldFail = outcome === 'fail';
  shouldEmpty = outcome === 'empty';
}

export function loadSeatsFixture(): Promise<Seat[]> {
  if (shouldFail) {
    return Promise.reject(new Error('fixture: seats load failed'));
  }
  if (shouldEmpty) {
    return Promise.resolve([]);
  }
  const rows: Seat[] = [];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  for (let r = 1; r <= 30; r++) {
    for (const c of columns) {
      const isExit = r === 12 || r === 13;
      const tier = isExit ? 'extra-legroom' : r <= 5 ? 'premium' : 'standard';
      const price = tier === 'premium' ? 150000 : tier === 'extra-legroom' ? 100000 : 50000;
      const available = !(r === 3 && (c === 'A' || c === 'B')) && !(r === 15 && c === 'D');
      rows.push({
        seat_id: `seat_${r}${c}`,
        row: r,
        column: c,
        available,
        price_amount: available ? price : null,
        fare_tier: available ? tier : null,
      });
    }
  }
  return Promise.resolve(rows);
}