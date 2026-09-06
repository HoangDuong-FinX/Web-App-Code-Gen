import React from 'react';

export interface AlertProps {
  variant?: 'error' | 'success';
  children: React.ReactNode;
  role?: string;
  ariaLabel?: string;
  visible?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'error',
  children,
  role,
  ariaLabel,
  visible = true,
}) => {
  if (!visible) return null;

  const variantClasses = {
    'error': 'bg-red-100 border border-red-400 text-red-700',
    'success': 'bg-green-100 border border-green-400 text-green-700',
  };

  return (
    <div
      className={`px-4 py-3 rounded ${variantClasses[variant]}`}
      role={role || 'alert'}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};
