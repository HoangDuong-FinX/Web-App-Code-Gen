import React from 'react';

export interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  role?: string;
  ariaLabel?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value = '',
  onChange,
  placeholder,
  maxLength = 200,
  role,
  ariaLabel,
}) => {
  return (
    <textarea
      className="w-full px-3 py-2 border border-gray-300 rounded font-normal text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      role={role || 'textbox'}
      aria-label={ariaLabel}
      rows={4}
    />
  );
};
