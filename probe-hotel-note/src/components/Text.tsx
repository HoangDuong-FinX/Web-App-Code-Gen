import React from 'react';

interface TextProps {
  variant?: 'title' | 'body-strong' | 'body-secondary' | 'label' | 'caption';
  children: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({ variant = 'body-strong', children, className = '' }) => {
  const baseClasses = 'text';
  const variantClasses: Record<string, string> = {
    'title': 'text-2xl font-bold',
    'body-strong': 'text-base font-semibold',
    'body-secondary': 'text-base text-gray-600',
    'label': 'text-sm font-semibold',
    'caption': 'text-xs text-gray-500',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};
