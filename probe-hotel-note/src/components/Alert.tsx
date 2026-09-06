import React from 'react';

type AlertVariant = 'error' | 'success' | 'warning';

interface AlertProps {
  variant: AlertVariant;
  children: React.ReactNode;
  role?: string;
  ariaLive?: 'polite' | 'assertive';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  children,
  role,
  ariaLive,
  className = '',
}) => {
  const variantClass: Record<AlertVariant, string> = {
    error: 'bg-red-50 border border-red-200 text-red-800',
    success: 'bg-green-50 border border-green-200 text-green-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
  };

  return (
    <div
      className={`rounded p-4 ${variantClass[variant]} ${className}`}
      role={role}
      aria-live={ariaLive}
    >
      {children}
    </div>
  );
};

export default Alert;