import React from 'react';

interface EmptyStateProps {
  message: string;
  ariaLabel?: string;
}

export function EmptyState({ message, ariaLabel }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-label={ariaLabel}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <path d="M16 28C16 28 19 32 24 32C29 32 32 28 32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="20" r="2" fill="currentColor" opacity="0.5"/>
        <circle cx="30" cy="20" r="2" fill="currentColor" opacity="0.5"/>
      </svg>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
