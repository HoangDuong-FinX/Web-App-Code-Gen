interface InputFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'selector' | 'phone';
  icon?: string;
  readOnly?: boolean;
  required?: boolean;
  ariaLabel?: string;
  helperText?: string;
  error?: string;
  onTap?: () => void;
  onChange?: (value: string) => void;
}

export function InputField({
  label,
  value = '',
  placeholder,
  type = 'text',
  readOnly = false,
  required = false,
  ariaLabel,
  helperText,
  error,
  onTap,
  onChange,
}: InputFieldProps) {
  const isSelector = type === 'selector';
  return (
    <div className={`input-field ${error ? 'input-field--error' : ''}`}>
      <label className="input-field__label">
        {label}
        {required && <span className="input-field__required" aria-hidden="true">*</span>}
      </label>
      {isSelector || readOnly ? (
        <button
          className="input-field__selector"
          onClick={onTap}
          aria-label={ariaLabel ?? label}
          type="button"
        >
          <span className={value ? 'input-field__value' : 'input-field__placeholder'}>
            {value || placeholder}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      ) : (
        <input
          className="input-field__input"
          type={type === 'phone' ? 'tel' : 'text'}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          aria-label={ariaLabel ?? label}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
      {helperText && !error && <span className="input-field__helper">{helperText}</span>}
      {error && <span className="input-field__error" id={`${label}-error`} role="alert">{error}</span>}
    </div>
  );
}

