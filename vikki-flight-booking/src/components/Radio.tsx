import React from 'react';

interface RadioProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  testId?: string;
}

export default function Radio({ checked = false, onChange, ariaLabel, testId }: RadioProps) {
  return (
    <input
      type="radio"
      checked={checked}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked)}
      aria-label={ariaLabel}
      data-testid={testId}
      className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-500"
    />
  );
}
