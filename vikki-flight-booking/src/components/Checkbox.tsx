import React, { useId } from 'react';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
  'data-testid'?: string;
  disabled?: boolean;
}

export function Checkbox({
  label,
  checked,
  onChange,
  ariaLabel,
  'data-testid': testId,
  disabled,
}: CheckboxProps): React.ReactElement {
  const id = useId();
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        font: 'var(--text-body)',
        color: 'var(--color-text-primary)',
        userSelect: 'none',
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        aria-label={ariaLabel}
        data-testid={testId}
        disabled={disabled}
        style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)', cursor: 'inherit' }}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
