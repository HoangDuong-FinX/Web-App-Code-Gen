import React from 'react';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  children: React.ReactNode;
  visible?: boolean;
  role?: string;
  ariaLabel?: string;
  className?: string;
}

export function Alert({
  variant = 'info',
  children,
  visible = true,
  role,
  ariaLabel,
  className = '',
}: AlertProps) {
  if (!visible) return null;

  const variantClasses: Record<string, string> = {
    'error': 'bg-red-50 text-red-800 border border-red-200',
    'success': 'bg-green-50 text-green-800 border border-green-200',
    'info': 'bg-blue-50 text-blue-800 border border-blue-200',
  };

  return (
    <div
      className={`px-4 py-3 rounded ${variantClasses[variant]} ${className}`}
      role={role || 'alert'}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
