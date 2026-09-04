// Screen: my-appointments — View and cancel upcoming appointments
import React, { useState, useEffect, useCallback } from 'react';
import { t } from '../i18n';
import { apiRequest, ApiError } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Modal } from '../components/Modal';
import type { Appointment } from '../types';

interface MyAppointmentsProps {
  customerId: string;
  onNavigateToBranchList: () => void;
}

function isLessThan2Hours(dateStr: string, timeSlot: string): boolean {
  try {
    const startTime = timeSlot.split(' - ')[0];
    const appointmentDate = new Date(`${dateStr}T${startTime}:00`);
    const now = new Date();
    const diffMs = appointmentDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 2;
  } catch {
    return false;
  }
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({ customerId, onNavigateToBranchList }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Cancel flow state
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showCancelTooLate, setShowCancelTooLate] = useState(false);
  const [showCancelError, setShowCancelError] = useState(false);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await apiRequest<{ appointments: Appointment[] }>({
        method: 'GET',
        path: `/appointments?customerId=${encodeURIComponent(customerId)}`,
      });
      setAppointments(data.appointments);
    } catch {
      setError(true);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const openCancelConfirm = (apt: Appointment) => {
    setCancelTarget(apt);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    setShowCancelError(false);
    try {
      await apiRequest<Record<string, never>>({
        method: 'DELETE',
        path: `/appointments/${encodeURIComponent(cancelTarget.appointmentId)}`,
      });
      setShowCancelConfirm(false);
      setShowCancelSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr && typeof apiErr.status === 'number' && apiErr.status === 422) {
        setShowCancelConfirm(false);
        setShowCancelTooLate(true);
      } else {
        setShowCancelConfirm(false);
        setShowCancelError(true);
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const dismissAndRefresh = () => {
    setShowCancelSuccess(false);
    setCancelTarget(null);
    loadAppointments();
  };

  return (
    <div className="stack-col gap-4">
      <h1 className="text-title">{t('myAppointments.title')}</h1>

      {loading && (
        <div className="loading-container" role="status" aria-label={t('common.loading')}>
          <div className="spinner" />
        </div>
      )}

      {error && !loading && (
        <ErrorState
          title={t('myAppointments.errorTitle')}
          description={t('myAppointments.errorDescription')}
          retryLabel={t('myAppointments.retry')}
          onRetry={loadAppointments}
          ariaLabel={t('myAppointments.errorTitle')}
        />
      )}

      {!loading && !error && appointments.length === 0 && (
        <EmptyState
          title={t('myAppointments.emptyTitle')}
          description={t('myAppointments.emptyDescription')}
          ariaLabel={t('myAppointments.emptyTitle')}
        />
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="stack-col gap-3" role="list" aria-label={t('myAppointments.title')}>
          {appointments.map((apt) => {
            const tooLate = isLessThan2Hours(apt.date, apt.timeSlot);
            return (
              <div
                key={apt.appointmentId}
                className="card"
                role="listitem"
                aria-label={`${apt.appointmentCode} ${apt.branchName} ${apt.date} ${apt.timeSlot}`}
              >
                <div className="stack-col gap-2">
                  <div className="stack-row gap-2 justify-between">
                    <span className="text-subtitle">{apt.branchName}</span>
                    <span className="badge" aria-label={`${t('bookingSuccess.codeLabel')} ${apt.appointmentCode}`}>
                      {apt.appointmentCode}
                    </span>
                  </div>
                  <span className="text-body">{apt.date} &middot; {apt.timeSlot}</span>
                  <span className="text-caption text-secondary">{apt.transactionType}</span>
                  <button
                    className="btn btn-destructive btn-sm"
                    aria-label={`${t('myAppointments.cancelButton')} ${apt.appointmentCode}`}
                    disabled={tooLate}
                    onClick={() => openCancelConfirm(apt)}
                  >
                    {t('myAppointments.cancelButton')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        className="btn btn-primary"
        aria-label={t('myAppointments.bookNew')}
        onClick={onNavigateToBranchList}
      >
        {t('myAppointments.bookNew')}
      </button>

      {/* Cancel Confirm Modal */}
      <Modal
        visible={showCancelConfirm}
        onClose={() => !isCancelling && setShowCancelConfirm(false)}
        ariaLabel={t('myAppointments.cancelConfirmTitle')}
      >
        <h2 className="text-subtitle">{t('myAppointments.cancelConfirmTitle')}</h2>
        <p className="text-body">
          {cancelTarget
            ? t('myAppointments.cancelConfirmDescription', {
                code: cancelTarget.appointmentCode,
                branch: cancelTarget.branchName,
                date: cancelTarget.date,
                time: cancelTarget.timeSlot,
              })
            : ''}
        </p>
        <button
          className="btn btn-destructive"
          aria-label={t('myAppointments.cancelConfirm')}
          disabled={isCancelling}
          onClick={confirmCancel}
        >
          {isCancelling ? t('common.loading') : t('myAppointments.cancelConfirm')}
        </button>
        <button
          className="btn btn-text"
          aria-label={t('myAppointments.cancelKeep')}
          disabled={isCancelling}
          onClick={() => setShowCancelConfirm(false)}
        >
          {t('myAppointments.cancelKeep')}
        </button>
      </Modal>

      {/* Cancel Success Modal */}
      <Modal
        visible={showCancelSuccess}
        ariaLabel={t('myAppointments.cancelSuccessTitle')}
      >
        <div className="icon-success" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M16 24l6 6 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-subtitle">{t('myAppointments.cancelSuccessTitle')}</h2>
        <p className="text-body">{t('myAppointments.cancelSuccessDescription')}</p>
        <button
          className="btn btn-primary"
          aria-label={t('myAppointments.cancelSuccessClose')}
          onClick={dismissAndRefresh}
        >
          {t('myAppointments.cancelSuccessClose')}
        </button>
      </Modal>

      {/* Cancel Too Late Modal (BR-4) */}
      <Modal
        visible={showCancelTooLate}
        onClose={() => setShowCancelTooLate(false)}
        ariaLabel={t('myAppointments.cancelTooLateTitle')}
      >
        <div className="icon-warning" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M24 14v14M24 32v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-subtitle">{t('myAppointments.cancelTooLateTitle')}</h2>
        <p className="text-body">{t('myAppointments.cancelTooLateDescription')}</p>
        <button
          className="btn btn-primary"
          aria-label={t('myAppointments.cancelTooLateClose')}
          onClick={() => setShowCancelTooLate(false)}
        >
          {t('myAppointments.cancelTooLateClose')}
        </button>
      </Modal>

      {/* Cancel Error Modal */}
      <Modal
        visible={showCancelError}
        onClose={() => setShowCancelError(false)}
        ariaLabel={t('myAppointments.cancelErrorTitle')}
      >
        <div className="icon-error" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path d="M24 14v14M24 32v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-subtitle">{t('myAppointments.cancelErrorTitle')}</h2>
        <p className="text-body">{t('myAppointments.cancelErrorDescription')}</p>
        <button
          className="btn btn-primary"
          aria-label={t('myAppointments.cancelErrorRetry')}
          onClick={() => {
            setShowCancelError(false);
            setShowCancelConfirm(true);
          }}
        >
          {t('myAppointments.cancelErrorRetry')}
        </button>
        <button
          className="btn btn-text"
          aria-label={t('myAppointments.cancelErrorClose')}
          onClick={() => setShowCancelError(false)}
        >
          {t('myAppointments.cancelErrorClose')}
        </button>
      </Modal>
    </div>
  );
};
