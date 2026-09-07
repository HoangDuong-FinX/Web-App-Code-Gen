import React from 'react';

type Variant = 'large-title' | 'title-1' | 'title-2' | 'headline' | 'body' | 'body-semibold' | 'callout' | 'subheadline' | 'footnote';

interface TextProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

const variantToClass: Record<Variant, string> = {
  'large-title': 'text-4xl font-bold',
  'title-1': 'text-3xl font-bold',
  'title-2': 'text-2xl font-bold',
  'headline': 'text-lg font-semibold',
  'body': 'text-base font-normal',
  'body-semibold': 'text-base font-semibold',
  'callout': 'text-base font-medium',
  'subheadline': 'text-sm font-medium',
  'footnote': 'text-xs font-normal',
};

export const Text: React.FC<TextProps> = ({ variant = 'body', children, className = '', testId }) => {
  const variantClass = variantToClass[variant];
  return (
    <div className={`${variantClass} ${className}`} data-testid={testId}>
      {children}
    </div>
  );
};