import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  onPress?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

const buttonStyles: Record<string, string> = {
  primary: 'px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 transition-colors',
  secondary: 'px-4 py-2 bg-gray-200 text-gray-900 rounded-md font-medium hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 transition-colors',
  ghost: 'px-0 py-2 text-left hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 transition-colors',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  onClick,
  onPress,
  ariaLabel,
  disabled = false,
  className = '',
}) => {
  const handler = onClick || onPress;
  const baseClass = buttonStyles[variant];
  return (
    <button
      className={`${baseClass} ${className}`}
      onClick={handler}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
