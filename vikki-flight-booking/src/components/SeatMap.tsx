import React from 'react';

interface SeatMapProps {
  testId?: string;
}

export default function SeatMap({ testId }: SeatMapProps) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="grid gap-1" data-testid={testId} style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
      <div></div>
      {cols.map((col) => (
        <div key={col} className="text-xs font-bold text-center text-gray-600">
          {col}
        </div>
      ))}
      {rows.map((row) => (
        <React.Fragment key={row}>
          <div className="text-xs font-bold text-gray-600">{row}</div>
          {cols.map((col) => (
            <button
              key={`${row}${col}`}
              className="w-8 h-8 border border-gray-300 rounded text-xs hover:bg-blue-100"
            >
              {row}{col}
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
