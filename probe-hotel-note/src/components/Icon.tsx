import React from 'react';

type IconName = 'error-circle' | 'chevron-left';
type IconSize = 'small' | 'medium' | 'large';
type IconColor = 'error' | 'default';

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  role?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 'medium',
  color = 'default',
  role,
  className = '',
}) => {
  const baseClass = `icon icon--${name} icon--${size} icon--${color}`;
  const classes = `${baseClass} ${className}`.trim();

  // Simple SVG-based icons
  const iconContent: Record<IconName, React.ReactNode> = {
    'error-circle': (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    'chevron-left': (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return (
    <span className={classes} role={role}>
      {iconContent[name]}
    </span>
  );
};

export default Icon;