import React from 'react';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#1976d2',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  disabled = false,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle = variantStyles[variant];
  let hoverStyle: React.CSSProperties = {};

  if (isHovered && !disabled) {
    if (variant === 'primary') {
      hoverStyle = { backgroundColor: '#1565c0' };
    } else if (variant === 'ghost') {
      hoverStyle = { backgroundColor: 'rgba(25, 118, 210, 0.08)' };
    }
  }

  const mergedStyle: React.CSSProperties = {
    ...baseStyle,
    ...hoverStyle,
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed',
    }),
    ...style,
  };

  return (
    <button
      style={mergedStyle}
      disabled={disabled}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
};
