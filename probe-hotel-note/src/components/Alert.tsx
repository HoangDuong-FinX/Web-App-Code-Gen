import React from 'react';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  ariaLabel,
  children,
  className = '',
}) => {
  const variantClasses: Record<string, string> = {
    'error': 'bg-red-100 border border-red-300 text-red-800',
    'success': 'bg-green-100 border border-green-300 text-green-800',
    'info': 'bg-blue-100 border border-blue-300 text-blue-800',
  };

  return (
    <div
      role="alert"
      aria-label={ariaLabel}
      className={`p-4 rounded-md ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};
