// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  onTap?: () => void;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 p-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', icon, ariaLabel, children, onTap, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        onClick={onTap || props.onClick}
        className={`px-4 py-2 rounded font-medium transition-colors ${variantClasses[variant] || ''} ${className || ''}`}
        {...props}
      >
        {icon && <span className="mr-2">{icon === 'chevron-left' ? '←' : icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
