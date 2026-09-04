// Screen: confirm-booking — Review and confirm appointment
import React, { useState } from 'react';
import { t } from '../i18n';
import { apiRequest, ApiError } from '../api/client';
import { Modal } from '../components/Modal';
import type { BookingState, TransactionType } from '../types';

const TX_LABEL_MAP: Record<TransactionType, string> = {
  'open-card': 'transactionType.openCard',
  'close-account': 'transactionType.closeAccount',
  'loan-consultation': 'transactionType.loanConsultation',
};

interface ConfirmBookingProps {
  booking: BookingState;
  customerId: string;
  onSuccess: (appointmentCode: string) => void;
  onSlotTaken: () => void;
  onNavigateToMyAppointments: () => void;
  onBack: () => void;
}

export const ConfirmBooking: React.FC<ConfirmBookingProps> = ({
  booking,
  customerId,
  onSuccess,
  onSlotTaken,
  onNavigateToMyAppointments,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlotTakenModal, setShowSlotTakenModal] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const txLabel = booking.transactionType ? t(TX_LABEL_MAP[booking.transactionType]) : '';

  const submitBooking = async () => {
    setIsSubmitting(true);
    setShowSlotTakenModal(false);
    setShowMaxModal(false);
    setShowErrorModal(false);
    try {
      const data = await apiRequest<{ appointmentId: string; appointmentCode: string }>({
        method: 'POST',
        path: '/appointments',
        body: {
          customerId,
          branchId: booking.branchId,
          date: booking.date,
          slotId: booking.slotId,
          transactionType: booking.transactionType,
        },
      });
      onSuccess(data.appointmentCode);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr && typeof apiErr.status === 'number') {
        if (apiErr.status === 409) {
          setShowSlotTakenModal(true);
        } else if (apiErr.status === 422 && apiErr.code === 'MAX_APPOINTMENTS_REACHED') {
          setShowMaxModal(true);
        } else {
          setShowErrorModal(true);
        }
      } else {
        setShowErrorModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryRows: Array<{ label: string; value: string }> = [
    { label: t('confirmBooking.branchLabel'), value: booking.branchName },
    { label: t('confirmBooking.addressLabel'), value: booking.branchAddress },
    { label: t('confirmBooking.dateLabel'), value: booking.date },
    { label: t('confirmBooking.slotLabel'), value: booking.slotTimeRange },
    { label: t('confirmBooking.transactionLabel'), value: txLabel },
  ];

  return (
    <div className="stack-col gap-4">
      <h1 className="text-title">{t('confirmBooking.title')}</h1>

      <div className="card" aria-label={t('confirmBooking.title')}>
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
        aria-label={t('confirmBooking.submit')}
        disabled={isSubmitting}
        onClick={submitBooking}
      >
        {isSubmitting ? t('common.loading') : t('confirmBooking.submit')}
      </button>

      <button
        className="btn btn-text"
        aria-label={t('confirmBooking.back')}
        disabled={isSubmitting}
        onClick={onBack}
      >
        {t('confirmBooking.back')}
      </button>

      {/* Slot Taken Modal (FR-7) */}
      <Modal
        visible={showSlotTakenModal}
        ariaLabel={t('confirmBooking.slotTakenTitle')}
      >
        <div className="icon-warning" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M24 14v14M24 32v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-subtitle">{t('confirmBooking.slotTakenTitle')}</h2>
        <p className="text-body">{t('confirmBooking.slotTakenDescription')}</p>
        <button
          className="btn btn-primary"
          aria-label={t('confirmBooking.slotTakenAction')}
          onClick={() => {
            setShowSlotTakenModal(false);
            onSlotTaken();
          }}
        >
          {t('confirmBooking.slotTakenAction')}
        </button>
      </Modal>

      {/* Max Appointments Modal (BR-3) */}
      <Modal
        visible={showMaxModal}
        onClose={() => setShowMaxModal(false)}
        ariaLabel={t('confirmBooking.maxTitle')}
      >
        <div className="icon-warning" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-subtitle">{t('confirmBooking.maxTitle')}</h2>
        <p className="text-body">{t('confirmBooking.maxDescription')}</p>
        <button
          className="btn btn-primary"
          aria-label={t('confirmBooking.maxViewAppointments')}
          onClick={() => {
            setShowMaxModal(false);
            onNavigateToMyAppointments();
          }}
        >
          {t('confirmBooking.maxViewAppointments')}
        </button>
        <button
          className="btn btn-text"
          aria-label={t('confirmBooking.close')}
          onClick={() => setShowMaxModal(false)}
        >
          {t('confirmBooking.close')}
        </button>
      </Modal>

      {/* Booking Error Modal */}
      <Modal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        ariaLabel={t('confirmBooking.errorTitle')}
      >
        <div className="icon-error" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M24 14v14M24 32v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-subtitle">{t('confirmBooking.errorTitle')}</h2>
        <p className="text-body">{t('confirmBooking.errorDescription')}</p>
        <button
          className="btn btn-primary"
          aria-label={t('confirmBooking.errorRetry')}
          onClick={() => {
            setShowErrorModal(false);
            submitBooking();
          }}
        >
          {t('confirmBooking.errorRetry')}
        </button>
        <button
          className="btn btn-text"
          aria-label={t('confirmBooking.close')}
          onClick={() => setShowErrorModal(false)}
        >
          {t('confirmBooking.close')}
        </button>
      </Modal>
    </div>
  );
};
