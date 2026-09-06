import React from 'react';

interface TextProps {
  variant?: 'heading1' | 'body-bold' | 'body' | 'caption';
  color?: 'text-primary' | 'text-secondary';
  children: React.ReactNode;
  role?: string;
  className?: string;
}

export function Text({
  variant = 'body',
  color = 'text-primary',
  children,
  role,
  className = '',
}: TextProps) {
  const variantClasses: Record<string, string> = {
    'heading1': 'text-2xl font-bold',
    'body-bold': 'text-base font-semibold',
    'body': 'text-base font-normal',
    'caption': 'text-sm font-normal',
  };

  const colorClasses: Record<string, string> = {
    'text-primary': 'text-gray-900',
    'text-secondary': 'text-gray-600',
  };

  return (
    <div
      className={`${variantClasses[variant]} ${colorClasses[color]} ${className}`}
      role={role}
    >
      {children}
    </div>
  );
}
