// src/components/ui/SegmentedControl.tsx
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
  disabled?: boolean;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  ariaLabel,
  'data-testid': testId,
  disabled = false,
}) => {
  return (
    <div
      className="segmented-control"
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`segmented-control__item${value === opt.value ? ' segmented-control__item--active' : ''}`}
          aria-pressed={value === opt.value}
          onClick={() => !disabled && onChange?.(opt.value)}
          disabled={disabled}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
