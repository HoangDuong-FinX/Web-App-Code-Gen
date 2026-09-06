import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  role?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  fullWidth = false,
  disabled = false,
  role,
  ariaLabel,
}) => {
  const variantClasses = {
    'primary': 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    'secondary': 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300',
    'ghost': 'bg-transparent text-gray-900 hover:bg-gray-100 border border-gray-200',
  };

  return (
    <button
      className={`px-4 py-2 rounded font-medium transition-colors ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
