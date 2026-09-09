import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';
import { formatPrice } from '../utils';

interface DoneSuccessScreenProps { navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void; }

export function DoneSuccessScreen({ navigate }: DoneSuccessScreenProps) {
  const t = useT(); const state = useAppState(); const dispatch = useAppDispatch();
  const result = state.bookingResult;
  if (!result) { navigate('search'); return null; }

  function handleBookAnother() { dispatch({ type: 'RESET' }); navigate('search'); }
  function handleBackHome() { dispatch({ type: 'RESET' }); navigate('search'); }
  async function handleShare() {
    if (result && typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: t.done.bookingCode, text: `${t.done.bookingCode}: ${result.bookingCode}\n${t.done.amountCharged}: ${formatPrice(result.amount)}` }); } catch { /* user cancelled */ }
    }
  }
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <span className="text-6xl" aria-hidden="true">{String.fromCharCode(10004)}</span>
      <h1 className="text-2xl font-bold text-gray-900">{t.done.successHeading}</h1>
      <p className="text-2xl font-bold text-red-600" data-testid="amount-display" aria-label={t.done.amountCharged}>-{formatPrice(result.amount)}</p>
      <div className="w-full border border-gray-200 rounded-lg p-4" data-testid="booking-details">
        <div className="flex justify-between mb-2"><span className="text-sm text-gray-700">{t.done.bookingCode}</span><span className="font-bold text-sm" data-testid="booking-code">{result.bookingCode}</span></div>
        {result.transactionId && (<div className="flex justify-between mb-2"><span className="text-sm text-gray-700">{t.done.transactionId}</span><span className="text-sm" data-testid="transaction-id">{result.transactionId}</span></div>)}
        {result.vatRequested && <p className="text-xs text-gray-500" data-testid="vat-notice">{t.done.vatNotice}</p>}
      </div>
      {!result.viaHost && <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm w-full text-center" data-testid="simulation-warning" aria-live="polite">{t.done.simulationWarning}</p>}
      <button className={`w-full py-2 border border-gray-300 rounded-lg text-sm font-medium ${canShare ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}`} disabled={!canShare} onClick={handleShare} aria-label={t.done.share} data-testid="share-action">{t.done.share}</button>
      <div className="flex gap-3 w-full">
        <button className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors" onClick={handleBookAnother} aria-label={t.done.bookAnother} data-testid="cta-book-another">{t.done.bookAnother}</button>
        <button className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" onClick={handleBackHome} aria-label={t.done.backToHome} data-testid="cta-back-home">{t.done.backToHome}</button>
      </div>
    </div>
  );
}
