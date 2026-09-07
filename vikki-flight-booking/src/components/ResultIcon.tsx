import React from 'react';

export type ResultState = 'success' | 'failed' | 'partial' | 'simulated';

export interface ResultIconProps {
  state: ResultState;
  'data-testid'?: string;
}

export function ResultIcon({ state, 'data-testid': testId }: ResultIconProps): React.ReactElement {
  const config: Record<ResultState, { bg: string; color: string; icon: string; label: string }> = {
    success: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: '\u2713', label: 'Thành công' },
    simulated: { bg: 'var(--color-success-bg)', color: 'var(--color-success)', icon: '\u2713', label: 'Thành công (mô phỏng)' },
    failed: { bg: 'var(--color-error-bg)', color: 'var(--color-error)', icon: '\u2717', label: 'Thất bại' },
    partial: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', icon: '\u26a0', label: 'Một phần' },
  };
  const { bg, color, icon, label } = config[state];
  return (
    <div
      data-testid={testId}
      aria-label={label}
      style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: bg,
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 700,
      }}
    >
      {icon}
    </div>
  );
}
