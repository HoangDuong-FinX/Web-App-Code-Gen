import React from 'react';

interface CalendarProps {
  month?: number;
  year?: number;
  testId?: string;
}

export default function Calendar({ month = 8, year = 2026, testId }: CalendarProps) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="grid grid-cols-7 gap-2" data-testid={testId}>
      {days.map((day, i) => (
        <button
          key={i}
          className={`p-2 text-sm rounded ${
            day
              ? 'border border-gray-300 hover:bg-blue-50'
              : 'text-gray-300'
          }`}
          disabled={!day}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
