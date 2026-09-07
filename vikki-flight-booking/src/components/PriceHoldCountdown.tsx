import React, { useState, useEffect, useCallback } from 'react';
import { t } from '../i18n';

export interface PriceHoldCountdownProps {
  expiresAt: string; // ISO 8601
  onExpired?: () => void;
  'data-testid'?: string;
}

export function PriceHoldCountdown({
  expiresAt,
  onExpired,
  'data-testid': testId,
}: PriceHoldCountdownProps): React.ReactElement {
  const getRemaining = useCallback(() => {
    if (!expiresAt) return 0;
    return Math.max(0, new Date(expiresAt).getTime() - Date.now());
  }, [expiresAt]);

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
      if (r === 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, getRemaining, onExpired]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const expired = remaining === 0 && expiresAt !== '';

  return (
    <div
      data-testid={testId}
      aria-label={t('countdown.ariaLabel')}
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        background: expired ? 'var(--color-error-bg)' : 'var(--color-info-bg)',
        color: expired ? 'var(--color-error)' : 'var(--vikki-vkblue-700)',
        font: 'var(--text-body-semibold)',
      }}
    >
      <span aria-hidden="true">⏱</span>
      {expired
        ? t('countdown.expired')
        : `${t('countdown.label')} ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      }
    </div>
  );
}
