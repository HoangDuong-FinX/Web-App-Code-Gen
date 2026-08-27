import React, { useState, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Modal } from './Modal';
import type { Airport, CityPair } from '../types';

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  airports: Airport[];
  cityPairs: CityPair[];
  currentOrigin?: string;
  mode: 'origin' | 'destination';
  onSelect: (airport: Airport) => void;
}

export function LocationPickerModal({
  open,
  onClose,
  airports,
  cityPairs,
  currentOrigin,
  mode,
  onSelect,
}: LocationPickerModalProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');

  const filteredAirports = useMemo(() => {
    let available = airports;
    if (mode === 'destination' && currentOrigin) {
      const validDests = cityPairs
        .filter((p) => p.origin === currentOrigin)
        .map((p) => p.destination);
      available = airports.filter((a) => validDests.includes(a.code));
    } else if (mode === 'origin') {
      const validOrigins = [...new Set(cityPairs.map((p) => p.origin))];
      available = airports.filter((a) => validOrigins.includes(a.code));
    }
    if (!search) return available;
    const q = search.toLowerCase();
    return available.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
    );
  }, [airports, cityPairs, currentOrigin, mode, search]);

  return (
    <Modal open={open} title={t('locationPicker.title')} onClose={onClose}>
      <input
        className="location-picker__search"
        type="search"
        placeholder={t('locationPicker.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label={t('locationPicker.searchPlaceholder')}
      />
      <ul className="location-picker__list" role="listbox">
        {filteredAirports.map((airport) => (
          <li
            key={airport.code}
            className="location-picker__item"
            role="option"
            aria-selected={false}
          >
            <button
              className="location-picker__btn"
              onClick={() => { onSelect(airport); onClose(); }}
              type="button"
            >
              <span className="location-picker__code">{airport.code}</span>
              <span className="location-picker__name">{airport.name} - {airport.city}</span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

