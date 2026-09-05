import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: '#007AFF',
    color: '#fff',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondary: {
    backgroundColor: '#f0f0f0',
    color: '#000',
    padding: '12px 16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default function Button({ variant, ariaLabel, onClick, children }: ButtonProps) {
  const style = variantStyles[variant];
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      style={style}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = variant === 'primary' ? '#0051D5' : '#e0e0e0';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = variant === 'primary' ? '#007AFF' : '#f0f0f0';
      }}
    >
      {children}
    </button>
  );
}