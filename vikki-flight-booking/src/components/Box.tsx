import React from 'react';

interface BoxProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  border?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Box: React.FC<BoxProps> = ({
  width,
  height,
  background,
  borderRadius,
  border,
  children,
  className = '',
}) => {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;
  if (background) style.background = background;
  if (borderRadius) style.borderRadius = borderRadius;
  if (border) style.border = border;

  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};