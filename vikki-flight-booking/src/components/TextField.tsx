import React, { useId } from 'react';

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'password';
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  'data-testid'?: string;
  error?: boolean;
  icon?: string;
  style?: React.CSSProperties;
}

export function TextField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  required,
  disabled,
  ariaLabel,
  'data-testid': testId,
  error,
  style,
}: TextFieldProps): React.ReactElement {
  const id = useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{ font: 'var(--text-body-semibold)', color: 'var(--color-text-primary)' }}
        >
          {label}{required && <span aria-hidden="true" style={{ color: 'var(--color-error)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        aria-invalid={error ? 'true' : undefined}
        data-testid={testId}
        style={{
          padding: '10px 12px',
          borderRadius: 'var(--radius-8)',
          border: `1.5px solid ${error ? 'var(--color-error)' : 'var(--gray-200)'}`,
          font: 'var(--text-body)',
          background: disabled ? 'var(--gray-100)' : '#fff',
          color: 'var(--color-text-primary)',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
