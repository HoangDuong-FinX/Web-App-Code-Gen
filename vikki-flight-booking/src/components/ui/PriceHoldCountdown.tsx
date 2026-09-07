import React, { useEffect, useState } from 'react';
import { secondsRemaining, formatCountdown, isHoldExpired } from '../../utils/holdExpiry';
import { vi } from '../../i18n/vi';

interface PriceHoldCountdownProps {
  expiresAt: string;
  'data-testid'?: string;
}

export const PriceHoldCountdown: React.FC<PriceHoldCountdownProps> = ({
  expiresAt,
  'data-testid': testId,
}) => {
  const [secs, setSecs] = useState(() => secondsRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setSecs(secondsRemaining(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const expired = isHoldExpired(expiresAt);

  return (
    <div
      data-testid={testId}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
        expired
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span aria-hidden="true">{expired ? '⏰' : '⏱️'}</span>
      <span>
        {expired
          ? vi.common.priceHoldExpired
          : `${vi.common.priceHold}: ${formatCountdown(secs)}`}
      </span>
    </div>
  );
};
