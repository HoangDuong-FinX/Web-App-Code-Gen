import React from 'react';

interface AlertNoteProps {
  visible?: boolean;
  children: React.ReactNode;
  tone?: 'neutral' | 'warning' | 'error' | 'success';
  'data-testid'?: string;
  action?: React.ReactNode;
}

export const AlertNote: React.FC<AlertNoteProps> = ({
  visible = true,
  children,
  tone = 'neutral',
  'data-testid': testId,
  action,
}) => {
  if (!visible) return null;

  const toneStyles: Record<string, string> = {
    neutral: 'bg-[var(--gray-50)] border-[var(--gray-200)] text-[var(--color-text-primary)]',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div
      role="alert"
      data-testid={testId}
      className={`rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${toneStyles[tone] ?? toneStyles.neutral}`}
    >
      <span className="flex-1">{children}</span>
      {action && <span className="shrink-0">{action}</span>}
    </div>
  );
};
