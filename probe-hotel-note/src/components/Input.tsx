import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: 'text' | 'textarea';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  maxLength,
  className = '',
  ...props
}) => {
  const baseClass =
    'border border-gray-300 rounded px-3 py-2 text-base font-normal focus:outline-none focus:ring-2 focus:ring-blue-500';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.currentTarget.value);
  };

  if (type === 'textarea') {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        className={`${baseClass} resize-none min-h-[100px] ${className}`}
        {...(props as any)}
      />
    );
  }

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      maxLength={maxLength}
      className={`${baseClass} ${className}`}
      {...props}
    />
  );
};

export default Input;