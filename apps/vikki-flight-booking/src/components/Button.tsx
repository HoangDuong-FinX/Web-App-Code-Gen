import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'secondary' | 'text';
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

export default function Button({ children, variant = 'gradient', disabled, onClick, ariaLabel, className }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '14px 24px',
    borderRadius: 'var(--radius-012)',
    fontSize: 15,
    fontWeight: 600,
    transition: 'opacity 0.2s',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
  const variantStyles: Record<string, React.CSSProperties> = {
    gradient: { background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-blue))', color: 'var(--common-100)' },
    secondary: { background: 'var(--cool-neutral-98)', color: 'var(--label-normal)', border: '1px solid var(--line-normal)' },
    text: { background: 'transparent', color: 'var(--main-primary)', padding: '8px 16px' },
  };
  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant] }}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
