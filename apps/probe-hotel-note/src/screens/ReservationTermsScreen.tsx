import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadReservationTerms } from '../fixtures/payment';
import type { ReservationTerms } from '../types';

export default function ReservationTermsScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId } = useApp();
  const [terms, setTerms] = useState<ReservationTerms | null>(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await loadReservationTerms();
        if (!cancelled) setTerms(data);
      } catch {
        // error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleConfirmPay(): void {
    if (!terms) return;
    navigate('reservation-payment', { currentCarId, selectedCar, reservationTerms: terms });
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label={t('resPayment.processing')} /></div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('car-detail', { currentCarId })} aria-label={t('resTerms.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('resTerms.title')}</h1>
      </header>

      {/* Car summary */}
      {selectedCar && (
        <div className="flex gap-3 px-4 py-3 items-center">
          <img src={selectedCar.thumbnailUrl} alt={selectedCar.name} className="w-20 aspect-[4/3] object-cover rounded-lg" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">{selectedCar.name}</span>
            <span className="text-sm text-blue-600">{selectedCar.formattedPrice}</span>
          </div>
        </div>
      )}

      {/* Deposit info */}
      {terms && (
        <section className="p-4">
          <h3 className="text-sm font-bold text-gray-500 mb-3">{t('resTerms.depositInfo')}</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t('resTerms.depositAmount')}</span>
              <span className="text-lg font-bold text-blue-600">{terms.depositAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t('resTerms.holdPeriod')}</span>
              <span className="text-sm font-medium">{terms.holdPeriod}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-500">{t('resTerms.cancellation')}</span>
              <span className="text-sm">{terms.cancellationPolicy}</span>
            </div>
          </div>
        </section>
      )}

      <div className="p-4 flex flex-col gap-4 mt-auto">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            aria-label={t('resTerms.agreeAria')}
            data-testid="terms-agree"
            className="mt-0.5 w-5 h-5 text-blue-600 rounded"
          />
          <span className="text-sm">{t('resTerms.agree')}</span>
        </label>

        <button
          type="button"
          onClick={handleConfirmPay}
          disabled={!agreed}
          aria-label={t('resTerms.confirmPayAria')}
          data-testid="confirm-pay"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {t('resTerms.confirmPay')}
        </button>
      </div>
    </div>
  );
}
