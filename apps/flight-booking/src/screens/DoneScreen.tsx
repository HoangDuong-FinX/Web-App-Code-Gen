import React from 'react';
import type { BookingState, ScreenId } from '../types';
import type { BookingAction } from '../App';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';

interface DoneScreenProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  onNavigate: (screen: ScreenId) => void;
}

export function DoneScreen({ state, dispatch, onNavigate }: DoneScreenProps) {
  const isSuccess = state.doneStatus === 'success' || state.doneStatus === 'simulated';
  const isPartial = state.doneStatus === 'partial';
  const isFailure = state.doneStatus === 'failure';

  const statusIcon = isFailure ? '\u274C' : isPartial ? '\u26A0\uFE0F' : '\u2705';
  const statusTitle = t(`done.${state.doneStatus}`);

  const handleBookAnother = () => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  };

  const handleGoHome = () => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  };

  const handleRetry = () => {
    dispatch({ type: 'CLEAR_PAYMENT_ERROR' });
    onNavigate('checkout');
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t('done.shareLabel'),
          text: `${statusTitle} - ${state.bookingCode}`,
        });
      } catch {
        /* user cancelled share */
      }
    }
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl" aria-hidden="true" data-testid="status-icon">{statusIcon}</span>
        <h1 className="text-2xl font-bold text-gray-900" aria-label={t('done.resultLabel')} data-testid="status-title">
          {statusTitle}
        </h1>
        {state.doneStatus === 'simulated' && (
          <div className="rounded-lg bg-yellow-50 p-3 text-yellow-700" aria-label={t('done.simulatedWarningLabel')} data-testid="simulated-warning">
            <p>{t('done.simulatedWarning')}</p>
          </div>
        )}
      </div>

      <p className="text-3xl font-bold text-gray-900" aria-label={t('done.amountLabel')} data-testid="amount-display">
        {isSuccess || isPartial ? '-' : ''}{formatVND(state.totalAmount)}
      </p>

      <div className="w-full flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
        {state.bookingCode && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-700">{t('done.bookingCode')}</span>
            <span className="text-sm font-bold text-gray-900" data-testid="booking-code">{state.bookingCode}</span>
          </div>
        )}
        {state.transactionId && !isFailure && (
          <div className="flex justify-between">
            <span className="text-sm text-gray-700">{t('done.transactionId')}</span>
            <span className="text-sm text-gray-700" data-testid="transaction-id">{state.transactionId}</span>
          </div>
        )}
        {isFailure && state.paymentError && (
          <p className="text-sm text-red-600" data-testid="failure-reason">{state.paymentError}</p>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        {(isSuccess || isPartial) && canShare && (
          <button
            type="button"
            className="w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleShare}
            aria-label={t('done.shareLabel')}
            data-testid="share-action"
          >
            {t('done.share')}
          </button>
        )}
        {(isSuccess || isPartial) && (
          <button
            type="button"
            className="w-full rounded-lg bg-red-500 py-3 text-center font-medium text-white hover:bg-red-600"
            onClick={handleBookAnother}
            aria-label={t('done.bookAnotherLabel')}
            data-testid="book-another-action"
          >
            {t('done.bookAnother')}
          </button>
        )}
        <button
          type="button"
          className="w-full rounded-lg border border-gray-300 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={handleGoHome}
          aria-label={t('done.goHomeLabel')}
          data-testid="go-home-action"
        >
          {t('done.goHome')}
        </button>
        {isFailure && (
          <button
            type="button"
            className="w-full rounded-lg bg-red-500 py-3 text-center font-medium text-white hover:bg-red-600"
            onClick={handleRetry}
            aria-label={t('done.retryLabel')}
            data-testid="retry-payment-action"
          >
            {t('done.retry')}
          </button>
        )}
      </div>
    </div>
  );
}