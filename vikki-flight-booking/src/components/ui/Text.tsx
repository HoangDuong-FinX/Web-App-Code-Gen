import React from 'react';

type Variant =
  | 'title-1'
  | 'title-2'
  | 'headline'
  | 'body-semibold'
  | 'body'
  | 'footnote'
  | 'caption-2'
  | 'mono-label';

interface TextProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
  as?: keyof React.JSX.IntrinsicElements;
  id?: string;
}

const variantStyles: Record<Variant, string> = {
  'title-1': 'text-[28px] font-bold leading-[1.35] font-display',
  'title-2': 'text-[24px] font-bold leading-[1.35] font-display',
  'headline': 'text-[17px] font-semibold leading-[1.4] font-display',
  'body-semibold': 'text-[14px] font-semibold leading-[1.45]',
  'body': 'text-[14px] font-normal leading-[1.45]',
  'footnote': 'text-[12px] font-normal leading-[1.4] text-[var(--color-text-secondary)]',
  'caption-2': 'text-[10px] font-medium leading-[1.3] uppercase tracking-wide text-[var(--color-text-secondary)]',
  'mono-label': 'text-[12px] font-medium leading-[1.3] font-mono',
};

export function Text({ variant = 'body', children, className = '', 'data-testid': testId, as, id }: TextProps) {
  const Tag = (as ?? 'span') as keyof React.JSX.IntrinsicElements;
  return (
    <Tag
      id={id}
      data-testid={testId}
      className={`${variantStyles[variant]} ${className}`}
    >
      {children}
    </Tag>
  );
}
