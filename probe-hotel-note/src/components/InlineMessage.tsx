import React from 'react';

interface InlineMessageProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  visible?: boolean;
  children: React.ReactNode;
  ariaLive?: 'polite' | 'assertive';
  role?: string;
  className?: string;
}

const messageStyles: Record<string, string> = {
  success: 'bg-green-50 border border-green-200 text-green-800 rounded-md p-3',
  error: 'bg-red-50 border border-red-200 text-red-800 rounded-md p-3',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3',
  info: 'bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-3',
};

export const InlineMessage: React.FC<InlineMessageProps> = ({
  variant = 'info',
  visible = true,
  children,
  ariaLive,
  role,
  className = '',
}) => {
  if (!visible) return null;

  const baseClass = messageStyles[variant];
  return (
    <div
      className={`${baseClass} ${className}`}
      aria-live={ariaLive}
      role={role}
    >
      {children}
    </div>
  );
};
