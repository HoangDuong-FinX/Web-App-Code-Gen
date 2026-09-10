import { useState, useEffect, useCallback } from 'react';

export function useHoldTimer(expiresAt: string | null): {
  timeLeft: number;
  display: string;
  isExpired: boolean;
} {
  const calcTimeLeft = useCallback((): number => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [expiresAt]);

  const [timeLeft, setTimeLeft] = useState<number>(calcTimeLeft);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => {
      const newTime = calcTimeLeft();
      setTimeLeft(newTime);
      if (newTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [calcTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { timeLeft, display, isExpired: timeLeft <= 0 };
}
