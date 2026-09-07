import React from 'react';

type Tone = 'error' | 'warning' | 'success' | 'info' | 'neutral';

interface StatusNoteProps {
  tone?: Tone;
  children: React.ReactNode;
  visible?: boolean;
  ariaLabel?: string;
  testId?: string;
}

const toneToClass: Record<Tone, string> = {
  'error': 'bg-red-50 border-l-4 border-red-500 text-red-900',
  'warning': 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900',
  'success': 'bg-green-50 border-l-4 border-green-600 text-green-900',
  'info': 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
  'neutral': 'bg-gray-50 border-l-4 border-gray-300 text-gray-900',
};

export const StatusNote: React.FC<StatusNoteProps> = ({
  tone = 'neutral',
  children,
  visible = true,
  ariaLabel,
  testId,
}) => {
  if (!visible) return null;

  const toneClass = toneToClass[tone];

  return (
    <div
      className={`p-3 rounded text-sm ${toneClass}`}
      role="alert"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </div>
  );
};