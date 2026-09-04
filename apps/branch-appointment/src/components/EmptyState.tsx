// Reusable EmptyState component
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  ariaLabel: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, ariaLabel }) => {
  return (
    <div className="empty-state" role="status" aria-label={ariaLabel}>
      <div className="empty-state-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
          <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
    </div>
  );
};
