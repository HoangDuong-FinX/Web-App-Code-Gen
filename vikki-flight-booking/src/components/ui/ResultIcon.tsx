import React from 'react';

type State = 'success' | 'failed' | 'partial' | 'simulated';

interface ResultIconProps {
  state: State;
  'data-testid'?: string;
}

const config: Record<State, { bg: string; text: string; symbol: string; label: string }> = {
  success: { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', symbol: '✓', label: 'Thành công' },
  simulated: { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', symbol: '✓', label: 'Giả lập thành công' },
  failed: { bg: 'bg-[var(--color-error-bg)]', text: 'text-[var(--color-error)]', symbol: '✕', label: 'Thất bại' },
  partial: { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', symbol: '~', label: 'Một phần' },
};

export function ResultIcon({ state, 'data-testid': testId }: ResultIconProps) {
  const c = config[state];
  return (
    <div
      data-testid={testId}
      aria-label={c.label}
      className={`w-20 h-20 rounded-full flex items-center justify-center ${c.bg}`}
    >
      <span className={`text-4xl font-bold ${c.text}`} aria-hidden>{c.symbol}</span>
    </div>
  );
}
