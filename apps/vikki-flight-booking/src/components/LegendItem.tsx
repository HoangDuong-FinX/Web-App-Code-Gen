import React from 'react';

interface LegendItemProps {
  color: 'selected' | 'emergency' | 'reserved';
  label: string;
  ariaLabel: string;
}

const colorMap: Record<string, string> = {
  selected: '#E31837',
  emergency: '#fff3e0',
  reserved: '#e0e0e0',
};

export const LegendItem: React.FC<LegendItemProps> = ({ color, label, ariaLabel }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} aria-label={ariaLabel}>
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          backgroundColor: colorMap[color],
          border: '1px solid #ccc',
        }}
        aria-hidden="true"
      />
      <span style={{ fontSize: 12, color: '#555' }}>{label}</span>
    </div>
  );
};
