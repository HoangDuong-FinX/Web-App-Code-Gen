// src/components/ui/AlertNote.tsx
import React from 'react';

type Tone = 'neutral' | 'warning' | 'error' | 'success';

interface AlertNoteProps {
  tone?: Tone;
  visible?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
  className?: string;
}

export const AlertNote: React.FC<AlertNoteProps> = ({
  tone = 'neutral',
  visible = true,
  children,
  'data-testid': testId,
  className = '',
}) => {
  if (!visible) return null;
  return (
    <div
      role="alert"
      className={`alert-note alert-note--${tone} ${className}`.trim()}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
