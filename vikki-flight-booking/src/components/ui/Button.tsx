import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps {
  variant?: Variant;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vikki-vkblue-500)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--vikki-vkblue-500)] text-white hover:bg-[var(--vikki-vkblue-600)] focus-visible:outline-[var(--vikki-vkblue-500)]',
  secondary:
    'bg-[var(--gray-100)] text-[var(--gray-900)] hover:bg-[var(--gray-200)]',
  ghost:
    'bg-transparent text-[var(--vikki-vkblue-500)] hover:bg-[var(--vikki-vkblue-50)]',
  outline:
    'border border-[var(--gray-300)] bg-white text-[var(--gray-900)] hover:bg-[var(--gray-50)]',
  danger:
    'bg-[var(--color-error)] text-white hover:opacity-90',
};

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  loading,
  'aria-label': ariaLabel,
  'data-testid': testId,
  type = 'button',
  className = '',
  fullWidth,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      data-testid={testId}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? '...' : children}
    </button>
  );
}
