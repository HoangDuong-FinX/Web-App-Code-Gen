import React from 'react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  labelVariant?: 'subheadline' | 'body';
  options?: SelectOption[] | string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  testId?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  labelVariant = 'subheadline',
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  testId,
}) => {
  const labelClass = labelVariant === 'subheadline' ? 'text-sm font-medium' : 'text-base font-normal';
  const optionsList = Array.isArray(options) ? options : [];

  return (
    <div className="flex flex-col gap-2">
      {label && <label className={labelClass}>{label}</label>}
      <select
        className={`px-3 py-2 border rounded text-base ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        } disabled:bg-gray-100 disabled:text-gray-500`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        data-testid={testId}
      >
        <option value="">-- Chọn --</option>
        {optionsList.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};