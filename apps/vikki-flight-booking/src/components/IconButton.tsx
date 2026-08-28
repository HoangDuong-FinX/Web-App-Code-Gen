import React from 'react';

interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  ariaLabel?: string;
  visible?: boolean;
  className?: string;
}

const iconMap: Record<string, string> = {
  swap: '\u21C5',
  share: '\u2B06',
  back: '\u2190',
  close: '\u2715',
};

export default function IconButton({ icon, onClick, ariaLabel, visible = true, className }: IconButtonProps) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-008)',
        background: 'var(--fill-normal)',
        fontSize: 18,
        color: 'var(--label-normal)',
      }}
    >
      {iconMap[icon] ?? icon}
    </button>
  );
}
