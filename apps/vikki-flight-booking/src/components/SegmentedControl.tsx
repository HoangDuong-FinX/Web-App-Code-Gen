import React from 'react';

interface SegmentedControlProps {
  options: string[];
  value: number;
  onChange: (index: number) => void;
  ariaLabel?: string;
}

export default function SegmentedControl({ options, value, onChange, ariaLabel }: SegmentedControlProps) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{ display: 'flex', borderRadius: 'var(--radius-008)', background: 'var(--fill-normal)', padding: 2 }}>
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={i === value}
          onClick={() => onChange(i)}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: 'var(--radius-008)',
            fontSize: 14,
            fontWeight: i === value ? 600 : 400,
            background: i === value ? 'var(--common-100)' : 'transparent',
            color: i === value ? 'var(--label-normal)' : 'var(--label-alternative)',
            boxShadow: i === value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
