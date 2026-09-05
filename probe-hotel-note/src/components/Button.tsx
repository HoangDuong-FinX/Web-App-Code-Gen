import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'ghost';
  icon?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 px-4 py-2 rounded font-medium',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 px-2 py-2 rounded',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  icon,
  ariaLabel,
  children,
  onPress,
  disabled = false,
}) => {
  const className = `${variantStyles[variant]} transition-colors cursor-pointer`;
  
  return (
    <button
      className={className}
      onClick={onPress}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
