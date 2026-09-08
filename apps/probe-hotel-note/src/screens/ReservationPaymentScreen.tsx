import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { startDepositPayment, createReservation } from '../fixtures/payment';

export default function ReservationPaymentScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId, reservationTerms } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'bank-transfer' | 'credit-card' | 'e-wallet'>('bank-transfer');
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handlePayment(): Promise<void> {
    setError(null);
    setProcessing(true);
    try {
      await startDepositPayment();
      const reservation = await createReservation();
      navigate('reservation-success', {
        currentCarId,
        selectedCar,
        reservationResult: reservation,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'PAYMENT_DECLINED') {
        setError(t('resPayment.errorDeclined'));
      } else if (msg === 'CAR_UNAVAILABLE') {
        setError(t('resPayment.errorUnavailable'));
        setTimeout(() => navigate('car-detail', { currentCarId }), 3000);
      } else if (msg === 'PAYMENT_TIMEOUT') {
        setError(t('resPayment.errorTimeout'));
      } else if (msg === 'CAPABILITY_UNAVAILABLE') {
        setError(t('resPayment.errorCapability'));
      } else {
        setError(t('modal.networkError.body'));
      }
    } finally {
      setProcessing(false);
    }
  }

  const methods = [
    { value: 'bank-transfer' as const, label: t('resPayment.bankTransfer') },
    { value: 'credit-card' as const, label: t('resPayment.creditCard') },
    { value: 'e-wallet' as const, label: t('resPayment.eWallet') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('reservation-terms', { currentCarId, selectedCar })} aria-label={t('resPayment.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('resPayment.title')}</h1>
      </header>

      {/* Summary */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('resPayment.summary')}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('resPayment.car')}</span><span className="text-sm font-medium">{selectedCar?.name}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('resPayment.depositAmount')}</span><span className="text-lg font-bold text-blue-600">{reservationTerms?.depositAmount}</span></div>
        </div>
      </section>

      {/* Payment method */}
      <fieldset className="p-4">
        <legend className="text-sm font-bold text-gray-500 mb-2">{t('resPayment.paymentMethod')}</legend>
        {methods.map(m => (
          <label key={m.value} className="flex items-center gap-3 py-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value={m.value}
              checked={paymentMethod === m.value}
              onChange={() => setPaymentMethod(m.value)}
              aria-label={m.label}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">{m.label}</span>
          </label>
        ))}
      </fieldset>

      {error && (
        <p className="mx-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg" aria-live="polite" data-testid="payment-error">{error}</p>
      )}

      <div className="p-4 mt-auto flex flex-col gap-3">
        {processing && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label={t('resPayment.processing')} />
            <span className="text-sm text-gray-500">{t('resPayment.processing')}</span>
          </div>
        )}
        <button
          type="button"
          onClick={handlePayment}
          disabled={processing}
          aria-label={t('resPayment.submitAria')}
          data-testid="payment-submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {t('resPayment.submit')}
        </button>
      </div>
    </div>
  );
}
