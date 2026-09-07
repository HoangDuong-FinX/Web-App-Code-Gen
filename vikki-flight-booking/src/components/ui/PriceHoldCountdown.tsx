import React, { useEffect, useState } from 'react';
import { t } from '../../i18n';

interface PriceHoldCountdownProps {
  expiresAt: string;
  onExpired?: () => void;
  'data-testid'?: string;
}

export function PriceHoldCountdown({ expiresAt, onExpired, 'data-testid': testId }: PriceHoldCountdownProps) {
  const [remaining, setRemaining] = useState<number>(() => {
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const secs = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setRemaining(secs);
      if (secs === 0) {
        clearInterval(interval);
        onExpired?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const expired = remaining === 0;

  return (
    <div
      data-testid={testId}
      aria-live="polite"
      aria-atomic
      className={`flex items-center gap-2 text-[12px] font-medium rounded-lg px-3 py-2 ${
        expired
          ? 'bg-[var(--color-error-bg)] text-[var(--color-error)]'
          : remaining < 120
          ? 'bg-[var(--color-warning-bg)] text-[var(--gray-800)]'
          : 'bg-[var(--gray-100)] text-[var(--gray-600)]'
      }`}
    >
      <span aria-hidden>⏱</span>
      {expired
        ? t('holdExpired.note')
        : `Giá được giữ trong: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}
    </div>
  );
}
