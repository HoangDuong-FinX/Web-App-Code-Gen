import React from 'react';

interface TextInputProps {
  ariaLabel: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  value: string;
  onChange: (text: string) => void;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  ariaLabel,
  placeholder = '',
  maxLength = 200,
  multiline = false,
  value,
  onChange,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = e.currentTarget.value;
    if (text.length <= maxLength) {
      onChange(text);
    }
  };

  if (multiline) {
    return (
      <textarea
        aria-label={ariaLabel}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
        rows={4}
      />
    );
  }

  return (
    <input
      type="text"
      aria-label={ariaLabel}
      placeholder={placeholder}
      maxLength={maxLength}
      value={value}
      onChange={handleChange}
      className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};
