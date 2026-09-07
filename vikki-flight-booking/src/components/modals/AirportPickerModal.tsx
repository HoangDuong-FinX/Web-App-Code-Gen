import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Text } from '../ui/Text';
import { t } from '../../i18n';
import type { Airport } from '../../types/state';

interface AirportPickerModalProps {
  open: boolean;
  airports: Airport[];
  mode: 'origin' | 'destination';
  onSelect: (airport: Airport) => void;
  onClose: () => void;
}

const GROUP_ORDER = ['Popular', 'Vietnam', 'International'] as const;

export function AirportPickerModal({ open, airports, mode, onSelect, onClose }: AirportPickerModalProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'origin' | 'destination'>(mode);

  const filtered = airports.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  });

  const grouped: Record<string, Airport[]> = {};
  GROUP_ORDER.forEach(g => { grouped[g] = []; });
  filtered.forEach(a => { if (grouped[a.group]) grouped[a.group].push(a); });

  return (
    <Modal
      title={t('airportPicker.title')}
      open={open}
      onClose={onClose}
      data-testid="airport-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <SegmentedControl
          options={[
            { label: t('airportPicker.origin'), value: 'origin' },
            { label: t('airportPicker.destination'), value: 'destination' },
          ]}
          value={tab}
          onChange={v => setTab(v as 'origin' | 'destination')}
          aria-label={t('airportPicker.title')}
          data-testid="origin-destination-tabs"
        />
        <TextField
          placeholder={t('airportPicker.search.placeholder')}
          value={search}
          onChange={setSearch}
          aria-label={t('airportPicker.search.aria')}
          data-testid="airport-search-input"
        />
        {GROUP_ORDER.map(group => {
          const items = grouped[group];
          if (!items || items.length === 0) return null;
          return (
            <div key={group} className="flex flex-col gap-1">
              <Text variant="caption-2" as="h3">{t('airportPicker.popular')}</Text>
              {items.map(airport => (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => onSelect(airport)}
                  aria-label={`Chọn sân bay ${airport.name}, ${airport.city}`}
                  data-testid="airport-item-button"
                  className="text-left px-3 py-2 rounded-xl hover:bg-[var(--vikki-vkblue-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--vikki-vkblue-500)] transition-colors"
                >
                  <div className="text-[14px] font-semibold">{airport.code} — {airport.city}</div>
                  <div className="text-[12px] text-[var(--gray-500)]">{airport.name}</div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
