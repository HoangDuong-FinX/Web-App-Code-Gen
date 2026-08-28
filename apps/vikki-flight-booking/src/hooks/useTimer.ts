import { useState, useEffect, useCallback } from 'react';

export function useTimer(expiresAt: string | null): {
  timeLeft: number;
  isExpired: boolean;
  formattedTime: string;
} {
  const getTimeLeft = useCallback(() => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }, [expiresAt]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    if (!expiresAt) return;
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      const left = getTimeLeft();
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, getTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { timeLeft, isExpired: timeLeft <= 0, formattedTime };
}
