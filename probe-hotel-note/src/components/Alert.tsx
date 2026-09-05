import React from 'react';
import './Alert.css';

interface AlertProps {
  variant?: 'error' | 'success' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = 'info',
  children,
  className = '',
}: AlertProps) {
  const variantClass = `alert-${variant}`;
  const classes = ['alert', variantClass, className].filter(Boolean).join(' ');

  return (
    <div className={classes} role="alert">
      {children}
    </div>
  );
}
