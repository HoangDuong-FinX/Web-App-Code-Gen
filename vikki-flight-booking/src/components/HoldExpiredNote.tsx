import React from 'react';
import { Button } from './Button';
import { t } from '../i18n';

export interface HoldExpiredNoteProps {
  onSearchAgain: () => void;
}

export function HoldExpiredNote({ onSearchAgain }: HoldExpiredNoteProps): React.ReactElement {
  return (
    <div
      role="alert"
      style={{
        padding: '14px',
        borderRadius: 'var(--radius-8)',
        background: 'var(--color-error-bg)',
        border: '1px solid var(--color-error)',
        color: 'var(--color-error)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <p style={{ margin: 0, font: 'var(--text-body-semibold)' }}>{t('holdExpired.message')}</p>
      <Button
        variant="danger"
        onClick={onSearchAgain}
        ariaLabel={t('holdExpired.searchAgain.ariaLabel')}
      >
        {t('holdExpired.searchAgain')}
      </Button>
    </div>
  );
}
