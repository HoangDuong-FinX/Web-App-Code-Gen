import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  style,
  children,
  ...props
}) => {
  const mergedStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    ...style,
  };

  return (
    <div style={mergedStyle} {...props}>
      {children}
    </div>
  );
};
