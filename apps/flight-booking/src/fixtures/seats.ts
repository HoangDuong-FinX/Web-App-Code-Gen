import type { SeatRow } from '../types';

const columns = ['A', 'B', 'C', 'D'];

export const fixtureSeatRows: SeatRow[] = Array.from({ length: 30 }, (_, rowIdx) => {
  const row = rowIdx + 1;
  const isEmergencyRow = row === 12 || row === 13;
  return {
    row,
    seats: columns.map((col) => {
      const unavailable = Math.floor((rowIdx * 4 + columns.indexOf(col)) * 7919) % 5 === 0;
      return {
        code: `${row}${col}`,
        price: unavailable ? null : (isEmergencyRow ? 150000 : 50000 + row * 2000),
        unavailable,
        isEmergency: isEmergencyRow,
      };
    }),
  };
});
