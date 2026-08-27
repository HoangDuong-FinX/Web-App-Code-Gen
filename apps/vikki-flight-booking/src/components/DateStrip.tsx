import React from 'react';

interface DateStripProps {
  selectedDate: string;
  range?: number;
  onDateSelect: (date: string) => void;
  ariaLabel?: string;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return `${days[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}

export function DateStrip({ selectedDate, range = 3, onDateSelect, ariaLabel }: DateStripProps) {
  const dates: string[] = [];
  for (let i = -range; i <= range; i++) {
    dates.push(addDays(selectedDate, i));
  }

  return (
    <div className="date-strip" role="listbox" aria-label={ariaLabel}>
      {dates.map((date) => (
        <button
          key={date}
          className={`date-strip__item ${date === selectedDate ? 'date-strip__item--active' : ''}`}
          role="option"
          aria-selected={date === selectedDate}
          onClick={() => onDateSelect(date)}
          type="button"
        >
          {formatShortDate(date)}
        </button>
      ))}
    </div>
  );
}

