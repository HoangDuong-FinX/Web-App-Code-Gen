import React from 'react';

interface InlineErrorProps {
  children: React.ReactNode;
  visible?: boolean;
  ariaLabel?: string;
}

export default function InlineError({ children, visible = true, ariaLabel }: InlineErrorProps) {
  if (!visible) return null;
  return (
    <p role="alert" aria-label={ariaLabel} style={{ fontSize: 13, color: 'var(--status-negative)', padding: '4px 0' }}>
      {children}
    </p>
  );
}
