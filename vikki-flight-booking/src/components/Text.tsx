import React from 'react';

interface TextProps {
  variant?: 'title-1' | 'title-2' | 'headline' | 'body' | 'body-semibold' | 'footnote' | 'caption-2' | 'mono-label';
  semantic?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

const variantStyles: Record<string, string> = {
  'title-1': 'text-2xl font-bold leading-snug',
  'title-2': 'text-xl font-bold leading-snug',
  'headline': 'text-lg font-semibold leading-snug',
  'body': 'text-sm font-normal leading-relaxed',
  'body-semibold': 'text-sm font-semibold leading-relaxed',
  'footnote': 'text-xs font-normal leading-snug',
  'caption-2': 'text-xs font-medium leading-snug',
  'mono-label': 'text-xs font-medium leading-snug font-mono',
};

export default function Text({
  variant = 'body',
  semantic = 'span',
  children,
  className = '',
  testId,
}: TextProps) {
  const baseClass = variantStyles[variant] || variantStyles.body;
  const Element = semantic as any;
  return (
    <Element className={`${baseClass} ${className}`} data-testid={testId}>
      {children}
    </Element>
  );
}
