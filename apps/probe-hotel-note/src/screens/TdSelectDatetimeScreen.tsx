import React, { useState, useEffect } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadTimeSlots } from '../fixtures/showrooms';
import type { TimeSlot } from '../types';

export default function TdSelectDatetimeScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId, testDriveBooking } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSlotError(false);
    async function load() {
      try {
        const data = await loadTimeSlots();
        if (!cancelled) setSlots(data);
      } catch {
        if (!cancelled) setSlotError(true);
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedDate]);

  function handleContinue(): void {
    navigate('td-confirm', {
      currentCarId,
      selectedCar,
      testDriveBooking: { ...testDriveBooking, date: selectedDate, time: selectedTime },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('td-select-showroom', { currentCarId, selectedCar })} aria-label={t('tdDatetime.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('tdDatetime.title')}</h1>
      </header>

      <div className="flex items-center gap-2 px-4 py-3" aria-label={t('tdDatetime.step')} data-testid="step-indicator">
        {[t('tdShowroom.steps.showroom'), t('tdShowroom.steps.datetime'), t('tdShowroom.steps.confirm')].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-1 ${i <= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{i + 1}</span>
              <span className="text-xs font-medium">{label}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      <div className="mx-4 p-3 bg-gray-50 rounded-lg">
        <span className="text-xs font-bold text-gray-500">{t('tdDatetime.selectedShowroom')}</span>
        <p className="text-sm font-medium">{testDriveBooking.showroomName}</p>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <label htmlFor="td-date" className="text-sm font-medium">{t('tdDatetime.selectDate')}</label>
        <input id="td-date" type="date" value={selectedDate} min={minDate} onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }} aria-label={t('tdDatetime.selectDateAria')} data-testid="date-picker" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {selectedDate && (
        <section className="p-4">
          <h3 className="text-sm font-bold mb-3">{t('tdDatetime.selectTime')}</h3>
          {loadingSlots ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot: TimeSlot) => (
                <button key={slot.time} type="button" onClick={() => !slot.isUnavailable && setSelectedTime(slot.time)} disabled={slot.isUnavailable} aria-label={`${slot.time} - ${slot.isUnavailable ? t('tdDatetime.slotUnavailable') : t('tdDatetime.slotAvailable')}`} data-testid="time-slot"
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${slot.isUnavailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : selectedTime === slot.time ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:border-blue-400'}`}>
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {slotError && <p className="mx-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg" aria-live="polite" data-testid="slot-error">{t('tdDatetime.slotError')}</p>}

      <div className="p-4 mt-auto">
        <button type="button" onClick={handleContinue} disabled={!selectedDate || !selectedTime} aria-label={t('tdDatetime.continueAria')} data-testid="datetime-continue" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">{t('tdDatetime.continue')}</button>
      </div>
    </div>
  );
}
