import React, { useEffect, useState } from 'react';

interface PriceHoldCountdownProps {
  expiresAt?: string;
  testId?: string;
}

export default function PriceHoldCountdown({ expiresAt, testId }: PriceHoldCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = Math.max(0, expiry.getTime() - now.getTime());
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="text-sm font-medium text-gray-600 mt-2" data-testid={testId}>
      Giữ giá: {timeLeft}
    </div>
  );
}
