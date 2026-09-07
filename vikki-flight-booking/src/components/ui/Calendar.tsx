import React, { useState } from 'react';
import { Button } from './Button';
import { t } from '../../i18n';

interface CalendarProps {
  selectedDate?: string; // YYYY-MM-DD
  onSelect?: (date: string) => void;
  'data-testid'?: string;
  minDate?: string;
}

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dateToIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

export function Calendar({ selectedDate, onSelect, 'data-testid': testId, minDate }: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(() => {
    const d = selectedDate ? isoToDate(selectedDate) : today;
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = selectedDate ? isoToDate(selectedDate) : today;
    return d.getMonth();
  });

  const minD = minDate ? isoToDate(minDate) : today;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: Array<{ day: number | null; iso: string | null; disabled: boolean }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null, iso: null, disabled: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const iso = dateToIso(date);
    cells.push({ day: d, iso, disabled: date < minD });
  }

  return (
    <div data-testid={testId} className="select-none">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" onClick={prevMonth} aria-label="Tháng trước" className="!px-2 !py-1">‹</Button>
        <span className="text-[15px] font-semibold">{MONTHS_VI[viewMonth]} {viewYear}</span>
        <Button variant="ghost" onClick={nextMonth} aria-label="Tháng sau" className="!px-2 !py-1">›</Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_VI.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-[var(--gray-500)] py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell.day || !cell.iso) return <div key={i} />;
          const isSelected = cell.iso === selectedDate;
          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => !cell.disabled && onSelect?.(cell.iso!)}
              disabled={cell.disabled}
              aria-label={`${cell.day} ${MONTHS_VI[viewMonth]}`}
              aria-pressed={isSelected}
              className={`aspect-square rounded-full text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] ${
                isSelected
                  ? 'bg-[var(--vikki-vkblue-500)] text-white'
                  : cell.disabled
                  ? 'text-[var(--gray-300)] cursor-not-allowed'
                  : 'hover:bg-[var(--vikki-vkblue-50)] text-[var(--gray-900)]'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
