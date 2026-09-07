import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Button } from '../ui/Button';
import { vi } from '../../i18n/vi';
import type { TripType } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: 'departure' | 'return';
  departureDate: string;
  returnDate: string | null;
  tripType: TripType;
  onConfirm: (departureDate: string, returnDate: string | null) => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

interface CalendarProps {
  year: number;
  month: number; // 1-based
  selectedDate: string | null;
  minDate: string;
  onSelect: (date: string) => void;
}

const CalendarGrid: React.FC<CalendarProps> = ({ year, month, selectedDate, minDate, onSelect }) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 text-center text-xs text-[var(--color-text-secondary)] mb-1">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = iso === selectedDate;
          const isPast = iso < minDate;
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => !isPast && onSelect(iso)}
              aria-label={`Ngày ${day} tháng ${month} năm ${year}`}
              aria-pressed={isSelected}
              className={`w-full aspect-square rounded-full text-sm flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)] transition-colors ${
                isPast
                  ? 'text-[var(--gray-200)] cursor-not-allowed'
                  : isSelected
                  ? 'bg-[var(--vikki-vkblue-700)] text-white font-semibold'
                  : 'hover:bg-[var(--gray-50)] text-[var(--color-text-primary)]'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const DatePickerModal: React.FC<Props> = ({
  open,
  onClose,
  mode,
  departureDate,
  returnDate,
  tripType,
  onConfirm,
}) => {
  const [tab, setTab] = useState<'departure' | 'return'>(mode);
  const [localDep, setLocalDep] = useState(departureDate);
  const [localRet, setLocalRet] = useState(returnDate);
  const [viewYear, setViewYear] = useState(() => {
    const d = new Date(departureDate + 'T00:00:00');
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(departureDate + 'T00:00:00');
    return d.getMonth() + 1;
  });

  React.useEffect(() => {
    if (open) {
      setTab(mode);
      setLocalDep(departureDate);
      setLocalRet(returnDate);
    }
  }, [open, mode, departureDate, returnDate]);

  const today = new Date().toISOString().slice(0, 10);

  const handleSelect = (iso: string) => {
    if (tab === 'departure') {
      setLocalDep(iso);
      if (tripType === 'round-trip') setTab('return');
    } else {
      setLocalRet(iso);
    }
  };

  const handleConfirm = () => {
    onConfirm(localDep, tripType === 'round-trip' ? localRet : null);
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectedForTab = tab === 'departure' ? localDep : (localRet ?? null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vi.datePicker.title}
      data-testid="date-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        {tripType === 'round-trip' && (
          <SegmentedControl
            options={[
              { label: vi.datePicker.departureTab, value: 'departure' },
              { label: vi.datePicker.returnTab, value: 'return' },
            ]}
            value={tab}
            onChange={(v) => setTab(v as 'departure' | 'return')}
            ariaLabel={vi.datePicker.title}
            data-testid="trip-type-tabs"
          />
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Tháng trước"
            className="p-2 rounded-full hover:bg-[var(--gray-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)]"
          >
            ‹
          </button>
          <h3 className="text-[var(--text-headline)] text-[var(--color-text-primary)]">
            {monthNames[viewMonth - 1]} {viewYear}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Tháng sau"
            className="p-2 rounded-full hover:bg-[var(--gray-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)]"
          >
            ›
          </button>
        </div>

        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedForTab}
          minDate={today}
          onSelect={handleSelect}
          data-testid="calendar-grid"
        />

        <Button
          variant="primary"
          ariaLabel={vi.datePicker.confirmLabel}
          data-testid="confirm-button"
          onClick={handleConfirm}
          fullWidth
        >
          {vi.datePicker.confirm}
        </Button>
      </div>
    </Modal>
  );
};
