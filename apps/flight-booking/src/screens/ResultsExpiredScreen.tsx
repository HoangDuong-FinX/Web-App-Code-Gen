import React from 'react';
import { t } from '../i18n/vi';

interface Props {
  onSearchAgain: () => void;
}

export function ResultsExpiredScreen({ onSearchAgain }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12">
      <div className="text-6xl mb-6 text-[#E12127]" aria-hidden="true" data-testid="expired-icon">\u23F0</div>
      <h1 className="text-2xl font-bold text-center text-[#1A1A1A] mb-4">{t('resultsExpired.title')}</h1>
      <p className="text-base text-[#6B7280] text-center mb-8">{t('resultsExpired.description')}</p>
      <button type="button" className="w-full h-14 bg-[#E12127] text-white rounded-lg font-semibold text-base hover:bg-[#c91d22]" aria-label={t('resultsExpired.searchAgain.aria')} data-testid="search-again-action" onClick={onSearchAgain}>{t('resultsExpired.searchAgain')}</button>
    </div>
  );
}
