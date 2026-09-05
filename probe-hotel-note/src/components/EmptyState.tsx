import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  children: React.ReactNode;
  className?: string;
}

export function EmptyState({ children, className = '' }: EmptyStateProps) {
  const classes = ['empty-state', className].filter(Boolean).join(' ');
  return (
    <div className={classes} role="status">
      {children}
    </div>
  );
}
