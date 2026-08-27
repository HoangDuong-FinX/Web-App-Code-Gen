import React from 'react';
import { useI18n } from '../i18n';

interface TopBarProps {
  title: string;
  showBackArrow?: boolean;
  onBack?: () => void;
  ariaLabel?: string;
}

export function TopBar({ title, showBackArrow = false, onBack, ariaLabel }: TopBarProps) {
  return (
    <header className="topbar" aria-label={ariaLabel ?? title}>
      <div className="topbar__left">
        {showBackArrow && (
          <button
            className="topbar__back-btn"
            onClick={onBack}
            aria-label={useI18n().t('common.back')}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__right" />
    </header>
  );
}

