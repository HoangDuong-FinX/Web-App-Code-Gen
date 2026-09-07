import React from 'react';
import { t } from '../../i18n';

interface ServiceTileProps {
  label: string;
  icon: string;
  enabled: boolean;
  badge?: string;
  onClick?: () => void;
  'aria-label'?: string;
  'data-testid'?: string;
  selected?: boolean;
}

const iconMap: Record<string, string> = {
  'airplane-seat': '💺',
  'utensils': '🍽️',
  'luggage': '🧳',
  'shield': '🛡️',
  'shopping-bag': '🛍️',
  'gift': '🎁',
  'building': '🏨',
  'activity': '🎯',
  'car': '🚗',
};

export function ServiceTile({
  label,
  icon,
  enabled,
  badge,
  onClick,
  'aria-label': ariaLabel,
  'data-testid': testId,
  selected,
}: ServiceTileProps) {
  return (
    <button
      type="button"
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      data-testid={testId}
      className={`relative flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] ${
        enabled
          ? selected
            ? 'bg-[var(--vikki-vkblue-50)] border-2 border-[var(--vikki-vkblue-500)] cursor-pointer'
            : 'bg-[var(--gray-50)] border border-[var(--gray-200)] hover:bg-[var(--vikki-vkblue-50)] cursor-pointer'
          : 'bg-[var(--gray-50)] border border-[var(--gray-200)] opacity-60 cursor-not-allowed'
      }`}
    >
      <span className="text-2xl" aria-hidden>{iconMap[icon] ?? '•'}</span>
      <span className="text-[11px] font-medium leading-tight text-[var(--gray-800)]">{label}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 bg-[var(--vikki-vkblue-500)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
          {t('services.comingSoon')}
        </span>
      )}
    </button>
  );
}
