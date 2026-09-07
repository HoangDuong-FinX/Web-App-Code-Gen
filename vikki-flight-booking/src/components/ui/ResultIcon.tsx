import React from 'react';
import type { PaymentResult } from '../../types';

interface ResultIconProps {
  state: PaymentResult;
  'data-testid'?: string;
}

export const ResultIcon: React.FC<ResultIconProps> = ({ state, 'data-testid': testId }) => {
  const configs: Record<PaymentResult, { bg: string; icon: string; label: string }> = {
    success: { bg: 'bg-green-100 text-green-600', icon: '✓', label: 'Thành công' },
    failed: { bg: 'bg-red-100 text-red-600', icon: '✕', label: 'Thất bại' },
    partial: { bg: 'bg-amber-100 text-amber-600', icon: '~', label: 'Một phần' },
    simulated: { bg: 'bg-green-100 text-green-600', icon: '✓', label: 'Mô phỏng' },
  };
  const cfg = configs[state];
  return (
    <div
      data-testid={testId}
      aria-label={cfg.label}
      className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold ${cfg.bg}`}
    >
      {cfg.icon}
    </div>
  );
};
