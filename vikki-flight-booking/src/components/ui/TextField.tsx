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
  error?: string;
  className?: string;
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
  error,
  className = '',
}) => {
  const inputId = React.useId();
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel ?? label}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        data-testid={testId}
        className={`border rounded-xl px-3 py-2 text-sm min-h-[44px] bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--vikki-vkblue-700)] disabled:bg-[var(--gray-50)] disabled:cursor-not-allowed ${
          error ? 'border-red-500' : 'border-[var(--gray-200)]'
        }`}
      />
      {error && (
        <span id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
};
