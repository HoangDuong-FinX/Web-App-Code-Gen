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
  'data-testid'?: string;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  ariaLabel,
  'data-testid': testId,
  className = '',
}) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      className={`flex rounded-xl overflow-hidden border border-[var(--gray-200)] bg-[var(--gray-50)] p-1 gap-1 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange?.(opt.value)}
          aria-pressed={value === opt.value}
          className={`flex-1 text-sm font-medium rounded-lg px-3 py-2 min-h-[36px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)] ${
            value === opt.value
              ? 'bg-white text-[var(--vikki-vkblue-700)] shadow-sm'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
