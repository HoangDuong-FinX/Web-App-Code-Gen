import React from 'react';
import { t } from '../i18n';

export interface ServiceTileProps {
  label: string;
  icon?: string;
  enabled?: boolean;
  badge?: string;
  ariaLabel?: string;
  'data-testid'?: string;
  onClick?: () => void;
  selected?: boolean;
}

const ICON_MAP: Record<string, string> = {
  'airplane-seat': '\ud83d\udcba',
  utensils: '\ud83c\udf74',
  luggage: '\ud83e\uddf3',
  shield: '\ud83d\udee1\ufe0f',
  'shopping-bag': '\ud83d\udecd\ufe0f',
  gift: '\ud83c\udf81',
  building: '\ud83c\udfe8',
  activity: '\ud83c\udfc3',
  car: '\ud83d\ude97',
};

export function ServiceTile({
  label,
  icon,
  enabled = true,
  badge,
  ariaLabel,
  'data-testid': testId,
  onClick,
  selected,
}: ServiceTileProps): React.ReactElement {
  const emoji = icon ? ICON_MAP[icon] ?? '\u2b50' : '';
  const comingSoon = !enabled && badge;

  return (
    <button
      type="button"
      onClick={enabled ? onClick : undefined}
      disabled={!enabled}
      aria-label={ariaLabel ?? label}
      data-testid={testId}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '12px 8px',
        borderRadius: 'var(--radius-12)',
        border: `1.5px solid ${selected ? 'var(--color-primary)' : 'var(--gray-200)'}`,
        background: selected ? 'var(--color-primary-light)' : enabled ? '#fff' : 'var(--gray-50)',
        color: enabled ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
        cursor: enabled ? 'pointer' : 'not-allowed',
        opacity: enabled ? 1 : 0.7,
        minHeight: '80px',
        position: 'relative',
        transition: 'border-color 0.15s, background 0.15s',
      }}
    >
      {comingSoon && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            font: 'var(--text-caption-2)',
            background: 'var(--gray-300)',
            color: 'var(--gray-700)',
            padding: '1px 5px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {t('services.comingSoon')}
        </span>
      )}
      <span style={{ fontSize: '22px', lineHeight: 1 }} aria-hidden="true">{emoji}</span>
      <span style={{ font: 'var(--text-footnote)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
    </button>
  );
}
