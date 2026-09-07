import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  'data-testid'?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled,
  ariaLabel,
  'data-testid': testId,
  type = 'button',
  className = '',
  style,
  fullWidth,
}: ButtonProps): React.ReactElement {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: 'var(--radius-8)',
    font: 'var(--text-body-semibold)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: '1.5px solid transparent',
    transition: 'background 0.15s, border-color 0.15s, opacity 0.15s',
    width: fullWidth ? '100%' : undefined,
    whiteSpace: 'nowrap',
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#fff',
      borderColor: 'var(--color-primary)',
    },
    secondary: {
      backgroundColor: 'var(--gray-100)',
      color: 'var(--color-text-primary)',
      borderColor: 'var(--gray-200)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
    },
    danger: {
      backgroundColor: 'var(--color-error)',
      color: '#fff',
      borderColor: 'var(--color-error)',
    },
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      className={className}
      style={{ ...base, ...variantStyles[variant] }}
    >
      {children}
    </button>
  );
}
