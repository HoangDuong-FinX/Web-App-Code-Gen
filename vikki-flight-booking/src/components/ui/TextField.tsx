// src/components/ui/TextField.tsx
import React from 'react';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  'data-testid'?: string;
  icon?: string;
  error?: boolean;
  id?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value = '',
  onChange,
  onBlur,
  type = 'text',
  required = false,
  disabled = false,
  ariaLabel,
  'data-testid': testId,
  error = false,
  id,
}) => {
  const fieldId = id ?? testId ?? `field-${label ?? 'input'}`;
  return (
    <div className="text-field">
      {label && (
        <label htmlFor={fieldId} className="text-field__label">
          {label}{required && <span className="text-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={fieldId}
        className={`text-field__input${error ? ' text-field__input--error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-label={!label ? ariaLabel : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        data-testid={testId}
      />
    </div>
  );
};
