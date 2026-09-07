import React from 'react';

interface BoxProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Box({
  width,
  height,
  borderRadius,
  backgroundColor,
  children,
  className = '',
}: BoxProps) {
  const style = {
    width,
    height,
    borderRadius,
    backgroundColor,
  };
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
}
