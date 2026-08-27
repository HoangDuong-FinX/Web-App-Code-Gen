import React from 'react';
import { useI18n } from '../i18n';
import { useBooking } from '../context/BookingContext';
import { TopBar } from '../components/TopBar';
import { ButtonBig } from '../components/shared';

interface HoldExpiredScreenProps {
  onNavigate: (screen: 'search') => void;
}

export function HoldExpiredScreen({ onNavigate }: HoldExpiredScreenProps) {
  const { t } = useI18n();
  const { dispatch } = useBooking();

  const handleRestart = () => {
    dispatch({ type: 'RESET' });
    onNavigate('search');
  };

  return (
    <div className="screen screen--hold-expired">
      <TopBar title={t('topbar.holdExpired')} ariaLabel={t('topbar.holdExpired')} />

      <div className="screen__content screen__content--center">
        <div className="hold-expired__icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            <path d="M32 18V34L40 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="hold-expired__title">{t('holdExpired.title')}</h2>
        <p className="hold-expired__message">{t('holdExpired.message')}</p>
        <ButtonBig onClick={handleRestart} ariaLabel={t('holdExpired.restart')}>
          {t('holdExpired.restart')}
        </ButtonBig>
      </div>
    </div>
  );
}
