import React from 'react';

interface StackProps {
  direction?: 'row' | 'column';
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Stack({
  direction = 'column',
  gap = 'md',
  alignItems = 'center',
  justifyContent = 'flex-start',
  fullWidth = false,
  children,
  className = '',
}: StackProps) {
  const gapClasses: Record<string, string> = {
    'xs': 'gap-1',
    'sm': 'gap-2',
    'md': 'gap-4',
    'lg': 'gap-6',
  };

  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const alignClass = alignItems === 'flex-start' ? 'items-start' : alignItems === 'flex-end' ? 'items-end' : 'items-center';
  const justifyClass = justifyContent === 'flex-start' ? 'justify-start' : justifyContent === 'center' ? 'justify-center' : justifyContent === 'flex-end' ? 'justify-end' : 'justify-between';

  return (
    <div
      className={`flex ${directionClass} ${gapClasses[gap]} ${alignClass} ${justifyClass} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
