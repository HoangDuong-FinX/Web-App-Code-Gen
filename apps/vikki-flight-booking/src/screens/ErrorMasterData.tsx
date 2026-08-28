import React from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';

export default function ErrorMasterData(props: ScreenProps) {
  const { loadMasterData, navigate } = props;

  const handleRetry = () => {
    loadMasterData();
    navigate('search-home');
  };

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, color: 'var(--status-negative)' }} aria-label={t('errorMasterData.icon.aria')}>\u2717</div>

      <Text variant="title-2" as="h1">{t('errorMasterData.title')}</Text>

      <Text variant="body">{t('errorMasterData.message')}</Text>

      <Button variant="gradient" onClick={handleRetry} ariaLabel={t('errorMasterData.action.aria')}>
        {t('errorMasterData.action')}
      </Button>
    </div>
  );
}
