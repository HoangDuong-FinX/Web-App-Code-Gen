import React from 'react';

type LayoutType = 'stack' | 'grid' | 'repeat' | 'overlay';

interface LayoutProps {
  layoutType?: LayoutType;
  direction?: 'row' | 'column';
  gap?: string | number;
  columns?: string;
  alignItems?: string;
  justifyContent?: string;
  flexWrap?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  layoutType = 'stack',
  direction = 'column',
  gap,
  columns,
  alignItems,
  justifyContent,
  flexWrap,
  children,
  className = '',
}) => {
  let baseClass = '';
  let gapClass = '';

  if (gap) {
    const gapNum = typeof gap === 'number' ? gap : parseInt(gap);
    gapClass = `gap-${gapNum}`;
  }

  if (layoutType === 'stack') {
    baseClass = `flex ${direction === 'row' ? 'flex-row' : 'flex-col'} ${gapClass} ${alignItems ? `items-${alignItems}` : ''} ${justifyContent ? `justify-${justifyContent}` : ''}`;
  } else if (layoutType === 'grid') {
    baseClass = `grid ${gapClass} ${columns ? `grid-cols-${columns}` : 'grid-cols-1'}`;
  } else if (layoutType === 'overlay') {
    baseClass = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
  }

  return <div className={`${baseClass} ${flexWrap ? `flex-wrap` : ''} ${className}`}>{children}</div>;
};