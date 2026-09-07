import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  testId?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  testId,
}: SegmentedControlProps) {
  return (
    <div
      className="flex gap-2 p-1 bg-gray-100 rounded"
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`flex-1 px-3 py-2 rounded font-medium transition ${
            value === opt.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'bg-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onChange?.(opt.value)}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
