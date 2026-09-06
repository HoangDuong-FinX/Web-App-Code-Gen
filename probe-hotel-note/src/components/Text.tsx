// components/Text.tsx
import React from 'react';

interface TextProps {
  variant?: 'heading-lg' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'label-md' | 'caption-sm';
  role?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const variantClasses: Record<string, string> = {
  'heading-lg': 'text-2xl font-bold',
  'body-lg': 'text-lg font-medium',
  'body-md': 'text-base font-medium',
  'body-sm': 'text-sm font-normal',
  'body-xs': 'text-xs font-normal',
  'label-md': 'text-sm font-semibold',
  'caption-sm': 'text-xs font-normal text-gray-600',
};

export const Text = React.forwardRef<
  HTMLDivElement,
  TextProps & { as?: keyof JSX.IntrinsicElements }
>(({ variant = 'body-md', role, children, htmlFor, className, as = 'div', ...props }, ref) => {
  const Element = htmlFor ? 'label' : as;
  return (
    <Element
      ref={ref as any}
      role={role}
      htmlFor={htmlFor}
      className={`${variantClasses[variant] || ''} ${className || ''}`}
      {...props}
    >
      {children}
    </Element>
  );
});

Text.displayName = 'Text';
