import { SeatMapResponse } from '../types';

function generateRow(row: number): Array<{ seatId: string; row: number; col: string; state: 'available' | 'unavailable'; priceAmount: number | null; isEmergency: boolean }> {
  const cols = ['A', 'B', 'C', 'D'];
  return cols.map((col) => {
    const isUnavailable = Math.random() < 0.25;
    const isEmergencyRow = row === 12 || row === 13;
    return {
      seatId: `${row}${col}`,
      row,
      col,
      state: isUnavailable ? 'unavailable' as const : 'available' as const,
      priceAmount: isUnavailable ? null : (isEmergencyRow ? 150000 : 80000),
      isEmergency: isEmergencyRow,
    };
  });
}

const rows: Array<Array<{ seatId: string; row: number; col: string; state: 'available' | 'unavailable'; priceAmount: number | null; isEmergency: boolean }>> = [];
for (let r = 1; r <= 30; r++) {
  rows.push(generateRow(r));
}

export const fixtureSeatMap: SeatMapResponse = { rows };
