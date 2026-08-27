import React, { useCallback } from 'react';
import { useBooking } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import type { ScreenId } from '../types';

interface PaymentFailedScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// StatusBadge — same custom component as success screen
function StatusBadge({ status, text, ariaLabel }: { status: 'success' | 'failed' | 'partial' | 'warning'; text: string; ariaLabel: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    success: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="#22c55e" strokeWidth="3" fill="#f0fdf4" />
        <path d="M15 24L21 30L33 18" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    failed: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="#ef4444" strokeWidth="3" fill="#fef2f2" />
        <path d="M18 18L30 30M30 18L18 30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    partial: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="#eab308" strokeWidth="3" fill="#fefce8" />
        <path d="M24 16V26M24 32V32.01" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    warning: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="#f97316" strokeWidth="3" fill="#fff7ed" />
        <path d="M24 16V26M24 32V32.01" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  };
  return (
    <div className={`status-badge status-badge--${status}`} aria-label={ariaLabel}>
      {iconMap[status]}
      <span className="status-badge__text">{text}</span>
    </div>
  );
}

export function PaymentFailedScreen({ onNavigate }: PaymentFailedScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();

  const paymentResult = state.paymentResult;
  const errorReason = paymentResult?.errorReason ?? t('paymentFailed.defaultError');
  const chargeStatusMessage = paymentResult?.chargeStatusMessage ?? t('paymentFailed.noCharge');
  const totalAmount = state.paymentInquiry?.amount ?? 0;

  // Build summary strings from state
  const journeySummary = state.origin && state.destination
    ? `${state.origin.city} (${state.origin.code}) \u2192 ${state.destination.city} (${state.destination.code})`
    : '';

  const passengersSummary = t('passengers.countSummary')
    .replace('{adults}', String(state.passengerCount.adults))
    .replace('{childrenText}', state.passengerCount.children > 0 ? t('passengers.children').replace('{count}', String(state.passengerCount.children)) : '')
    .replace('{infantsText}', state.passengerCount.infants > 0 ? t('passengers.infants').replace('{count}', String(state.passengerCount.infants)) : '');

  const servicesCount = state.selectedServices.length + state.returnSelectedServices.length;
  const servicesSummary = servicesCount > 0 ? `${servicesCount} ${t('paymentSuccess.servicesSelected')}` : t('review.noServices');

  // Retry: navigate back to checkout with session preserved (AC-02)
  const handleRetry = useCallback(() => {
    onNavigate('checkout');
  }, [onNavigate]);

  // Home: reset store and navigate to search
  const handleNavigateHome = useCallback(() => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  }, [dispatch, onNavigate]);

  return (
    <div className="screen screen--payment-failed">
      <TopBar
        title={t('paymentFailed.title')}
        showBackArrow={false}
        ariaLabel={t('paymentFailed.title')}
      />

      <div className="screen__content">
        <StatusBadge
          status="failed"
          text={t('paymentFailed.heading')}
          ariaLabel={t('paymentFailed.statusAriaLabel')}
        />

        {/* Error reason from Payment Hub */}
        <p className="payment-failed__error-reason" aria-label={t('paymentFailed.reasonAriaLabel').replace('{reason}', errorReason)}>
          {errorReason}
        </p>

        {/* Charge status message — critical per AC-03 */}
        <p className="payment-failed__charge-status" role="alert" aria-label={chargeStatusMessage}>
          {chargeStatusMessage}
        </p>

        {/* Amount without minus sign per AC-02 */}
        <div className="payment-failed__amount" aria-label={t('paymentFailed.amountAriaLabel').replace('{amount}', formatPrice(totalAmount))}>
          <span className="payment-failed__amount-value">{formatPrice(totalAmount)}</span>
          <span className="payment-failed__amount-currency">VND</span>
        </div>

        <BookingSummaryCard
          collapsed={true}
          expandable={true}
          journey={journeySummary}
          passengers={passengersSummary}
          services={servicesSummary}
          totalAmount={`${formatPrice(totalAmount)} VND`}
          ariaLabel={t('paymentFailed.summaryAriaLabel')}
        />

        <div className="screen__actions screen__actions--row">
          <button
            className="btn-big btn-big--inactive"
            onClick={handleNavigateHome}
            aria-label={t('paymentFailed.homeAriaLabel')}
            type="button"
          >
            {t('paymentFailed.home')}
          </button>
          <button
            className="btn-big btn-big--active"
            onClick={handleRetry}
            aria-label={t('paymentFailed.retryAriaLabel')}
            type="button"
          >
            {t('paymentFailed.retry')}
          </button>
        </div>
      </div>
    </div>
  );
}
