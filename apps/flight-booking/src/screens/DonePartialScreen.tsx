import React from 'react';
import type { PaymentResult } from '../types';
import { t } from '../i18n/vi';

interface Props {
  paymentResult: PaymentResult | null;
  onGoHome: () => void;
}

export function DonePartialScreen({ paymentResult, onGoHome }: Props) {
  if (!paymentResult) return null;

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t('donePartial.title'),
          text: `${t('donePartial.bookingCode')}: ${paymentResult.bookingCode}`,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="flex flex-col items-center min-h-screen px-8 py-12">
      <div className="text-6xl mb-4 text-[#F59E0B]" aria-hidden="true" data-testid="result-icon">\u26A0\uFE0F</div>
      <h1 className="text-2xl font-bold text-center text-[#F59E0B] mb-2">{t('donePartial.title')}</h1>
      <p className="text-xl font-semibold mb-6" data-testid="result-amount">-{formatPrice(paymentResult.amount)}</p>

      <div className="w-full bg-white rounded-2xl p-4 mb-4" aria-label={t('donePartial.resultDetails.aria')}>
        <div className="flex justify-between mb-2">
          <span className="text-[#6B7280]">{t('donePartial.bookingCode')}</span>
          <span className="font-bold" data-testid="booking-code-value">{paymentResult.bookingCode}</span>
        </div>
        <p className="text-sm text-[#6B7280]" data-testid="partial-explanation">{t('donePartial.explanation')}</p>
      </div>

      <div className="w-full flex flex-col gap-3 mt-auto">
        {canShare && (
          <button type="button" className="w-full h-12 border border-[#E6E8E7] rounded-lg font-semibold text-[#1A1A1A]" aria-label={t('donePartial.share.aria')} data-testid="share-action" onClick={handleShare}>{t('donePartial.share')}</button>
        )}
        <button type="button" className="w-full h-14 bg-[#E12127] text-white rounded-lg font-semibold text-base hover:bg-[#c91d22]" aria-label={t('donePartial.goHome.aria')} data-testid="go-home-action" onClick={onGoHome}>{t('donePartial.goHome')}</button>
      </div>
    </div>
  );
}
