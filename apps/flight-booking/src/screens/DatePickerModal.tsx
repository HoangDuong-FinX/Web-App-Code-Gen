import { useState, useMemo } from 'react';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';

interface Props {
  context: 'departure' | 'return';
  selectedDepartureDate: string | null;
  selectedReturnDate: string | null;
  onSelect: (date: string) => void;
  onClose: () => void;
}

interface DayInfo {
  date: string;
  dayNum: number;
  isPast: boolean;
  isSelected: boolean;
  price: number | null;
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function DatePickerModal({ context, selectedDepartureDate, selectedReturnDate, onSelect, onClose }: Props) {
  const currentSelected = context === 'departure' ? selectedDepartureDate : selectedReturnDate;
  const [selected, setSelected] = useState<string | null>(currentSelected);

  const months = useMemo(() => {
    const result: { label: string; days: DayInfo[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    for (let m = 0; m < 6; m++) {
      const monthDate = new Date(startMonth.getFullYear(), startMonth.getMonth() + m, 1);
      const label = monthDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
      const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
      const firstDow = monthDate.getDay();

      const days: DayInfo[] = [];
      // Padding for first week
      for (let p = 0; p < firstDow; p++) {
        days.push({ date: '', dayNum: 0, isPast: true, isSelected: false, price: null });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(monthDate.getFullYear(), monthDate.getMonth(), d);
        const dateStr = dateObj.toISOString().slice(0, 10);
        const isPast = dateObj < today;
        const isMin = context === 'return' && selectedDepartureDate ? dateStr < selectedDepartureDate : false;
        days.push({
          date: dateStr,
          dayNum: d,
          isPast: isPast || isMin,
          isSelected: dateStr === selected,
          price: isPast ? null : 890000 + (d % 7) * 50000,
        });
      }
      result.push({ label, days });
    }
    return result;
  }, [context, selectedDepartureDate, selected]);

  const title = context === 'departure' ? t('datePicker.departure.title') : t('datePicker.return.title');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-[#F9FBF9] w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-medium text-[#191919]">{title}</h2>
          <button type="button" aria-label={t('datePicker.close.aria')} data-testid="close-action" className="w-8 h-8 flex items-center justify-center text-xl" onClick={onClose}>
            \u2715
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-2">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="text-center text-xs font-medium text-[#999999]">{wd}</div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {months.map((month) => (
            <div key={month.label} className="mb-4">
              <p className="text-base font-semibold text-[#191919] py-3 capitalize">{month.label}</p>
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    data-testid={day.date ? 'day-cell' : undefined}
                    aria-label={day.date ? `${day.date}${day.price ? ' - ' + formatPrice(day.price) : ''}` : undefined}
                    disabled={day.isPast || !day.date}
                    className={`rounded-lg p-1 text-center flex flex-col items-center min-h-[40px] ${
                      day.isSelected ? 'bg-[#E12127] text-white' :
                      day.isPast || !day.date ? 'text-[#D9D9D9]' :
                      'text-[#191919] hover:bg-[#E12127]/10'
                    }`}
                    onClick={() => day.date && !day.isPast && setSelected(day.date)}
                  >
                    {day.dayNum > 0 && (
                      <>
                        <span className="text-sm">{day.dayNum}</span>
                        {day.price !== null && !day.isPast && (
                          <span className={`text-[10px] ${day.isSelected ? 'text-white/80' : 'text-[#E12127]'}`}>
                            {(day.price / 1000).toFixed(0)}k
                          </span>
                        )}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <button
            type="button"
            data-testid="confirm-action"
            aria-label={t('datePicker.confirm.aria')}
            disabled={!selected}
            className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium disabled:opacity-50"
            onClick={() => selected && onSelect(selected)}
          >
            {t('datePicker.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
