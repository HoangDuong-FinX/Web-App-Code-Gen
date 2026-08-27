import React from 'react';

interface TextLinkProps {
  children: string;
  ariaLabel: string;
  onClick: () => void;
}

export function TextLink({ children, ariaLabel, onClick }: TextLinkProps) {
  return (
    <button
      className="text-link"
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
}

