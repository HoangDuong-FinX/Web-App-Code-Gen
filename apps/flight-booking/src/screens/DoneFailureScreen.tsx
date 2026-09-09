import React from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';
import { formatPrice } from '../utils';

interface DoneFailureScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

export function DoneFailureScreen({ navigate }: DoneFailureScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const result = state.bookingResult;

  if (!result) {
    navigate('search');
    return null;
  }

  function handleBackHome() {
    dispatch({ type: 'RESET' });
    navigate('search');
  }

  function handleRetry() {
    dispatch({ type: 'SET_BOOKING_RESULT', payload: { ...result!, status: 'failure' } });
    navigate('checkout');
  }

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <span className="text-6xl text-red-500" aria-hidden="true">&#10008;</span>
      <h1 className="text-2xl font-bold text-gray-900">{t.done.failureHeading}</h1>
      <p className="text-2xl font-bold text-gray-700" data-testid="amount-display" aria-label={t.done.amountAttempted}>
        {formatPrice(result.amount)}
      </p>

      <div className="w-full border border-gray-200 rounded-lg p-4" data-testid="booking-details">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">{t.done.bookingCode}</span>
          <span className="font-bold text-sm" data-testid="booking-code">{result.bookingCode}</span>
        </div>
        {result.failureReason && (
          <p className="text-red-600 text-sm" data-testid="failure-reason">
            {t.done.failureReason}: {result.failureReason}
          </p>
        )}
      </div>

      {!result.viaHost && (
        <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm w-full text-center" data-testid="simulation-warning" aria-live="polite">
          {t.done.simulationWarning}
        </p>
      )}

      <div className="flex gap-3 w-full">
        <button
          className="flex-1 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={handleBackHome}
          aria-label={t.done.backToHome}
          data-testid="cta-back-home"
        >
          {t.done.backToHome}
        </button>
        <button
          className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
          onClick={handleRetry}
          aria-label={t.done.retry}
          data-testid="cta-retry"
        >
          {t.done.retry}
        </button>
      </div>
    </div>
  );
}
