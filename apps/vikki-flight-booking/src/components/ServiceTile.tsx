import React from 'react';

interface ServiceTileProps {
  icon: string;
  title: string;
  description: string;
  selectionBadge: number;
  ariaLabel: string;
  onTap: () => void;
}

export function ServiceTile({ icon, title, description, selectionBadge, ariaLabel, onTap }: ServiceTileProps) {
  return (
    <button
      className="service-tile"
      onClick={onTap}
      aria-label={ariaLabel}
      type="button"
    >
      <span className="service-tile__icon" aria-hidden="true">{icon}</span>
      <span className="service-tile__title">{title}</span>
      <span className="service-tile__desc">{description}</span>
      {selectionBadge > 0 && (
        <span className="service-tile__badge" aria-hidden="true">{selectionBadge}</span>
      )}
    </button>
  );
}

