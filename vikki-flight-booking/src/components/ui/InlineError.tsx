import React from 'react';

interface InlineErrorProps {
  visible?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
  id?: string;
}

export function InlineError({ visible = true, children, 'data-testid': testId, id }: InlineErrorProps) {
  if (!visible) return null;
  return (
    <span
      id={id}
      data-testid={testId}
      role="alert"
      className="text-[12px] text-[var(--color-error)] font-normal"
    >
      {children}
    </span>
  );
}
