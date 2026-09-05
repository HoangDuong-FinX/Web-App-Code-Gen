import React from 'react';

interface AlertProps {
  variant: 'error' | 'warning' | 'success';
  ariaLabel: string;
  children: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  error: {
    backgroundColor: '#FFE5E5',
    border: '1px solid #FF6B6B',
    borderRadius: '4px',
    padding: '12px',
    color: '#C92A2A',
    fontSize: '14px',
  },
  warning: {
    backgroundColor: '#FFF3CD',
    border: '1px solid #FFD700',
    borderRadius: '4px',
    padding: '12px',
    color: '#856404',
    fontSize: '14px',
  },
  success: {
    backgroundColor: '#E5FFE5',
    border: '1px solid #51CF66',
    borderRadius: '4px',
    padding: '12px',
    color: '#2F8E3F',
    fontSize: '14px',
  },
};

export default function Alert({ variant, ariaLabel, children }: AlertProps) {
  return (
    <div
      role="alert"
      aria-label={ariaLabel}
      style={variantStyles[variant]}
    >
      {children}
    </div>
  );
}