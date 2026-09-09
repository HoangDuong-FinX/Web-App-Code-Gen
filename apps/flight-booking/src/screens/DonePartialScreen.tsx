import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';
import { formatPrice } from '../utils';

interface DonePartialScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

export function DonePartialScreen({ navigate }: DonePartialScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const result = state.bookingResult;
  if (!result) { navigate('search'); return null; }

  function handleBackHome() { dispatch({ type: 'RESET' }); navigate('search'); }

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <span className="text-6xl text-amber-500" aria-hidden="true">{String.fromCharCode(9888)}</span>
      <h1 className="text-2xl font-bold text-gray-900">{t.done.partialHeading}</h1>
      <p className="text-2xl font-bold text-gray-700" data-testid="amount-display" aria-label={t.done.amountCharged}>{formatPrice(result.amount)}</p>
      <div className="w-full border border-gray-200 rounded-lg p-4" data-testid="booking-details">
        <div className="flex justify-between mb-2"><span className="text-sm text-gray-700">{t.done.outboundBookingCode}</span><span className="font-bold text-sm" data-testid="outbound-booking-code">{result.outboundBookingCode ?? result.bookingCode}</span></div>
        <p className="text-sm text-gray-700" data-testid="partial-explanation">{t.done.partialExplanation}</p>
      </div>
      {!result.viaHost && <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm w-full text-center" data-testid="simulation-warning" aria-live="polite">{t.done.simulationWarning}</p>}
      <button className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors" onClick={handleBackHome} aria-label={t.done.backToHome} data-testid="cta-back-home">{t.done.backToHome}</button>
    </div>
  );
}
