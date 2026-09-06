import React from 'react';

interface CardProps {
  interactive?: boolean;
  onClick?: () => void;
  role?: string;
  className?: string;
  children: React.ReactNode;
}

export function Card({ interactive = false, onClick, role, className = '', children }: CardProps) {
  return (
    <div
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      onClick={onClick}
      role={role}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {children}
    </div>
  );
}

const cardStyles = `
  .card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
  }

  .card-interactive {
    cursor: pointer;
  }

  .card-interactive:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .card-interactive:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = cardStyles;
  document.head.appendChild(style);
}