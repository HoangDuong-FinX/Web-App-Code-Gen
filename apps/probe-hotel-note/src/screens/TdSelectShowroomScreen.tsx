import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadShowrooms } from '../fixtures/showrooms';
import type { Showroom } from '../types';

export default function TdSelectShowroomScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId } = useApp();
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await loadShowrooms();
        if (!cancelled) setShowrooms(data);
      } catch {
        // error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function selectShowroom(showroom: Showroom): void {
    navigate('td-select-datetime', {
      currentCarId,
      selectedCar,
      testDriveBooking: { showroomId: showroom.id, showroomName: showroom.name, showroomAddress: showroom.address },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('car-detail', { currentCarId })} aria-label={t('tdShowroom.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('tdShowroom.title')}</h1>
      </header>

      {selectedCar && (
        <div className="flex gap-3 px-4 py-2 items-center">
          <img src={selectedCar.thumbnailUrl} alt={selectedCar.name} className="w-16 aspect-[4/3] object-cover rounded-lg" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{selectedCar.name}</span>
            <span className="text-xs text-blue-600">{selectedCar.formattedPrice}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-4 py-3" aria-label={t('tdShowroom.step')} data-testid="step-indicator">
        {[t('tdShowroom.steps.showroom'), t('tdShowroom.steps.datetime'), t('tdShowroom.steps.confirm')].map((label, i) => (
          <React.Fragment key={label}>
            <div className={`flex items-center gap-1 ${i === 0 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{i + 1}</span>
              <span className="text-xs font-medium">{label}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
          </React.Fragment>
        ))}
      </div>

      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {showrooms.map(sr => (
            <button key={sr.id} type="button" onClick={() => selectShowroom(sr)} aria-label={sr.name} data-testid="showroom-card" className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow flex flex-col gap-1">
              <span className="font-bold text-sm">{sr.name}</span>
              <span className="text-xs text-gray-500">{sr.address}</span>
              {sr.distance && <span className="text-xs text-gray-500">{sr.distance}</span>}
              <span className="text-xs text-gray-500">{t('tdShowroom.hours')} {sr.hours}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
