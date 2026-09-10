import React from 'react';
import type { PaymentResult } from '../types';
import { t } from '../i18n/vi';

interface Props {
  paymentResult: PaymentResult | null;
  onRetry: () => void;
  onGoHome: () => void;
}

export function DoneFailedScreen({ paymentResult, onRetry, onGoHome }: Props) {
  if (!paymentResult) return null;

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  return (
    <div className="flex flex-col items-center min-h-screen px-8 py-12">
      <div className="text-6xl mb-4 text-[#EF4444]" aria-hidden="true" data-testid="result-icon">\u274C</div>
      <h1 className="text-2xl font-bold text-center text-[#EF4444] mb-2">{t('doneFailed.title')}</h1>
      <p className="text-xl font-semibold mb-6" data-testid="result-amount">{formatPrice(paymentResult.amount)}</p>

      <div className="w-full bg-white rounded-2xl p-4 mb-4" aria-label={t('doneFailed.resultDetails.aria')}>
        {paymentResult.bookingCode && (
          <div className="flex justify-between mb-2">
            <span className="text-[#6B7280]">{t('doneFailed.bookingCode')}</span>
            <span className="font-bold" data-testid="booking-code-value">{paymentResult.bookingCode}</span>
          </div>
        )}
        {paymentResult.failureReason && (
          <p className="text-sm text-[#EF4444]" data-testid="failure-reason">{paymentResult.failureReason}</p>
        )}
        {paymentResult.sdkError && (
          <p className="text-xs text-[#6B7280] mt-1" data-testid="sdk-error-raw">{paymentResult.sdkError}</p>
        )}
      </div>

      <div className="w-full flex flex-col gap-3 mt-auto">
        <button type="button" className="w-full h-14 bg-[#E12127] text-white rounded-lg font-semibold text-base hover:bg-[#c91d22]" aria-label={t('doneFailed.retry.aria')} data-testid="retry-action" onClick={onRetry}>{t('doneFailed.retry')}</button>
        <button type="button" className="w-full h-12 border border-[#E6E8E7] rounded-lg font-semibold text-[#1A1A1A]" aria-label={t('doneFailed.goHome.aria')} data-testid="go-home-action" onClick={onGoHome}>{t('doneFailed.goHome')}</button>
      </div>
    </div>
  );
}
