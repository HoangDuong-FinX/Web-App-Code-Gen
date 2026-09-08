import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { submitTestDrive } from '../fixtures/payment';

export default function TdConfirmScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId, testDriveBooking } = useApp();
  const { buyer } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(): Promise<void> {
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitTestDrive();
      navigate('td-success', {
        currentCarId,
        selectedCar,
        tdReferenceCode: result.referenceCode,
        testDriveBooking,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'SLOT_UNAVAILABLE') {
        navigate('td-select-datetime', { currentCarId, selectedCar, testDriveBooking });
      } else {
        setError(t('tdConfirm.networkError'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('td-select-datetime', { currentCarId, selectedCar, testDriveBooking })} aria-label={t('tdConfirm.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('tdConfirm.title')}</h1>
      </header>

      {/* Step indicator */}
      <div className="flex items-center gap-2 px-4 py-3" aria-label={t('tdConfirm.step')} data-testid="step-indicator">
        {[t('tdShowroom.steps.showroom'), t('tdShowroom.steps.datetime'), t('tdShowroom.steps.confirm')].map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1 text-blue-600">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-blue-600 text-white">{i + 1}</span>
              <span className="text-xs font-medium">{label}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-blue-200" />}
          </React.Fragment>
        ))}
      </div>

      {/* Car info */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('tdConfirm.carInfo')}</h3>
        {selectedCar && (
          <div className="flex gap-3 items-center">
            <img src={selectedCar.thumbnailUrl} alt={selectedCar.name} className="w-20 aspect-[4/3] object-cover rounded-lg" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm">{selectedCar.name}</span>
              <span className="text-sm text-blue-600">{selectedCar.formattedPrice}</span>
            </div>
          </div>
        )}
      </section>

      {/* Schedule */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('tdConfirm.schedule')}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('tdConfirm.showroom')}</span><span className="text-sm font-medium">{testDriveBooking.showroomName}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('tdConfirm.address')}</span><span className="text-sm font-medium text-right max-w-[60%]">{testDriveBooking.showroomAddress}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('tdConfirm.date')}</span><span className="text-sm font-medium">{testDriveBooking.date}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('tdConfirm.time')}</span><span className="text-sm font-medium">{testDriveBooking.time}</span></div>
        </div>
      </section>

      {/* Personal info */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('tdConfirm.personalInfo')}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('tdConfirm.name')}</span><span className="text-sm font-medium">{buyer?.name}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('tdConfirm.phone')}</span><span className="text-sm font-medium">{buyer?.phone}</span></div>
        </div>
      </section>

      <div className="p-4 flex flex-col gap-3">
        <button type="button" onClick={() => navigate('td-select-datetime', { currentCarId, selectedCar, testDriveBooking })} aria-label={t('tdConfirm.editDatetimeAria')} data-testid="edit-datetime" className="text-sm text-blue-600 font-medium">
          {t('tdConfirm.editDatetime')}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" aria-live="polite" data-testid="td-confirm-error">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          aria-label={t('tdConfirm.submitAria')}
          data-testid="td-confirm-submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? '...' : t('tdConfirm.submit')}
        </button>
      </div>
    </div>
  );
}
