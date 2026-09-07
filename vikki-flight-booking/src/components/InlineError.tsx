import React from 'react';

interface InlineErrorProps {
  visible?: boolean;
  children: React.ReactNode;
  testId?: string;
}

export default function InlineError({
  visible = false,
  children,
  testId,
}: InlineErrorProps) {
  if (!visible) return null;
  return (
    <div className="text-red-600 text-xs font-medium" data-testid={testId}>
      {children}
    </div>
  );
}
