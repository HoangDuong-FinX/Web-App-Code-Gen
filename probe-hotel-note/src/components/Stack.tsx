import React from 'react';
import './Stack.css';

interface StackProps {
  direction?: 'row' | 'column';
  gap?: '1' | '2' | '4';
  alignment?: 'start' | 'center' | 'end';
  children: React.ReactNode;
  className?: string;
}

export function Stack({
  direction = 'row',
  gap = '4',
  alignment = 'center',
  children,
  className = '',
}: StackProps) {
  const directionClass = `stack-${direction}`;
  const gapClass = `gap-${gap}`;
  const alignmentClass = `align-${alignment}`;
  const classes = ['stack', directionClass, gapClass, alignmentClass, className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
