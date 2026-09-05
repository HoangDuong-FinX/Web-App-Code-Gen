import React from 'react';

interface ListItemProps {
  onTap?: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ onTap, children, ariaLabel }) => {
  return (
    <button
      onClick={onTap}
      className="w-full text-left border border-gray-200 rounded px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col gap-1">{children}</div>
    </button>
  );
};
