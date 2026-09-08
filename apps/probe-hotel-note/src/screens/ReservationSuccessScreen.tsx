import React from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';

export default function ReservationSuccessScreen(): React.JSX.Element {
  const { navigate, selectedCar, reservationResult } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-xl font-bold text-center">{t('resSuccess.title')}</h1>
      <p className="text-sm font-bold text-center">{t('resSuccess.code')} {reservationResult?.code}</p>

      <div className="w-full bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex justify-between"><span className="text-sm text-gray-500">{t('resSuccess.car')}</span><span className="text-sm font-medium">{selectedCar?.name}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">{t('resSuccess.paid')}</span><span className="text-sm font-medium">{reservationResult?.depositAmountPaid}</span></div>
        <div className="flex justify-between"><span className="text-sm text-gray-500">{t('resSuccess.holdUntil')}</span><span className="text-sm font-medium">{reservationResult?.holdUntilDate}</span></div>
      </div>

      {reservationResult?.nextStepsMessage && (
        <p className="text-sm text-gray-500 text-center">{reservationResult.nextStepsMessage}</p>
      )}

      <button type="button" onClick={() => navigate('my-activity')} aria-label={t('resSuccess.viewActivityAria')} data-testid="view-activity" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium">
        {t('resSuccess.viewActivity')}
      </button>
      <button type="button" onClick={() => navigate('home')} aria-label={t('resSuccess.backToHomeAria')} data-testid="back-to-home" className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium">
        {t('resSuccess.backToHome')}
      </button>
    </div>
  );
}
