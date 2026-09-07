import React from 'react';

export interface SegmentedOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
  ariaLabel?: string;
  'data-testid'?: string;
  style?: React.CSSProperties;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  'data-testid': testId,
  style,
}: SegmentedControlProps): React.ReactElement {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-testid={testId}
      style={{
        display: 'flex',
        borderRadius: 'var(--radius-8)',
        background: 'var(--gray-100)',
        padding: '3px',
        gap: '2px',
        ...style,
      }}
    >
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange?.(opt.value)}
          aria-pressed={opt.value === value}
          style={{
            flex: 1,
            padding: '6px 12px',
            borderRadius: 'var(--radius-8)',
            border: 'none',
            font: 'var(--text-body-semibold)',
            cursor: 'pointer',
            background: opt.value === value ? '#fff' : 'transparent',
            color: opt.value === value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            boxShadow: opt.value === value ? 'var(--shadow-card)' : 'none',
            transition: 'background 0.15s',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
