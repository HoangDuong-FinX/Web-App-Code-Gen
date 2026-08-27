import React, { useCallback } from 'react';
import { useBooking } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import type { ScreenId } from '../types';

interface PaymentPartialScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// StatusBadge — same custom component
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

// LegSummaryCard — custom component showing per-leg payment status
function LegSummaryCard({
  leg,
  status,
  flightSummary,
  amount,
  errorReason,
  ariaLabel,
}: {
  leg: 'outbound' | 'return';
  status: 'success' | 'failed';
  flightSummary: string;
  amount: string;
  errorReason?: string;
  ariaLabel: string;
}) {
  const { t } = useI18n();
  const isSuccess = status === 'success';
  return (
    <div className={`leg-summary-card leg-summary-card--${status}`} aria-label={ariaLabel}>
      <div className="leg-summary-card__header">
        <span className="leg-summary-card__leg-label">
          {leg === 'outbound' ? t('paymentPartial.outboundLeg') : t('paymentPartial.returnLeg')}
        </span>
        <span className={`leg-summary-card__status leg-summary-card__status--${status}`}>
          {isSuccess ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
              <path d="M5 8L7 10L11 6" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
              <path d="M6 6L10 10M10 6L6 10" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          <span>{isSuccess ? t('paymentPartial.statusSuccess') : t('paymentPartial.statusFailed')}</span>
        </span>
      </div>
      <div className="leg-summary-card__body">
        <span className="leg-summary-card__flight">{flightSummary}</span>
        <span className="leg-summary-card__amount">{amount}</span>
      </div>
      {!isSuccess && errorReason && (
        <div className="leg-summary-card__error">
          <span>{errorReason}</span>
        </div>
      )}
    </div>
  );
}

// BookingReference — same as in success screen
function BookingReference({ label, value, ariaLabel }: { label: string; value: string; ariaLabel: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
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

export function PaymentPartialScreen({ onNavigate }: PaymentPartialScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();

  const outboundResult = state.paymentResult;
  const returnResult = state.returnPaymentResult;

  const outboundBookingReference = outboundResult?.bookingReference ?? '';
  const returnErrorReason = returnResult?.errorReason ?? t('paymentFailed.defaultError');

  // Build flight summaries
  const outboundOffer = state.selectedOutboundOffer;
  const returnOffer = state.selectedReturnOffer;

  const outboundFlightSummary = outboundOffer
    ? `${outboundOffer.airline} ${outboundOffer.flightNumber} \u00b7 ${outboundOffer.departureTime} \u2192 ${outboundOffer.arrivalTime}`
    : '';
  const returnFlightSummary = returnOffer
    ? `${returnOffer.airline} ${returnOffer.flightNumber} \u00b7 ${returnOffer.departureTime} \u2192 ${returnOffer.arrivalTime}`
    : '';

  const outboundAmount = outboundOffer ? `${formatPrice(outboundOffer.price)} VND` : '';
  const returnAmount = returnOffer ? `${formatPrice(returnOffer.price)} VND` : '';

  const handleNavigateHome = useCallback(() => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  }, [dispatch, onNavigate]);

  return (
    <div className="screen screen--payment-partial">
      <TopBar
        title={t('paymentPartial.title')}
        showBackArrow={false}
        ariaLabel={t('paymentPartial.title')}
      />

      <div className="screen__content">
        <StatusBadge
          status="partial"
          text={t('paymentPartial.heading')}
          ariaLabel={t('paymentPartial.statusAriaLabel')}
        />

        <p className="payment-partial__explanation">
          {t('paymentPartial.explanation')}
        </p>

        <div className="payment-partial__legs">
          <LegSummaryCard
            leg="outbound"
            status="success"
            flightSummary={outboundFlightSummary}
            amount={outboundAmount}
            ariaLabel={t('paymentPartial.outboundAriaLabel').replace('{flight}', outboundFlightSummary)}
          />
          <LegSummaryCard
            leg="return"
            status="failed"
            flightSummary={returnFlightSummary}
            amount={returnAmount}
            errorReason={returnErrorReason}
            ariaLabel={t('paymentPartial.returnAriaLabel').replace('{flight}', returnFlightSummary).replace('{reason}', returnErrorReason)}
          />
        </div>

        {/* Outbound booking reference only per BR-13 / AC-04 */}
        {outboundBookingReference && (
          <BookingReference
            label={t('paymentPartial.outboundRefLabel')}
            value={outboundBookingReference}
            ariaLabel={t('paymentPartial.outboundRefAriaLabel').replace('{ref}', outboundBookingReference)}
          />
        )}

        <p className="payment-partial__rebook-hint">
          {t('paymentPartial.rebookHint')}
        </p>

        <div className="screen__actions">
          <button
            className="btn-big btn-big--active"
            onClick={handleNavigateHome}
            aria-label={t('paymentPartial.homeAriaLabel')}
            type="button"
          >
            {t('paymentPartial.home')}
          </button>
        </div>
      </div>
    </div>
  );
}
