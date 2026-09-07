import React from 'react';

interface ServiceTileProps {
  label: string;
  icon?: string;
  enabled?: boolean;
  badge?: string;
  onClick?: () => void;
  ariaLabel?: string;
  'data-testid'?: string;
  selected?: boolean;
}

const ICON_MAP: Record<string, string> = {
  'airplane-seat': '💺',
  utensils: '🍽️',
  luggage: '🧳',
  shield: '🛡️',
  'shopping-bag': '🛍️',
  gift: '🎁',
  building: '🏨',
  activity: '🎯',
  car: '🚗',
};

export const ServiceTile: React.FC<ServiceTileProps> = ({
  label,
  icon,
  enabled = true,
  badge,
  onClick,
  ariaLabel,
  'data-testid': testId,
  selected = false,
}) => {
  const iconChar = icon ? (ICON_MAP[icon] ?? '✈️') : '✈️';

  return (
    <button
      type="button"
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      data-testid={testId}
      className={`relative flex flex-col items-center justify-center gap-1 rounded-xl p-3 min-h-[80px] text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vikki-vkblue-700)] ${
        !enabled
          ? 'bg-[var(--gray-50)] text-[var(--color-text-secondary)] opacity-60 cursor-not-allowed'
          : selected
          ? 'bg-[var(--vikki-vkblue-50)] border-2 border-[var(--vikki-vkblue-700)] text-[var(--vikki-vkblue-700)]'
          : 'bg-[var(--gray-50)] border border-[var(--gray-200)] text-[var(--color-text-primary)] hover:bg-[var(--vikki-vkblue-50)]'
      }`}
    >
      <span className="text-2xl" aria-hidden="true">
        {iconChar}
      </span>
      <span className="text-xs font-medium leading-tight">{label}</span>
      {badge && (
        <span className="absolute top-1 right-1 text-[9px] bg-[var(--gray-200)] text-[var(--color-text-secondary)] rounded px-1">
          {badge}
        </span>
      )}
    </button>
  );
};
