import React from 'react';

interface TextInputProps {
  ariaLabel: string;
  placeholder: string;
  maxLength: number;
  multiline?: boolean;
  value: string;
  onChange: (text: string) => void;
}

export default function TextInput({
  ariaLabel,
  placeholder,
  maxLength,
  multiline,
  value,
  onChange,
}: TextInputProps) {
  if (multiline) {
    return (
      <textarea
        aria-label={ariaLabel}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '14px',
          minHeight: '100px',
          resize: 'vertical',
        }}
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
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '14px',
      }}
    />
  );
}