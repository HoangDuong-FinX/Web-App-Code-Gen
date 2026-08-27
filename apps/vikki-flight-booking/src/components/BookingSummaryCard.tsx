import React, { useState } from 'react';
import { useI18n } from '../i18n';

interface BookingSummaryCardProps {
  collapsed?: boolean;
  expandable?: boolean;
  journey: string;
  passengers: string;
  services: string;
  totalAmount?: string;
  ariaLabel: string;
}

export function BookingSummaryCard({
  collapsed = true,
  expandable = true,
  journey,
  passengers,
  services,
  totalAmount,
  ariaLabel,
}: BookingSummaryCardProps) {
  const { t } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const showExpanded = !isCollapsed || !expandable;

  return (
    <div className="booking-summary-card" aria-label={ariaLabel}>
      {expandable && (
        <button
          className="booking-summary-card__toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
          aria-label={t('checkout.expandSummary')}
          type="button"
        >
          <span className="booking-summary-card__journey-preview">{journey}</span>
          <svg
            className={`booking-summary-card__chevron ${!isCollapsed ? 'booking-summary-card__chevron--open' : ''}`}
            width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      {showExpanded && (
        <div className="booking-summary-card__details">
          <div className="booking-summary-card__section">
            <span className="booking-summary-card__label">{t('checkout.summaryJourney')}</span>
            <span className="booking-summary-card__value">{journey}</span>
          </div>
          <div className="booking-summary-card__section">
            <span className="booking-summary-card__label">{t('checkout.summaryPassengers')}</span>
            <span className="booking-summary-card__value">{passengers}</span>
          </div>
          <div className="booking-summary-card__section">
            <span className="booking-summary-card__label">{t('checkout.summaryServices')}</span>
            <span className="booking-summary-card__value">{services}</span>
          </div>
          {totalAmount && (
            <div className="booking-summary-card__section booking-summary-card__section--total">
              <span className="booking-summary-card__label">{t('checkout.summaryTotal')}</span>
              <span className="booking-summary-card__value booking-summary-card__value--total">{totalAmount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

