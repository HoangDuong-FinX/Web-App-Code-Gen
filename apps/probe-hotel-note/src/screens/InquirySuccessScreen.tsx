import React from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';

export default function InquirySuccessScreen(): React.JSX.Element {
  const { navigate, currentCarId } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-xl font-bold text-center">{t('inquirySuccess.title')}</h1>
      <p className="text-sm text-gray-500 text-center">{t('inquirySuccess.subtitle')}</p>
      <button type="button" onClick={() => navigate('car-detail', { currentCarId })} aria-label={t('inquirySuccess.backToCarAria')} data-testid="back-to-car" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium">
        {t('inquirySuccess.backToCar')}
      </button>
      <button type="button" onClick={() => navigate('home')} aria-label={t('inquirySuccess.backToHomeAria')} data-testid="back-to-home" className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium">
        {t('inquirySuccess.backToHome')}
      </button>
    </div>
  );
}
