import { useState, useMemo } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';

interface DatePickerScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

function generateMonths(count: number): Array<{ year: number; month: number; days: Array<{ date: string; day: number; disabled: boolean }> }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const months: Array<{ year: number; month: number; days: Array<{ date: string; day: number; disabled: boolean }> }> = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<{ date: string; day: number; disabled: boolean }> = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dd = new Date(year, month, day);
      const dateStr = dd.toISOString().slice(0, 10);
      days.push({ date: dateStr, day, disabled: dd < today });
    }
    months.push({ year, month, days });
  }
  return months;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function DatePickerScreen({ navigate }: DatePickerScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [selDep, setSelDep] = useState(state.departureDate);
  const [selRet, setSelRet] = useState(state.returnDate);
  const [selectingReturn, setSelectingReturn] = useState(false);
  const months = useMemo(() => generateMonths(6), []);

  function handleDayClick(date: string) {
    if (state.tripType === 'roundTrip' && selectingReturn) {
      if (date < selDep) { setSelDep(date); setSelectingReturn(false); } else { setSelRet(date); }
    } else {
      setSelDep(date);
      if (state.tripType === 'roundTrip') {
        if (date > selRet) { const d = new Date(date); d.setDate(d.getDate() + 4); setSelRet(d.toISOString().slice(0, 10)); }
        setSelectingReturn(true);
      }
    }
  }

  function handleConfirm() {
    dispatch({ type: 'SET_DEPARTURE_DATE', payload: selDep });
    if (state.tripType === 'roundTrip') { dispatch({ type: 'SET_RETURN_DATE', payload: selRet }); }
    navigate('search');
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col" aria-label={t.datePicker.heading}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">{t.datePicker.heading}</h1>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-xl" onClick={() => navigate('search')} aria-label={t.datePicker.close} data-testid="close-date-picker">{String.fromCharCode(10005)}</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {months.map((m) => (
          <div key={`${m.year}-${m.month}`} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">{MONTH_NAMES[m.month]} {m.year}</h2>
            <div className="grid grid-cols-7 gap-1">
              {m.days.map((day) => {
                const isSelected = day.date === selDep || (state.tripType === 'roundTrip' && day.date === selRet);
                const isInRange = state.tripType === 'roundTrip' && day.date > selDep && day.date < selRet;
                return (<button key={day.date} className={`h-10 w-full rounded text-xs font-medium transition-colors ${day.disabled ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-red-600 text-white' : isInRange ? 'bg-red-100 text-red-800' : 'text-gray-700 hover:bg-gray-100'}`} disabled={day.disabled} onClick={() => handleDayClick(day.date)} aria-label={day.date} aria-pressed={isSelected}>{day.day}</button>);
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-700" data-testid="selected-departure-label">{t.datePicker.departureLabel.replace('{date}', selDep)}</p>
        {state.tripType === 'roundTrip' && <p className="text-sm text-gray-700 mt-1" data-testid="selected-return-label">{t.datePicker.returnLabel.replace('{date}', selRet)}</p>}
        <button className="w-full mt-3 py-3 bg-red-600 text-white rounded-lg font-semibold text-sm" onClick={handleConfirm} aria-label={t.datePicker.confirm} data-testid="confirm-date">{t.datePicker.confirm}</button>
      </div>
    </div>
  );
}
