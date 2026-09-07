import React from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'dayPillButton' | 'fareClassButton' | 'seatButton';
type Size = 'small' | 'compact' | 'medium' | 'large';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
  ariaLabel?: string;
  testId?: string;
  title?: string;
}

const variantToClass: Record<Variant, string> = {
  'primary': 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
  'secondary': 'bg-gray-200 text-gray-950 hover:bg-gray-300 disabled:bg-gray-100',
  'tertiary': 'bg-transparent text-blue-600 hover:bg-blue-50',
  'ghost': 'bg-transparent text-gray-600 hover:text-gray-900',
  'dayPillButton': 'px-3 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200',
  'fareClassButton': 'px-4 py-2 rounded border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  'seatButton': 'w-8 h-8 flex items-center justify-center text-xs font-bold',
};

const sizeToClass: Record<Size, string> = {
  'small': 'px-2 py-1 text-xs',
  'compact': 'px-3 py-2 text-sm',
  'medium': 'px-4 py-2 text-base',
  'large': 'w-full px-4 py-3 text-base font-semibold',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  selected = false,
  className = '',
  ariaLabel,
  testId,
  title,
}) => {
  const variantClass = variantToClass[variant];
  const sizeClass = sizeToClass[size];
  const selectedClass = selected ? 'ring-2 ring-blue-600' : '';

  return (
    <button
      className={`${variantClass} ${sizeClass} ${selectedClass} rounded transition-colors ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={testId}
      title={title}
    >
      {children}
    </button>
  );
};