import React from 'react';

interface TextAreaProps {
  maxLength?: number;
  placeholder?: string;
  ariaLabel?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  maxLength = 200,
  placeholder,
  ariaLabel,
  value,
  onChange,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="border border-gray-300 rounded px-3 py-2 text-base font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={maxLength}
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
      />
      {helperText && <div className="text-xs text-gray-500">{helperText}</div>}
    </div>
  );
};
