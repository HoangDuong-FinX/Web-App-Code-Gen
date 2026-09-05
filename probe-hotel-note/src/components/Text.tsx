import React from 'react';

interface TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  title: 'text-2xl font-bold text-gray-900',
  subtitle: 'text-lg font-semibold text-gray-800',
  body: 'text-base text-gray-700',
  caption: 'text-sm text-gray-600',
  label: 'text-sm font-medium text-gray-800',
};

export const Text: React.FC<TextProps> = ({ variant = 'body', children }) => {
  const className = variantStyles[variant] || variantStyles.body;
  return <div className={className}>{children}</div>;
};
