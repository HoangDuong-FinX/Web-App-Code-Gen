import React from 'react';

interface CardProps {
  interactive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Card({ interactive, onClick, children }: CardProps) {
  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      aria-pressed={interactive}
      style={{
        padding: '12px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff',
        cursor: interactive ? 'pointer' : 'default',
        transition: interactive ? 'background-color 0.2s' : 'none',
      }}
      onMouseEnter={(e) => interactive && (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => interactive && (e.currentTarget.style.backgroundColor = '#fff')}
    >
      {children}
    </div>
  );
}