import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  disabled = false,
  onClick,
  role,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const variantClass = `button-${variant}`;

  return (
    <button
      className={`button ${variantClass} ${disabled ? 'button-disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      role={role}
      {...props}
    >
      {children}
    </button>
  );
}

const buttonStyles = `
  .button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .button-primary {
    background-color: #0066cc;
    color: white;
  }

  .button-primary:hover:not(:disabled) {
    background-color: #0052a3;
  }

  .button-secondary {
    background-color: #e9ecef;
    color: #333;
  }

  .button-secondary:hover:not(:disabled) {
    background-color: #dee2e6;
  }

  .button-ghost {
    background-color: transparent;
    color: #0066cc;
    padding: 0.5rem;
  }

  .button-ghost:hover:not(:disabled) {
    background-color: #f0f4f9;
  }

  .button-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .button:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = buttonStyles;
  document.head.appendChild(style);
}