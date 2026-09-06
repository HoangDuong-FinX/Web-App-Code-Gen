import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'default';
  role?: string;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', role, className = '', children }: BadgeProps) {
  const variantClass = `badge-${variant}`;

  return (
    <span className={`badge ${variantClass} ${className}`} role={role}>
      {children}
    </span>
  );
}

const badgeStyles = `
  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .badge-success {
    background-color: #d4edda;
    color: #155724;
  }

  .badge-warning {
    background-color: #fff3cd;
    color: #856404;
  }

  .badge-error {
    background-color: #f8d7da;
    color: #721c24;
  }

  .badge-default {
    background-color: #e9ecef;
    color: #495057;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = badgeStyles;
  document.head.appendChild(style);
}