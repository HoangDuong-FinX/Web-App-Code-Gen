import React from 'react';

interface ServiceTileProps {
  label: string;
  icon?: string;
  enabled: boolean;
  badge?: string;
  testId?: string;
}

export default function ServiceTile({ label, icon, enabled, badge, testId }: ServiceTileProps) {
  return (
    <button
      className={`p-3 rounded-lg border-2 text-center transition ${
        enabled
          ? 'border-blue-500 bg-blue-50 text-blue-900 hover:bg-blue-100'
          : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
      }`}
      disabled={!enabled}
      data-testid={testId}
    >
      <div className="text-2xl mb-1">{icon === 'airplane-seat' ? '💺' : icon === 'utensils' ? '🍴' : icon === 'luggage' ? '🧳' : icon === 'shield' ? '🛡️' : icon === 'shopping-bag' ? '🛍️' : icon === 'gift' ? '🎁' : icon === 'building' ? '🏨' : icon === 'activity' ? '🎢' : icon === 'car' ? '🚗' : '◆'}</div>
      <div className="text-xs font-medium">{label}</div>
      {badge && <div className="text-xs text-gray-600 mt-1">{badge}</div>}
    </button>
  );
}
