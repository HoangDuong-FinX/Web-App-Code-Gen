import React, { useCallback } from 'react';
import { useBooking } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import type { ScreenId } from '../types';

interface PaymentSuccessScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// StatusBadge — custom component (no Figma match)
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

// BookingReference — custom component with copy action
function BookingReference({ label, value, ariaLabel }: { label: string; value: string; ariaLabel: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silent fallback
    }
  }, [value]);

  return (
    <div className="booking-reference" aria-label={ariaLabel}>
      <span className="booking-reference__label">{label}</span>
      <div className="booking-reference__value-row">
        <span className="booking-reference__value">{value}</span>
        <button
          className="booking-reference__copy-btn"
          onClick={handleCopy}
          aria-label={t('paymentSuccess.copyAriaLabel')}
          type="button"
        >
          {copied ? t('paymentSuccess.copied') : t('paymentSuccess.copy')}
        </button>
      </div>
    </div>
  );
}

// ButtonSmall — outline/inactive variant
function ButtonSmall({ children, ariaLabel, onClick }: { children: string; ariaLabel: string; onClick?: () => void }) {
  return (
    <button
      className="btn-small btn-small--inactive"
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
}

export function PaymentSuccessScreen({ onNavigate }: PaymentSuccessScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();

  const paymentResult = state.paymentResult;
  const bookingReference = paymentResult?.bookingReference ?? '';
  const totalAmount = state.paymentInquiry?.amount ?? 0;
  const isSimulated = !!state.fallbackReason;

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

  const handleNavigateHome = useCallback(() => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  }, [dispatch, onNavigate]);

  const handleBookAnother = useCallback(() => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  }, [dispatch, onNavigate]);

  const handleShare = useCallback(() => {
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: t('paymentSuccess.shareTitle'),
        text: `${t('paymentSuccess.shareText')} ${bookingReference}`,
      }).catch(() => { /* user cancelled share */ });
    }
  }, [t, bookingReference]);

  return (
    <div className="screen screen--payment-success">
      <TopBar
        title={t('paymentSuccess.title')}
        showBackArrow={false}
        ariaLabel={t('paymentSuccess.title')}
      />

      <div className="screen__content">
        <StatusBadge
          status="success"
          text={t('paymentSuccess.title')}
          ariaLabel={t('paymentSuccess.statusAriaLabel')}
        />

        {/* Simulation disclosure per BR-12 / AC-07 */}
        {isSimulated && (
          <div className="payment-success__simulation-warning" role="alert">
            <span>{t('paymentSuccess.simulationWarning')}</span>
          </div>
        )}

        {/* Booking reference per AC-01 / BR-13 */}
        {bookingReference && (
          <BookingReference
            label={t('paymentSuccess.bookingRefLabel')}
            value={bookingReference}
            ariaLabel={t('paymentSuccess.bookingRefAriaLabel').replace('{ref}', bookingReference)}
          />
        )}

        <BookingSummaryCard
          collapsed={false}
          expandable={false}
          journey={journeySummary}
          passengers={passengersSummary}
          services={servicesSummary}
          totalAmount={`-${formatPrice(totalAmount)} VND`}
          ariaLabel={t('paymentSuccess.summaryAriaLabel')}
        />

        <ButtonSmall
          ariaLabel={t('paymentSuccess.shareAriaLabel')}
          onClick={handleShare}
        >
          {t('paymentSuccess.share')}
        </ButtonSmall>

        <div className="screen__actions screen__actions--row">
          <button
            className="btn-big btn-big--inactive"
            onClick={handleNavigateHome}
            aria-label={t('paymentSuccess.homeAriaLabel')}
            type="button"
          >
            {t('paymentSuccess.home')}
          </button>
          <button
            className="btn-big btn-big--active"
            onClick={handleBookAnother}
            aria-label={t('paymentSuccess.bookAnotherAriaLabel')}
            type="button"
          >
            {t('paymentSuccess.bookAnother')}
          </button>
        </div>
      </div>
    </div>
  );
}
