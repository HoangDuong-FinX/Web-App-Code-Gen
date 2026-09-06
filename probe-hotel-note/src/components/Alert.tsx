import React from 'react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  role?: string;
  className?: string;
  children: React.ReactNode;
}

export function Alert({ variant = 'info', role, className = '', children }: AlertProps) {
  const variantClass = `alert-${variant}`;

  return (
    <div className={`alert ${variantClass} ${className}`} role={role}>
      {children}
    </div>
  );
}

const alertStyles = `
  .alert {
    padding: 1rem;
    border-radius: 4px;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .alert-warning {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
  }

  .alert-info {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = alertStyles;
  document.head.appendChild(style);
}