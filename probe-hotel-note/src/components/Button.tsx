import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  role?: string;
  ariaLabel?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  role,
  ariaLabel,
  className = '',
  type = 'button',
}: ButtonProps) {
  const variantClasses: Record<string, string> = {
    'primary': 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
    'secondary': 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
    'ghost': 'bg-transparent text-gray-900 hover:bg-gray-100 disabled:bg-transparent',
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded font-medium transition-colors ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
