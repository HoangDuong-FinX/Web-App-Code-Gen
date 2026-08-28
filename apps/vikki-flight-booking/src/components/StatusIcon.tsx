import React from 'react';

interface StatusIconProps {
  variant: 'success' | 'error' | 'warning';
  size?: 'md' | 'lg' | 'xl';
  ariaLabel: string;
}

const variantStyles: Record<string, { bg: string; color: string; icon: string }> = {
  success: { bg: '#e8f5e9', color: '#2e7d32', icon: '✓' },
  error: { bg: '#ffebee', color: '#c62828', icon: '✕' },
  warning: { bg: '#fff3e0', color: '#e65100', icon: '⚠' },
};

const sizeMap: Record<string, number> = { md: 48, lg: 64, xl: 80 };

export const StatusIcon: React.FC<StatusIconProps> = ({ variant, size = 'xl', ariaLabel }) => {
  const s = variantStyles[variant];
  const dim = sizeMap[size];
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        backgroundColor: s.bg,
        color: s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: dim * 0.5,
        fontWeight: 'bold',
      }}
    >
      {s.icon}
    </div>
  );
};
