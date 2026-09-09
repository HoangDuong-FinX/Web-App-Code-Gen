import React, { useState, useEffect } from 'react';
import { useAppState, useAppDispatch } from '../store';
import { useT } from '../i18n/index';
import { formatTimer } from '../utils';
import type { ScreenId } from '../types';

interface HoldTimerBadgeProps {
  navigate: (screen: ScreenId) => void;
}

export function HoldTimerBadge({ navigate }: HoldTimerBadgeProps) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const t = useT();
  const expiresAt = Math.min(
    state.outboundSession?.expiresAt ?? Infinity,
    state.returnSession?.expiresAt ?? Infinity
  );

  const [timer, setTimer] = useState(() => formatTimer(expiresAt));

  useEffect(() => {
    if (expiresAt === Infinity) return;
    const id = setInterval(() => {
      const next = formatTimer(expiresAt);
      setTimer(next);
      if (next.expired) {
        dispatch({ type: 'SET_HOLD_EXPIRED', payload: true });
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, dispatch]);

  if (expiresAt === Infinity) return null;

  if (state.holdExpired) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-center" data-testid="hold-expired-alert">
        <p className="text-red-800 font-semibold" aria-live="assertive">{t.holdExpired.title}</p>
        <p className="text-red-700 text-sm mt-1">{t.holdExpired.message}</p>
        <button
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
          aria-label={t.holdExpired.searchAgain}
          onClick={() => {
            dispatch({ type: 'RESET' });
            navigate('search');
          }}
        >
          {t.holdExpired.searchAgain}
        </button>
      </div>
    );
  }

  return (
    <span
      className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full"
      aria-label={t.results.holdTimer.replace('{mm}', timer.mm).replace('{ss}', timer.ss)}
      data-testid="hold-timer-badge"
    >
      {timer.mm}:{timer.ss}
    </span>
  );
}
