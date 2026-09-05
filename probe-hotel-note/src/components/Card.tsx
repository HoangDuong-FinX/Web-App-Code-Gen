import React from 'react';

interface CardProps {
  interactive?: boolean;
  onTap?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ interactive = false, onTap, children, className = '' }) => {
  const handleClick = () => {
    if (interactive && onTap) {
      onTap();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (interactive && onTap && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onTap();
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 ${interactive ? 'cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : 'article'}
      tabIndex={interactive ? 0 : -1}
    >
      {children}
    </div>
  );
};
