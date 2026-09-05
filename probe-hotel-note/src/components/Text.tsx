import React from 'react';

interface TextProps {
  variant:
    | 'heading1'
    | 'heading2'
    | 'body'
    | 'body-strong'
    | 'body-secondary'
    | 'label'
    | 'caption';
  children: React.ReactNode;
  className?: string;
}

const textStyles: Record<string, string> = {
  heading1: 'text-2xl font-bold text-gray-900',
  heading2: 'text-xl font-bold text-gray-900',
  body: 'text-base text-gray-700',
  'body-strong': 'text-base font-semibold text-gray-900',
  'body-secondary': 'text-base text-gray-600',
  label: 'text-sm font-medium text-gray-700',
  caption: 'text-xs text-gray-600',
};

export const Text: React.FC<TextProps> = ({ variant, children, className = '' }) => {
  const baseClass = textStyles[variant];
  return <div className={`${baseClass} ${className}`}>{children}</div>;
};
