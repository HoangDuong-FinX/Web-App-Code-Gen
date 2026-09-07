// src/components/ui/InlineError.tsx
import React from 'react';

interface InlineErrorProps {
  visible?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
  id?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  visible = true,
  children,
  'data-testid': testId,
  id,
}) => {
  if (!visible) return null;
  return (
    <span
      id={id}
      className="inline-error"
      role="alert"
      data-testid={testId}
    >
      {children}
    </span>
  );
};
