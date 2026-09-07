import React from 'react';

interface InlineErrorProps {
  visible?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
  visible = true,
  children,
  'data-testid': testId,
}) => {
  if (!visible) return null;
  return (
    <span
      role="alert"
      data-testid={testId}
      className="text-xs text-red-600 block mt-1"
    >
      {children}
    </span>
  );
};
