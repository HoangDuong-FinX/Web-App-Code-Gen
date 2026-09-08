import React, { useState, useCallback } from 'react';
import { t } from '../i18n';
import { submitReservationFixture } from '../fixtures/cars';

interface ReservationConfirmScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function ReservationConfirmScreen({ onNavigate, params }: ReservationConfirmScreenProps): React.JSX.Element {
  const carId = params.carId as string;
  const carName = params.carName as string;
  const carPrice = params.carPrice as string;
  const carThumbnailUrl = params.carThumbnailUrl as string;
  const fullName = params.fullName as string;
  const phone = params.phone as string;
  const email = (params.email as string) || '';
  const visitDate = params.visitDate as string;
  const visitTime = (params.visitTime as string) || '';

  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reviewFields = [
    { label: t('reservation.fullName'), value: fullName },
    { label: t('reservation.phone'), value: phone },
    ...(email ? [{ label: t('reservation.email'), value: email }] : []),
    { label: t('reservation.visitDate'), value: visitDate },
    ...(visitTime ? [{ label: t('reservation.visitTime'), value: visitTime }] : []),
  ];

  const handleConfirm = useCallback(() => {
    setSubmitError('');
    setSubmitting(true);
    const result = submitReservationFixture();
    setSubmitting(false);
    if (result.success) {
      onNavigate('reservation-success', { carId });
    } else {
      setSubmitError(t('common.errorRetry'));
    }
  }, [onNavigate, carId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('reservation-form', params)}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('reservationConfirm.title')}</h1>
      </header>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('reservationConfirm.carInfo')}</h2>
        <div className="flex gap-3 items-center">
          <img src={carThumbnailUrl} alt={carName} className="w-16 h-12 object-cover rounded-lg" />
          <div>
            <p className="font-semibold text-gray-900">{carName}</p>
            <p className="text-gray-600">{carPrice}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('reservationConfirm.yourInfo')}</h2>
        {reviewFields.map((f) => (
          <div key={f.label} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{f.label}</span>
            <span className="text-sm text-gray-900">{f.value}</span>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-3 p-4">
        <button
          type="button"
          aria-label={t('reservationConfirm.editAria')}
          data-testid="edit-action"
          className="w-full py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg"
          onClick={() => onNavigate('reservation-form', params)}
        >
          {t('reservationConfirm.edit')}
        </button>

        {submitError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200" data-testid="error-banner">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <button
          type="button"
          aria-label={t('reservationConfirm.confirmAria')}
          data-testid="confirm-action"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? t('common.loading') : t('reservationConfirm.confirm')}
        </button>
      </div>
    </div>
  );
}
