import React from 'react';

type TextVariant = 'heading' | 'body-strong' | 'body' | 'caption' | 'label';

interface TextProps {
  variant: TextVariant;
  children: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({ variant, children, className = '' }) => {
  const baseClass = 'text-gray-900';

  const variantClass: Record<TextVariant, string> = {
    heading: 'text-2xl font-bold',
    'body-strong': 'text-base font-semibold',
    body: 'text-base font-normal',
    caption: 'text-sm font-normal text-gray-600',
    label: 'text-sm font-semibold',
  };

  const element = variant === 'heading' ? 'h1' : 'p';
  const Element = element as any;

  return (
    <Element className={`${baseClass} ${variantClass[variant]} ${className}`}>
      {children}
    </Element>
  );
};

export default Text;