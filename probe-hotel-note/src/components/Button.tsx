import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  ariaLabel?: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  ariaLabel,
  onClick,
  disabled = false,
  className = '',
}) => {
  const variantClasses: Record<string, string> = {
    'primary': 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    'secondary': 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-400',
  };

  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
