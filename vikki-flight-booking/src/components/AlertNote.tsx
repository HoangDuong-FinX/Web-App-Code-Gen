import React from 'react';

interface AlertNoteProps {
  tone?: 'neutral' | 'positive' | 'warning' | 'negative';
  visible?: boolean;
  children: React.ReactNode;
  testId?: string;
  role?: string;
}

const toneStyles: Record<string, string> = {
  'neutral': 'bg-gray-50 text-gray-900 border-gray-200',
  'positive': 'bg-green-50 text-green-900 border-green-200',
  'warning': 'bg-yellow-50 text-yellow-900 border-yellow-200',
  'negative': 'bg-red-50 text-red-900 border-red-200',
};

export default function AlertNote({
  tone = 'neutral',
  visible = true,
  children,
  testId,
  role = 'status',
}: AlertNoteProps) {
  if (!visible) return null;
  const baseClass = toneStyles[tone] || toneStyles.neutral;
  return (
    <div
      className={`p-3 border rounded ${baseClass}`}
      data-testid={testId}
      role={role}
    >
      {children}
    </div>
  );
}
