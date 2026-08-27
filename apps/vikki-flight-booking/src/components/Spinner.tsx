import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'large';
  ariaLabel: string;
}

export function Spinner({ size = 'large', ariaLabel }: SpinnerProps) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={ariaLabel}>
      <svg className="spinner__svg" viewBox="0 0 50 50" aria-hidden="true">
        <circle className="spinner__circle" cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
      </svg>
    </div>
  );
}

