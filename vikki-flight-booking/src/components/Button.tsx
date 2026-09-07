import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  testId?: string;
  icon?: string;
  className?: string;
}

const variantStyles: Record<string, string> = {
  'primary': 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50',
  'secondary': 'bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50',
  'ghost': 'bg-transparent text-blue-600 hover:bg-gray-100 disabled:opacity-50',
  'outline': 'border border-gray-300 bg-white text-black hover:bg-gray-50 disabled:opacity-50',
};

export default function Button({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  ariaLabel,
  testId,
  icon,
  className = '',
}: ButtonProps) {
  const baseClass = variantStyles[variant] || variantStyles.primary;
  return (
    <button
      className={`px-4 py-2 rounded font-medium transition ${baseClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
