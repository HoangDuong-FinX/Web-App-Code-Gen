import React from 'react';
import { t } from '../i18n';

interface InquirySuccessScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function InquirySuccessScreen({ onNavigate, params }: InquirySuccessScreenProps): React.JSX.Element {
  const carId = params.carId as string;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 gap-4">
      <img
        src="https://placehold.co/120x120/dcfce7/16a34a?text=%E2%9C%93"
        alt={t('inquirySuccess.imageAlt')}
        className="w-30 h-30"
        data-testid="success-illustration"
      />
      <h1 className="text-2xl font-bold text-gray-900 text-center">{t('inquirySuccess.title')}</h1>
      <p className="text-gray-600 text-center">{t('inquirySuccess.message')}</p>
      <button
        type="button"
        aria-label={t('nav.backToHome')}
        data-testid="back-to-home-action"
        className="w-full max-w-xs py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        onClick={() => onNavigate('home')}
      >
        {t('nav.backToHome')}
      </button>
      <button
        type="button"
        aria-label={t('nav.backToCar')}
        data-testid="back-to-car-action"
        className="w-full max-w-xs py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
        onClick={() => onNavigate('car-detail', { carId })}
      >
        {t('nav.backToCar')}
      </button>
    </div>
  );
}
