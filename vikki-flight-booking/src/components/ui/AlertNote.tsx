import React from 'react';

type Tone = 'neutral' | 'error' | 'warning' | 'success' | 'info';

interface AlertNoteProps {
  tone?: Tone;
  visible?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
  role?: 'alert' | 'status';
}

const toneStyles: Record<Tone, string> = {
  neutral: 'bg-[var(--gray-100)] text-[var(--gray-800)] border-[var(--gray-300)]',
  error: 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]',
  warning: 'bg-[var(--color-warning-bg)] text-[var(--gray-800)] border-[var(--color-warning)]',
  success: 'bg-[var(--color-success-bg)] text-[var(--gray-800)] border-[var(--color-success)]',
  info: 'bg-[var(--color-info-bg)] text-[var(--vikki-vkblue-700)] border-[var(--vikki-vkblue-300)]',
};

export function AlertNote({
  tone = 'neutral',
  visible = true,
  children,
  'data-testid': testId,
  role,
}: AlertNoteProps) {
  if (!visible) return null;
  return (
    <div
      role={role}
      data-testid={testId}
      className={`rounded-xl border px-4 py-3 text-[14px] font-normal ${toneStyles[tone]}`}
    >
      {children}
    </div>
  );
}
