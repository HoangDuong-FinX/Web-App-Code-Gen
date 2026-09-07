// src/components/ui/Text.tsx
import React from 'react';

type Variant =
  | 'title-1'
  | 'title-2'
  | 'headline'
  | 'body'
  | 'body-semibold'
  | 'footnote'
  | 'caption-2'
  | 'mono-label';

interface TextProps {
  variant: Variant;
  children: React.ReactNode;
  semantic?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  'data-testid'?: string;
}

const variantClass: Record<Variant, string> = {
  'title-1': 'text-title-1',
  'title-2': 'text-title-2',
  'headline': 'text-headline',
  'body': 'text-body',
  'body-semibold': 'text-body-semibold',
  'footnote': 'text-footnote',
  'caption-2': 'text-caption-2',
  'mono-label': 'text-mono-label',
};

export const Text: React.FC<TextProps> = ({ variant, children, semantic, className = '', 'data-testid': testId }) => {
  const cls = `${variantClass[variant]} ${className}`.trim();
  const Tag = semantic ?? 'span';
  return (
    <Tag className={cls} data-testid={testId}>
      {children}
    </Tag>
  );
};
