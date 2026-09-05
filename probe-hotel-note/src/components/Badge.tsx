import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  role?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, role, className = '' }) => {
  const classes = `badge ${className}`.trim();

  return (
    <span className={classes} role={role}>
      {children}
    </span>
  );
};

export default Badge;