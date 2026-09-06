import React from 'react';

interface TextProps {
  variant?: 'heading-1' | 'heading-2' | 'heading-3' | 'body-1' | 'body-2' | 'label' | 'caption';
  color?: 'primary' | 'secondary' | 'tertiary';
  textAlign?: 'left' | 'center' | 'right';
  role?: string;
  className?: string;
  children: React.ReactNode;
}

export function Text({
  variant = 'body-1',
  color = 'primary',
  textAlign = 'left',
  role,
  className = '',
  children,
}: TextProps) {
  const colorClass = color === 'secondary' ? 'text-secondary' : color === 'tertiary' ? 'text-tertiary' : 'text-primary';
  const alignClass = textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left';
  const variantClass = `text-${variant}`;

  return (
    <div className={`text ${variantClass} ${colorClass} ${alignClass} ${className}`} role={role}>
      {children}
    </div>
  );
}