import React from 'react';

export interface AlertNoteProps {
  tone?: 'neutral' | 'positive' | 'critical' | 'warning' | 'info';
  visible?: boolean;
  children?: React.ReactNode;
  'data-testid'?: string;
  role?: 'alert' | 'status';
}

const TONE_STYLES: Record<string, React.CSSProperties> = {
  neutral: { background: 'var(--gray-100)', borderColor: 'var(--gray-300)', color: 'var(--color-text-primary)' },
  positive: { background: 'var(--color-success-bg)', borderColor: 'var(--color-success)', color: 'var(--color-success)' },
  critical: { background: 'var(--color-error-bg)', borderColor: 'var(--color-error)', color: 'var(--color-error)' },
  warning: { background: 'var(--color-warning-bg)', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' },
  info: { background: 'var(--color-info-bg)', borderColor: 'var(--vikki-vkblue-300)', color: 'var(--vikki-vkblue-700)' },
};

export function AlertNote({
  tone = 'neutral',
  visible = true,
  children,
  'data-testid': testId,
  role,
}: AlertNoteProps): React.ReactElement | null {
  if (!visible) return null;
  const ts = TONE_STYLES[tone] ?? TONE_STYLES.neutral;
  return (
    <div
      role={role}
      data-testid={testId}
      style={{
        padding: '10px 14px',
        borderRadius: 'var(--radius-8)',
        border: '1px solid',
        font: 'var(--text-body)',
        ...ts,
      }}
    >
      {children}
    </div>
  );
}
