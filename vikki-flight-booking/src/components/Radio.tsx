import React, { useId } from 'react';

export interface RadioProps {
  label?: string;
  checked?: boolean;
  onChange?: () => void;
  ariaLabel?: string;
  'data-testid'?: string;
  name?: string;
  value?: string;
}

export function Radio({
  label,
  checked,
  onChange,
  ariaLabel,
  'data-testid': testId,
  name,
  value,
}: RadioProps): React.ReactElement {
  const id = useId();
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        font: 'var(--text-body)',
        color: 'var(--color-text-primary)',
        userSelect: 'none',
      }}
    >
      <input
        id={id}
        type="radio"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        data-testid={testId}
        name={name}
        value={value}
        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
