import React from 'react';

export interface InlineErrorProps {
  visible?: boolean;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export function InlineError({
  visible = true,
  children,
  'data-testid': testId,
}: InlineErrorProps): React.ReactElement | null {
  if (!visible) return null;
  return (
    <p
      role="alert"
      data-testid={testId}
      style={{
        font: 'var(--text-footnote)',
        color: 'var(--color-error)',
        margin: '2px 0 0',
      }}
    >
      {children}
    </p>
  );
}
