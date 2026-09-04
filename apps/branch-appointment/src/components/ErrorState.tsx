// Reusable ErrorState component with retry
import React from 'react';
import { t } from '../i18n';

interface ErrorStateProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry?: () => void;
  ariaLabel: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, description, retryLabel, onRetry, ariaLabel }) => {
  return (
    <div className="error-state" role="alert" aria-label={ariaLabel}>
      <div className="error-state-icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
          <path d="M24 14v14M24 32v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-description">{description}</p>
      {onRetry && (
        <button
          className="btn btn-primary"
          onClick={onRetry}
          aria-label={retryLabel ?? t('branchList.retry')}
        >
          {retryLabel ?? t('branchList.retry')}
        </button>
      )}
    </div>
  );
};
