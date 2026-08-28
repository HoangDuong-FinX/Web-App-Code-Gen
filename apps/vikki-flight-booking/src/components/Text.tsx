import React from 'react';

type TextVariant = 'title-2' | 'headline' | 'body' | 'body-semibold' | 'footnote';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';
  ariaLabel?: string;
  visible?: boolean;
  className?: string;
  bold?: boolean;
}

const variantStyles: Record<TextVariant, React.CSSProperties> = {
  'title-2': { fontSize: 24, fontWeight: 700, lineHeight: 1.35, fontFamily: 'var(--font-display)' },
  headline: { fontSize: 17, fontWeight: 600, lineHeight: 1.4, fontFamily: 'var(--font-display)' },
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.45, fontFamily: 'var(--font-body)' },
  'body-semibold': { fontSize: 14, fontWeight: 600, lineHeight: 1.45, fontFamily: 'var(--font-body)' },
  footnote: { fontSize: 12, fontWeight: 400, lineHeight: 1.4, fontFamily: 'var(--font-body)', color: 'var(--label-alternative)' },
};

export default function Text({ children, variant = 'body', as: Tag = 'p', ariaLabel, visible = true, className, bold }: TextProps) {
  if (!visible) return null;
  const style: React.CSSProperties = { ...variantStyles[variant] };
  if (bold) style.fontWeight = 700;
  return <Tag style={style} aria-label={ariaLabel} className={className}>{children}</Tag>;
}
