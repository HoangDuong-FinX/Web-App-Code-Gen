// src/components/ui/Button.tsx
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps {
  variant?: Variant;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  icon?: string;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
  danger: 'btn-danger',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  children,
  onClick,
  disabled = false,
  ariaLabel,
  'data-testid': testId,
  type = 'button',
  className = '',
  icon,
}) => {
  return (
    <button
      type={type}
      className={`btn ${variantClass[variant]} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};
