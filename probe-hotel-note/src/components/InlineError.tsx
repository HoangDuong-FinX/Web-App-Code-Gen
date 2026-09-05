import React from 'react';

interface InlineErrorProps {
  variant?: 'error';
  children: React.ReactNode;
  role?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({ variant = 'error', children, role = 'alert' }) => {
  const className = variant === 'error' ? 'bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded' : '';
  return (
    <div className={className} role={role}>
      {children}
    </div>
  );
};
