import React from 'react';

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  testId?: string;
}

export default function Checkbox({
  label,
  checked = false,
  onChange,
  ariaLabel,
  testId,
}: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked)}
        aria-label={ariaLabel}
        data-testid={testId}
        className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
      {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
    </label>
  );
}
