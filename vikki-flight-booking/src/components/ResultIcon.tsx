import React from 'react';

interface ResultIconProps {
  state: 'success' | 'failed' | 'partial';
  testId?: string;
}

export default function ResultIcon({ state, testId }: ResultIconProps) {
  const bgColor = state === 'success' ? 'bg-green-100' : state === 'failed' ? 'bg-red-100' : 'bg-yellow-100';
  const textColor = state === 'success' ? 'text-green-600' : state === 'failed' ? 'text-red-600' : 'text-yellow-600';
  const symbol = state === 'success' ? '✓' : state === 'failed' ? '✕' : '⚠';

  return (
    <div
      className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mx-auto`}
      data-testid={testId}
    >
      <span className={`text-3xl font-bold ${textColor}`}>{symbol}</span>
    </div>
  );
}
