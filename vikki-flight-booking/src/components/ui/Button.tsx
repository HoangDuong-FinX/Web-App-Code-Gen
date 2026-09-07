import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  ariaLabel,
  'data-testid': testId,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 min-h-[44px]';

  const variants: Record<string, string> = {
    primary:
      'bg-[var(--vikki-vkblue-700)] text-white hover:opacity-90 focus-visible:ring-[var(--vikki-vkblue-700)]',
    secondary:
      'bg-[var(--gray-100)] text-[var(--color-text-primary)] border border-[var(--gray-200)] hover:bg-[var(--gray-200)] focus-visible:ring-[var(--vikki-vkblue-700)]',
    ghost:
      'bg-transparent text-[var(--vikki-vkblue-700)] hover:bg-[var(--gray-50)] focus-visible:ring-[var(--vikki-vkblue-700)]',
    outline:
      'bg-white border border-[var(--gray-200)] text-[var(--color-text-primary)] hover:bg-[var(--gray-50)] focus-visible:ring-[var(--vikki-vkblue-700)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      className={`${base} ${variants[variant] ?? variants.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
