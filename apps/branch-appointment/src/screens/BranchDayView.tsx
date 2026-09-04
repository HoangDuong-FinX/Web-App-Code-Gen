// Screen: branch-day-view — Staff view of today's branch appointments (fixture)
import React, { useState } from 'react';
import { t } from '../i18n';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import type { BranchAppointment } from '../types';
import { fixtureBranchName, fixtureBranchAppointments } from '../fixtures/branchDayView';

function getTodayFormatted(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}/${m}/${y}`;
}

export const BranchDayView: React.FC = () => {
  const [appointments, setAppointments] = useState<BranchAppointment[]>(fixtureBranchAppointments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const refresh = () => {
    setLoading(true);
    setError(false);
    // Simulate refresh with fixture data
    setTimeout(() => {
      setAppointments([...fixtureBranchAppointments]);
      setLoading(false);
    }, 500);
  };

  const markArrived = (appointmentId: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.appointmentId === appointmentId ? { ...apt, arrived: true } : apt
      )
    );
  };

  return (
    <div className="stack-col gap-4">
      <h1 className="text-title">{t('branchDayView.title')}</h1>
      <span className="text-subtitle">{fixtureBranchName}</span>
      <span className="text-caption text-secondary">{getTodayFormatted()}</span>

      <div className="stack-row justify-end">
        <button
          className="btn btn-text btn-sm"
          aria-label={t('branchDayView.refresh')}
          onClick={refresh}
        >
          {t('branchDayView.refresh')}
        </button>
      </div>

      {loading && (
        <div className="loading-container" role="status" aria-label={t('common.loading')}>
          <div className="spinner" />
        </div>
      )}

      {error && !loading && (
        <ErrorState
          title={t('branchDayView.errorTitle')}
          description={t('branchDayView.errorDescription')}
          retryLabel={t('branchDayView.retry')}
          onRetry={refresh}
          ariaLabel={t('branchDayView.errorTitle')}
        />
      )}

      {!loading && !error && appointments.length === 0 && (
        <EmptyState
          title={t('branchDayView.emptyTitle')}
          description={t('branchDayView.emptyDescription')}
          ariaLabel={t('branchDayView.emptyTitle')}
        />
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className="stack-col gap-3" role="list" aria-label={t('branchDayView.title')}>
          {appointments.map((apt) => (
            <div
              key={apt.appointmentId}
              className="card"
              role="listitem"
              aria-label={`${apt.customerName}, ${apt.timeSlot}, ${apt.appointmentCode}`}
            >
              <div className="stack-col gap-2">
                <div className="stack-row gap-2 justify-between">
                  <span className="text-subtitle">{apt.customerName}</span>
                  <span
                    className={`badge ${apt.arrived ? 'badge-success' : 'badge-warning'}`}
                    aria-label={apt.arrived ? t('branchDayView.arrivedStatus') : t('branchDayView.waitingStatus')}
                  >
                    {apt.arrived ? t('branchDayView.arrivedStatus') : t('branchDayView.waitingStatus')}
                  </span>
                </div>
                <span className="text-body">{apt.timeSlot}</span>
                <div className="stack-row gap-2 justify-between">
                  <span className="text-caption text-secondary">{apt.transactionType}</span>
                  <span className="text-caption text-secondary">
                    {t('branchDayView.codePrefix')} {apt.appointmentCode}
                  </span>
                </div>
                {!apt.arrived && (
                  <button
                    className="btn btn-secondary btn-sm"
                    aria-label={`${t('branchDayView.markArrived')} ${apt.customerName}`}
                    onClick={() => markArrived(apt.appointmentId)}
                  >
                    {t('branchDayView.markArrived')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
