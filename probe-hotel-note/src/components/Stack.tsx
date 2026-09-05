import React from 'react';

interface StackProps {
  direction?: 'row' | 'column';
  gap?: string;
  alignItems?: string;
  children: React.ReactNode;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  direction = 'column',
  gap = '16',
  alignItems,
  children,
  className = '',
}) => {
  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';
  const gapClass = `gap-${gap}`;
  const alignClass = alignItems ? `items-${alignItems.replace('flex-', '')}` : '';

  return (
    <div className={`flex ${directionClass} ${gapClass} ${alignClass} ${className}`}>
      {children}
    </div>
  );
};
