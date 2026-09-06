import React from 'react';

interface TextAreaProps {
  maxLength?: number;
  placeholder?: string;
  aria-label?: string;
  role?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

export function TextArea({
  maxLength,
  placeholder,
  role,
  value,
  onChange,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <textarea
      className={`textarea ${className}`}
      maxLength={maxLength}
      placeholder={placeholder}
      role={role}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

const textareaStyles = `
  .textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
  }

  .textarea:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = textareaStyles;
  document.head.appendChild(style);
}