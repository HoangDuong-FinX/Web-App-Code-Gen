import React from 'react';

type TextVariant = 'pageTitle' | 'sectionTitle' | 'title' | 'bodyStrong' | 'body' | 'label' | 'caption';

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  role?: string;
  className?: string;
}

const Text: React.FC<TextProps> = ({ variant = 'body', children, role, className = '' }) => {
  const baseClass = `text text--${variant}`;
  const classes = `${baseClass} ${className}`.trim();

  return (
    <div className={classes} role={role}>
      {children}
    </div>
  );
};

export default Text;