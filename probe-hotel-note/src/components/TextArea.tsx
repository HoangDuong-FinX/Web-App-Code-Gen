import React from 'react';

interface TextAreaProps {
  placeholder?: string;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  role?: string;
  ariaLabel?: string;
  className?: string;
}

export function TextArea({
  placeholder,
  maxLength,
  value,
  onChange,
  role,
  ariaLabel,
  className = '',
}: TextAreaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded font-normal text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      role={role}
      aria-label={ariaLabel}
      rows={4}
    />
  );
}
