import { useState, useEffect, useCallback } from 'react';

export function useHoldTimer(expiresAt: string | null): {
  remainingSeconds: number;
  isExpired: boolean;
  formattedTime: string;
} {
  const calcRemaining = useCallback(() => {
    if (!expiresAt) return 0;
    const exp = new Date(expiresAt).getTime();
    if (isNaN(exp)) return 0;
    const diff = Math.max(0, Math.floor((exp - Date.now()) / 1000));
    return diff;
  }, [expiresAt]);

  const [remainingSeconds, setRemainingSeconds] = useState(calcRemaining);

  useEffect(() => {
    setRemainingSeconds(calcRemaining());
    const interval = setInterval(() => {
      const r = calcRemaining();
      setRemainingSeconds(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [calcRemaining]);

  const isExpired = remainingSeconds <= 0 && expiresAt !== null;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { remainingSeconds, isExpired, formattedTime };
}