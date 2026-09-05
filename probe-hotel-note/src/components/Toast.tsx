import React from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  type?: ToastType;
  message: string;
  ariaLabel?: string;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  type = 'info',
  message,
  ariaLabel,
  className = '',
}) => {
  if (!visible) return null;

  const baseClass = `toast toast--${type}`;
  const classes = `${baseClass} ${className}`.trim();

  return (
    <div className={classes} role="status" aria-label={ariaLabel} aria-live="polite">
      {message}
    </div>
  );
};

export default Toast;