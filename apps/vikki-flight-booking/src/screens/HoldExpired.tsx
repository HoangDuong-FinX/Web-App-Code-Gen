import React from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';

export default function HoldExpired(props: ScreenProps) {
  const { resetBooking } = props;

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, color: 'var(--status-cautionary)' }} aria-label={t('holdExpired.icon.aria')}>\u26A0</div>

      <Text variant="title-2" as="h1">{t('holdExpired.title')}</Text>

      <Text variant="body">{t('holdExpired.message')}</Text>

      <Button variant="gradient" onClick={resetBooking} ariaLabel={t('holdExpired.action.aria')}>
        {t('holdExpired.action')}
      </Button>
    </div>
  );
}
