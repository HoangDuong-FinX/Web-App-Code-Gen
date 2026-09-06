import React from 'react';

export interface TextProps {
  variant?: 'heading1' | 'body-bold' | 'body' | 'caption';
  color?: 'text-primary' | 'text-secondary';
  children: React.ReactNode;
  role?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text-primary',
  children,
  role,
}) => {
  const variantClasses = {
    'heading1': 'text-2xl font-bold',
    'body-bold': 'text-base font-bold',
    'body': 'text-base font-normal',
    'caption': 'text-sm font-normal',
  };

  const colorClasses = {
    'text-primary': 'text-gray-900',
    'text-secondary': 'text-gray-600',
  };

  return (
    <div className={`${variantClasses[variant]} ${colorClasses[color]}`} role={role}>
      {children}
    </div>
  );
};
