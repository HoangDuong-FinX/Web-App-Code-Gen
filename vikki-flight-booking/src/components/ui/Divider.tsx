import React from 'react';

export function Divider({ className = '' }: { className?: string }) {
  return (
    <hr
      className={`border-0 border-t border-[var(--gray-200)] my-2 ${className}`}
      aria-hidden
    />
  );
}
