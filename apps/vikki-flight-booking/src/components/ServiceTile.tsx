import React from 'react';

interface ServiceTileProps {
  icon: string;
  label: string;
  ariaLabel: string;
  disabled?: boolean;
  badge?: string;
  onClick?: () => void;
}

const iconMap: Record<string, string> = {
  seat: '💺',
  meal: '🍽️',
  baggage: '🧳',
  placeholder: '⋯',
};

export const ServiceTile: React.FC<ServiceTileProps> = ({ icon, label, ariaLabel, disabled = false, badge, onClick }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        backgroundColor: disabled ? '#f5f5f5' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        minHeight: 100,
        width: '100%',
      }}
    >
      <span style={{ fontSize: 28 }} aria-hidden="true">{iconMap[icon] ?? '📦'}</span>
      <span style={{ fontSize: 12, color: '#333', textAlign: 'center' }}>{label}</span>
      {badge && (
        <span style={{
          position: 'absolute',
          top: 4,
          right: 4,
          fontSize: 9,
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          padding: '2px 4px',
          color: '#666',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
};
