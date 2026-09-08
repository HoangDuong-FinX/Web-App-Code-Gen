import React, { useState, useMemo } from 'react';
import { t } from '../i18n/vi';

interface DatePickerModalProps {
  departureDate: string;
  returnDate: string;
  isRoundTrip: boolean;
  onConfirm: (departure: string, returnDate: string) => void;
  onClose: () => void;
}

export function DatePickerModal({ departureDate, returnDate, isRoundTrip, onConfirm, onClose }: DatePickerModalProps) {
  const [selectedDeparture, setSelectedDeparture] = useState(departureDate);
  const [selectedReturn, setSelectedReturn] = useState(returnDate);
  const [selectingField, setSelectingField] = useState<'departure' | 'return'>('departure');

  const months = useMemo(() => {
    const result: { year: number; month: number; days: { date: string; day: number; disabled: boolean }[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let m = 0; m < 6; m++) {
      const d = new Date(today.getFullYear(), today.getMonth() + m, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfWeek = d.getDay();
      const days: { date: string; day: number; disabled: boolean }[] = [];

      for (let pad = 0; pad < firstDayOfWeek; pad++) {
        days.push({ date: '', day: 0, disabled: true });
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dateStr = dateObj.toISOString().split('T')[0];
        days.push({
          date: dateStr,
          day,
          disabled: dateObj < today,
        });
      }

      result.push({ year, month, days });
    }
    return result;
  }, []);

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const handleDayClick = (dateStr: string) => {
    if (!dateStr) return;
    if (selectingField === 'departure') {
      setSelectedDeparture(dateStr);
      if (isRoundTrip) {
        if (selectedReturn && dateStr > selectedReturn) {
          const d = new Date(dateStr);
          d.setDate(d.getDate() + 4);
          setSelectedReturn(d.toISOString().split('T')[0]);
        }
        setSelectingField('return');
      }
    } else {
      if (dateStr < selectedDeparture) return;
      setSelectedReturn(dateStr);
    }
  };

  const isInRange = (dateStr: string): boolean => {
    if (!isRoundTrip || !selectedDeparture || !selectedReturn) return false;
    return dateStr >= selectedDeparture && dateStr <= selectedReturn;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" aria-label={t('datePicker.titleLabel')}>
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('datePicker.title')}</h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label={t('datePicker.close')}
            data-testid="close-action"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {months.map(({ year, month, days }) => (
            <div key={`${year}-${month}`} className="mb-6">
              <h3 className="mb-2 text-sm font-bold text-gray-700" data-testid="month-year-label">
                {monthNames[month]} {year}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-gray-400">{d}</div>
                ))}
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`flex h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                      day.disabled || !day.date
                        ? 'cursor-default text-gray-300'
                        : day.date === selectedDeparture || day.date === selectedReturn
                        ? 'bg-red-500 font-bold text-white'
                        : isInRange(day.date)
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={day.disabled || !day.date}
                    onClick={() => handleDayClick(day.date)}
                    aria-label={day.date || undefined}
                    data-testid="day-number"
                  >
                    {day.day > 0 ? day.day : ''}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 p-4">
          <div className="flex gap-4 text-sm">
            <span data-testid="selected-departure-display">
              {selectedDeparture || '—'}
            </span>
            {isRoundTrip && (
              <span data-testid="selected-return-display">
                {selectedReturn || '—'}
              </span>
            )}
          </div>
          <button
            type="button"
            className="rounded-lg bg-red-500 px-6 py-2 text-sm font-medium text-white hover:bg-red-600"
            onClick={() => onConfirm(selectedDeparture, selectedReturn)}
            aria-label={t('datePicker.confirmLabel')}
            data-testid="confirm-action"
          >
            {t('datePicker.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}