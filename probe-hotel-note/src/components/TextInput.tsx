import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  maxLength?: number;
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  maxLength,
  multiline = false,
  disabled = false,
  className = '',
}) => {
  const baseClass = 'text-input';
  const classes = `${baseClass} ${className}`.trim();

  if (multiline) {
    return (
      <textarea
        className={classes}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        maxLength={maxLength}
        disabled={disabled}
      />
    );
  }

  return (
    <input
      type="text"
      className={classes}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
};

export default TextInput;