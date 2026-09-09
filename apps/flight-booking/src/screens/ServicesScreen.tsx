import { useState } from 'react';
import { useT } from '../i18n/index';
import { useAppState } from '../store';
import type { ScreenId, AncillarySelection, SeatSelection } from '../types';
import type { NavigationState } from '../App';
import { HoldTimerBadge } from '../components/HoldTimerBadge';
import { sdk } from '../sdk';

interface ServicesScreenProps { navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void; }

export function ServicesScreen({ navigate }: ServicesScreenProps) {
  const t = useT(); const state = useAppState();
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  if (!state.outboundSession) { navigate('search'); return null; }

  const activeTiles = [
    { key: 'seatSelection', label: t.services.seatSelection, testId: 'tile-seat-selection', onClick: () => navigate('seats') },
    { key: 'meals', label: t.services.meals, testId: 'tile-meals', onClick: () => navigate('meals-baggage', { mealsBaggageMode: 'meals' }) },
    { key: 'baggage', label: t.services.baggageTransfer, testId: 'tile-baggage', onClick: () => navigate('meals-baggage', { mealsBaggageMode: 'baggage' }) },
  ];
  const disabledTiles = [
    { key: 'insurance', label: t.services.insurance, testId: 'tile-insurance' }, { key: 'dutyFree', label: t.services.dutyFree, testId: 'tile-duty-free' },
    { key: 'souvenirs', label: t.services.souvenirs, testId: 'tile-souvenirs' }, { key: 'hotel', label: t.services.hotel, testId: 'tile-hotel' },
    { key: 'activities', label: t.services.activities, testId: 'tile-activities' }, { key: 'transfer', label: t.services.transfer, testId: 'tile-transfer' },
  ];

  async function handleContinue() {
    if (state.holdExpired) return;
    setLoading(true); setError(null);
    const promises: Promise<{ isSuccess: boolean }>[] = [];
    if (state.outboundAncillary.length > 0) {
      const selections = state.outboundAncillary.flatMap((s: AncillarySelection) => Array.from({ length: s.quantity }, () => ({ passenger_id: state.passengerForms[0]?.passengerId ?? 'pax_1', option_id: s.optionId })));
      promises.push(sdk.http.post(`/sessions/${state.outboundSession!.sessionId}/ancillary-selections`, { selections }));
    }
    if (state.outboundSeats.length > 0) {
      promises.push(sdk.http.post(`/sessions/${state.outboundSession!.sessionId}/seat-selections`, { selections: state.outboundSeats.map((s: SeatSelection) => ({ passenger_index: s.passengerIndex, seatId: s.seatId })) }));
    }
    if (state.tripType === 'roundTrip' && state.returnSession) {
      if (state.returnAncillary.length > 0) {
        const selections = state.returnAncillary.flatMap((s: AncillarySelection) => Array.from({ length: s.quantity }, () => ({ passenger_id: state.passengerForms[0]?.passengerId ?? 'pax_1', option_id: s.optionId })));
        promises.push(sdk.http.post(`/sessions/${state.returnSession.sessionId}/ancillary-selections`, { selections }));
      }
      if (state.returnSeats.length > 0) {
        promises.push(sdk.http.post(`/sessions/${state.returnSession.sessionId}/seat-selections`, { selections: state.returnSeats.map((s: SeatSelection) => ({ passenger_index: s.passengerIndex, seatId: s.seatId })) }));
      }
    }
    if (promises.length > 0) { const results = await Promise.all(promises); if (results.some((r) => !r.isSuccess)) { setError(t.services.saveError); setLoading(false); return; } }
    setLoading(false); navigate('review');
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t.services.heading}</h1>
      <HoldTimerBadge navigate={navigate} />
      <div className="grid grid-cols-3 gap-3">
        {activeTiles.map((tile) => (<button key={tile.key} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-red-400 transition-colors min-h-[80px]" onClick={tile.onClick} aria-label={tile.label} data-testid={tile.testId}><span className="text-2xl mb-1">{String.fromCharCode(9992)}</span><span className="text-xs text-center font-medium text-gray-700">{tile.label}</span></button>))}
        {disabledTiles.map((tile) => (<button key={tile.key} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed min-h-[80px] relative" disabled aria-label={`${tile.label} - ${t.services.comingSoon}`} data-testid={tile.testId}><span className="text-2xl mb-1">{String.fromCharCode(9992)}</span><span className="text-xs text-center font-medium text-gray-400">{tile.label}</span><span className="absolute top-1 right-1 bg-amber-100 text-amber-700 text-[8px] px-1 rounded">{t.services.comingSoon}</span></button>))}
      </div>
      <button className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors ${!loading && !state.holdExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`} disabled={loading || state.holdExpired} onClick={handleContinue} aria-label={t.services.continueBtn} data-testid="services-continue">{loading ? t.common.loading : t.services.continueBtn}</button>
      {error && <p className="text-red-600 text-xs" data-testid="service-error-message" aria-live="assertive">{error}</p>}
    </div>
  );
}
