import React from 'react';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TextVariant;
  children?: React.ReactNode;
}

const variantStyles: Record<TextVariant, React.CSSProperties> = {
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    lineHeight: '1.3',
  },
  body: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.5',
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.4',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    lineHeight: '1.4',
  },
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  style,
  children,
  ...props
}) => {
  const mergedStyle = {
    ...variantStyles[variant],
    ...style,
  };

  return (
    <div style={mergedStyle} {...props}>
      {children}
    </div>
  );
};
