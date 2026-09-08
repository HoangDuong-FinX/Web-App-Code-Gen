import React, { useState, useMemo } from 'react';
import type { Airport } from '../types';
import { t } from '../i18n/vi';
import { stripDiacritics } from '../utils/stripDiacritics';

interface AirportPickerModalProps {
  airports: Airport[];
  onSelect: (airport: Airport) => void;
  onClose: () => void;
}

export function AirportPickerModal({ airports, onSelect, onClose }: AirportPickerModalProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return airports;
    const needle = stripDiacritics(search.trim());
    return airports.filter(
      (a) =>
        stripDiacritics(a.name).includes(needle) ||
        a.code.toLowerCase().includes(needle)
    );
  }, [airports, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, Airport[]> = { popular: [], vietnam: [], international: [] };
    for (const a of filtered) {
      if (groups[a.group]) {
        groups[a.group].push(a);
      }
    }
    return groups;
  }, [filtered]);

  const groupLabels: Record<string, string> = {
    popular: t('airportPicker.popular'),
    vietnam: t('airportPicker.vietnam'),
    international: t('airportPicker.international'),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" aria-label={t('airportPicker.title')}>
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('airportPicker.title')}</h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label={t('airportPicker.close')}
            data-testid="close-action"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder={t('airportPicker.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('airportPicker.searchLabel')}
            data-testid="search-input"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filtered.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400" data-testid="no-route-message">
              {t('airportPicker.noRoute')}
            </p>
          )}

          {(['popular', 'vietnam', 'international'] as const).map((group) => {
            const items = grouped[group];
            if (!items || items.length === 0) return null;
            return (
              <div key={group} className="mb-3">
                <h3 className="mb-1 text-xs font-bold uppercase text-gray-400" data-testid="group-label">
                  {groupLabels[group]}
                </h3>
                {items.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-gray-50"
                    onClick={() => onSelect(airport)}
                    aria-label={`${airport.name} (${airport.code})`}
                  >
                    <span className="text-sm text-gray-900" data-testid="airport-name">{airport.name}</span>
                    <span className="text-sm font-bold text-gray-500" data-testid="airport-code">{airport.code}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}