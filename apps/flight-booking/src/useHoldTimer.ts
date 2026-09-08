import { useState, useEffect, useCallback } from 'react';

export function useHoldTimer(
  expiresAt: string | null,
): { timeLeft: number; display: string; expired: boolean } {
  const calcTimeLeft = useCallback(() => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [expiresAt]);

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    if (!expiresAt) return;
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, calcTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { timeLeft, display, expired: timeLeft <= 0 && expiresAt !== null };
}
