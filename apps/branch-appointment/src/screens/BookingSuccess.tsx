// Screen: booking-success — Display appointment code after successful booking
import React from 'react';
import { t } from '../i18n';
import type { BookingState, TransactionType } from '../types';

const TX_LABEL_MAP: Record<TransactionType, string> = {
  'open-card': 'transactionType.openCard',
  'close-account': 'transactionType.closeAccount',
  'loan-consultation': 'transactionType.loanConsultation',
};

interface BookingSuccessProps {
  appointmentCode: string;
  booking: BookingState;
  onViewMyAppointments: () => void;
  onBookAnother: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  appointmentCode,
  booking,
  onViewMyAppointments,
  onBookAnother,
}) => {
  const txLabel = booking.transactionType ? t(TX_LABEL_MAP[booking.transactionType]) : '';

  const summaryRows: Array<{ label: string; value: string }> = [
    { label: t('bookingSuccess.branchLabel'), value: booking.branchName },
    { label: t('bookingSuccess.dateLabel'), value: booking.date },
    { label: t('bookingSuccess.slotLabel'), value: booking.slotTimeRange },
    { label: t('bookingSuccess.transactionLabel'), value: txLabel },
  ];

  return (
    <div className="stack-col gap-4 align-center">
      <div className="icon-success icon-lg" aria-hidden="true">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
          <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-title text-center">{t('bookingSuccess.title')}</h1>

      <div className="stack-col gap-1 align-center">
        <span className="text-caption text-secondary">{t('bookingSuccess.codeLabel')}</span>
        <span className="text-display" aria-label={`${t('bookingSuccess.codeLabel')}: ${appointmentCode}`}>
          {appointmentCode}
        </span>
      </div>

      <div className="card" style={{ width: '100%' }} aria-label={t('bookingSuccess.title')}>
        <div className="stack-col gap-2">
          {summaryRows.map((row) => (
            <div key={row.label} className="summary-row">
              <span className="text-caption text-secondary summary-label">{row.label}</span>
              <span className="text-body">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-primary"
        aria-label={t('bookingSuccess.viewAppointments')}
        onClick={onViewMyAppointments}
      >
        {t('bookingSuccess.viewAppointments')}
      </button>

      <button
        className="btn btn-secondary"
        aria-label={t('bookingSuccess.bookAnother')}
        onClick={onBookAnother}
      >
        {t('bookingSuccess.bookAnother')}
      </button>
    </div>
  );
};
