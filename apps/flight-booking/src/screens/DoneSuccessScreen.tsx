import React from 'react';
import type { PaymentResult } from '../types';
import { t } from '../i18n/vi';

interface Props {
  paymentResult: PaymentResult | null;
  vatRequested: boolean;
  onBookAnother: () => void;
  onGoHome: () => void;
}

export function DoneSuccessScreen({ paymentResult, vatRequested, onBookAnother, onGoHome }: Props) {
  if (!paymentResult) return null;

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t('doneSuccess.title'),
          text: `${t('doneSuccess.bookingCode')}: ${paymentResult.bookingCode}`,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="flex flex-col items-center min-h-screen px-8 py-12">
      <div className="text-6xl mb-4 text-[#22C55E]" aria-hidden="true" data-testid="result-icon">\u2705</div>
      <h1 className="text-2xl font-bold text-center text-[#22C55E] mb-2">{t('doneSuccess.title')}</h1>
      <p className="text-xl font-semibold mb-6" data-testid="result-amount">-{formatPrice(paymentResult.amount)}</p>

      <div className="w-full bg-white rounded-2xl p-4 mb-4" aria-label={t('doneSuccess.resultDetails.aria')}>
        <div className="flex justify-between mb-2">
          <span className="text-[#6B7280]">{t('doneSuccess.bookingCode')}</span>
          <span className="font-bold" data-testid="booking-code-value">{paymentResult.bookingCode}{paymentResult.returnBookingCode ? ` / ${paymentResult.returnBookingCode}` : ''}</span>
        </div>
        {paymentResult.transactionId && (
          <div className="flex justify-between">
            <span className="text-[#6B7280]">{t('doneSuccess.transactionId')}</span>
            <span className="font-semibold" data-testid="transaction-id-value">{paymentResult.transactionId}</span>
          </div>
        )}
      </div>

      {vatRequested && (
        <p className="text-sm text-[#6B7280] mb-4" data-testid="vat-notice">{t('doneSuccess.vatNotice')}</p>
      )}

      {paymentResult.simulated && (
        <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4" role="alert" data-testid="simulated-warning">
          <p className="text-sm text-yellow-700">{t('doneSuccess.simulatedWarning')}</p>
        </div>
      )}

      <div className="w-full flex flex-col gap-3 mt-auto">
        {canShare && (
          <button type="button" className="w-full h-12 border border-[#E6E8E7] rounded-lg font-semibold text-[#1A1A1A]" aria-label={t('doneSuccess.share.aria')} data-testid="share-action" onClick={handleShare}>{t('doneSuccess.share')}</button>
        )}
        <button type="button" className="w-full h-14 bg-[#E12127] text-white rounded-lg font-semibold text-base hover:bg-[#c91d22]" aria-label={t('doneSuccess.bookAnother.aria')} data-testid="book-another-action" onClick={onBookAnother}>{t('doneSuccess.bookAnother')}</button>
        <button type="button" className="w-full h-12 border border-[#E6E8E7] rounded-lg font-semibold text-[#1A1A1A]" aria-label={t('doneSuccess.goHome.aria')} data-testid="go-home-action" onClick={onGoHome}>{t('doneSuccess.goHome')}</button>
      </div>
    </div>
  );
}
