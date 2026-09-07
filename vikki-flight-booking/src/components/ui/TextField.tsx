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
  'aria-label'?: string;
  'data-testid'?: string;
  id?: string;
  error?: boolean;
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
  'aria-label': ariaLabel,
  'data-testid': testId,
  id,
  error,
}: TextFieldProps) {
  const inputId = id ?? testId ?? label;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[12px] font-medium text-[var(--gray-700)]"
        >
          {label}{required && <span className="text-[var(--color-error)] ml-0.5" aria-hidden>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={error}
        data-testid={testId}
        className={`w-full rounded-xl border px-3 py-3 text-[14px] bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--vikki-vkblue-500)] disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed ${
          error
            ? 'border-[var(--color-error)]'
            : 'border-[var(--gray-200)] hover:border-[var(--gray-400)]'
        }`}
      />
    </div>
  );
}
