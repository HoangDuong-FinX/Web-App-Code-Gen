import React, { useState } from 'react';

interface TextInputProps {
  type?: string;
  maxLength?: number;
  placeholder?: string;
  ariaLabel?: string;
  ariaDescription?: string;
  value?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  type = 'text',
  maxLength,
  placeholder,
  ariaLabel,
  ariaDescription,
  value,
  initialValue,
  onChange,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(initialValue || '');
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <textarea
      type={type}
      maxLength={maxLength}
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      aria-label={ariaLabel}
      aria-description={ariaDescription}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
      rows={4}
    />
  );
};
