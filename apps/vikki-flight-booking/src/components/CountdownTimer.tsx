import React from 'react';

interface CountdownTimerProps {
  remainingSeconds: number;
  ariaLabel: string;
}

export function CountdownTimer({ remainingSeconds, ariaLabel }: CountdownTimerProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return (
    <div className="countdown-timer" aria-label={ariaLabel} aria-live="polite">
      <span className="countdown-timer__value">{display}</span>
    </div>
  );
}
