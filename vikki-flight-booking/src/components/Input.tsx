import React from 'react';

interface InputProps {
  type?: 'text' | 'date' | 'email' | 'tel';
  label?: string;
  labelVariant?: 'subheadline' | 'body';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  min?: string;
  max?: string;
  testId?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  labelVariant = 'subheadline',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  min,
  max,
  testId,
}) => {
  const labelClass = labelVariant === 'subheadline' ? 'text-sm font-medium' : 'text-base font-normal';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={labelClass}>
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 border rounded text-base ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } disabled:bg-gray-100 disabled:text-gray-500`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        min={min}
        max={max}
        data-testid={testId}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};