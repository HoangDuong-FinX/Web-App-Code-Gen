import React from 'react';
import './Text.css';

interface TextProps {
  variant?: 'title' | 'body-strong' | 'body' | 'body-small' | 'label';
  color?: 'default' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function Text({
  variant = 'body',
  color = 'default',
  children,
  className = '',
}: TextProps) {
  const variantClass = `text-${variant}`;
  const colorClass = color === 'secondary' ? 'text-secondary' : '';
  const classes = [variantClass, colorClass, className].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
}
