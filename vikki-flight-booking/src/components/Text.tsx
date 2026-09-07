import React from 'react';

export interface TextProps {
  variant?:
    | 'title-1'
    | 'title-2'
    | 'headline'
    | 'body-semibold'
    | 'body'
    | 'footnote'
    | 'caption-2'
    | 'mono-label';
  children?: React.ReactNode;
  semantic?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  'data-testid'?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const VARIANT_FONT: Record<string, string> = {
  'title-1': 'var(--text-title-1)',
  'title-2': 'var(--text-title-2)',
  headline: 'var(--text-headline)',
  'body-semibold': 'var(--text-body-semibold)',
  body: 'var(--text-body)',
  footnote: 'var(--text-footnote)',
  'caption-2': 'var(--text-caption-2)',
  'mono-label': 'var(--text-mono-label)',
};

const VARIANT_COLOR: Record<string, string> = {
  'caption-2': 'var(--color-text-secondary)',
  footnote: 'var(--color-text-secondary)',
  'mono-label': 'var(--color-text-primary)',
};

export function Text({
  variant = 'body',
  children,
  semantic,
  'data-testid': testId,
  className,
  style,
  id,
}: TextProps): React.ReactElement {
  // heading-N variants render as hN tags
  const Tag: React.ElementType = semantic ?? 'span';
  const font = VARIANT_FONT[variant] ?? 'var(--text-body)';
  const color = VARIANT_COLOR[variant];

  return (
    <Tag
      data-testid={testId}
      className={className}
      id={id}
      style={{
        display: 'block',
        font,
        ...(color ? { color } : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
