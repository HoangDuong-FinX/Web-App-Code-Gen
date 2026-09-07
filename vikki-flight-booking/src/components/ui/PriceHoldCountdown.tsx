// src/components/ui/PriceHoldCountdown.tsx
import React, { useState, useEffect } from 'react';
import { vi } from '../../i18n/vi';

interface PriceHoldCountdownProps {
  expiresAt: string | null;
  'data-testid'?: string;
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return vi.priceHold.expired;
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${vi.priceHold.label}: ${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export const PriceHoldCountdown: React.FC<PriceHoldCountdownProps> = ({ expiresAt, 'data-testid': testId }) => {
  const [remaining, setRemaining] = useState<number>(() => {
    if (!expiresAt) return 0;
    return Math.max(0, new Date(expiresAt).getTime() - Date.now());
  });

  useEffect(() => {
    if (!expiresAt) return;
    const tick = setInterval(() => {
      const ms = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setRemaining(ms);
    }, 1000);
    return () => clearInterval(tick);
  }, [expiresAt]);

  const expired = remaining <= 0;

  return (
    <div
      className={`price-hold-countdown${expired ? ' price-hold-countdown--expired' : ''}`}
      data-testid={testId}
      aria-live="polite"
    >
      {expiresAt ? formatRemaining(remaining) : vi.priceHold.expired}
    </div>
  );
};
