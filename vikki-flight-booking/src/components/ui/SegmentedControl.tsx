import React from 'react';

interface Option {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  'aria-label'?: string;
  'data-testid'?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  'data-testid': testId,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      data-testid={testId}
      className="flex rounded-xl bg-[var(--gray-100)] p-1 gap-1"
    >
      {options.map(opt => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={opt.value === value}
          onClick={() => onChange(opt.value)}
          type="button"
          className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] ${
            opt.value === value
              ? 'bg-white text-[var(--vikki-vkblue-500)] shadow-sm'
              : 'text-[var(--gray-600)] hover:text-[var(--gray-900)]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
