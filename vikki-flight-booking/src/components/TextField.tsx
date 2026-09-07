import React, { useState } from 'react';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  testId?: string;
  icon?: string;
}

export default function TextField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  ariaLabel,
  testId,
  icon,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        aria-label={ariaLabel}
        data-testid={testId}
        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
    </div>
  );
}
