// components/Card.tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  onTap?: () => void;
  children?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, onTap, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onTap}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => {
          if (interactive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onTap?.();
          }
        }}
        className={`p-4 border border-gray-200 rounded-lg ${
          interactive ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100' : ''
        } ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
