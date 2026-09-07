import React, { useState, useEffect, useRef } from 'react';
import { t } from '../i18n/vi';

interface PriceHoldCountdownProps {
  expiresAt: string | null;
  onExpired?: () => void;
  'data-testid'?: string;
}

export function PriceHoldCountdown({ expiresAt, onExpired, ...rest }: PriceHoldCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!expiresAt) return 0;
    return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
  });

  const onExpiredRef = useRef(onExpired);
  onExpiredRef.current = onExpired;

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        onExpiredRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (!expiresAt) return null;

  if (secondsLeft <= 0) {
    return (
      <div className="price-hold-countdown price-hold-countdown--expired" role="status" {...rest}>
        {t('priceHold.expired')}
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="price-hold-countdown" role="timer" aria-live="off" {...rest}>
      <span className="price-hold-countdown__label">{t('priceHold.label')}: </span>
      <span className="price-hold-countdown__time">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
