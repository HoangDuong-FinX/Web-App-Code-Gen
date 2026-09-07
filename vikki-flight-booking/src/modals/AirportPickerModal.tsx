import React, { useState, useMemo } from 'react';
import { Modal } from '../components/Modal';
import { SegmentedControl } from '../components/SegmentedControl';
import { TextField } from '../components/TextField';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { t } from '../i18n';
import type { Airport } from '../types/state';

interface AirportPickerModalProps {
  airports: Airport[];
  initialTab: 'origin' | 'destination';
  selectedOrigin: Airport | null;
  selectedDestination: Airport | null;
  onSelect: (airport: Airport, tab: 'origin' | 'destination') => void;
  onClose: () => void;
}

export function AirportPickerModal({
  airports,
  initialTab,
  onSelect,
  onClose,
}: AirportPickerModalProps): React.ReactElement {
  const [tab, setTab] = useState<'origin' | 'destination'>(initialTab);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!q) return airports;
    return airports.filter(a => {
      const haystack = `${a.code} ${a.name} ${a.city} ${a.country}`
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return haystack.includes(q);
    });
  }, [airports, query]);

  const groups: Array<{ label: string; items: Airport[] }> = [
    { label: t('airportPicker.popularGroup'), items: filtered.filter(a => a.group === 'Popular') },
    { label: t('airportPicker.vietnamGroup'), items: filtered.filter(a => a.group === 'Vietnam') },
    { label: t('airportPicker.internationalGroup'), items: filtered.filter(a => a.group === 'International') },
  ].filter(g => g.items.length > 0);

  return (
    <Modal
      title={t('airportPicker.title')}
      dismissible
      onClose={onClose}
      data-testid="airport-picker-modal"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <SegmentedControl
          options={[
            { label: t('airportPicker.origin'), value: 'origin' },
            { label: t('airportPicker.destination'), value: 'destination' },
          ]}
          value={tab}
          onChange={v => setTab(v as 'origin' | 'destination')}
          ariaLabel={t('airportPicker.title')}
          data-testid="origin-destination-tabs"
        />
        <TextField
          placeholder={t('airportPicker.search.placeholder')}
          value={query}
          onChange={setQuery}
          ariaLabel={t('airportPicker.search.ariaLabel')}
          data-testid="airport-search-input"
        />
        {groups.map(group => (
          <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Text
              variant="caption-2"
              semantic="h3"
              style={{ textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 0' }}
            >
              {group.label}
            </Text>
            {group.items.map(airport => (
              <Button
                key={airport.code}
                variant="ghost"
                onClick={() => onSelect(airport, tab)}
                ariaLabel={`${t('airportPicker.title')}: ${airport.city} (${airport.code})`}
                data-testid="airport-item-button"
                style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '10px 8px' }}
              >
                <span style={{ fontWeight: 700, marginRight: '6px' }}>{airport.code}</span>
                {airport.city}, {airport.country} — {airport.name}
              </Button>
            ))}
          </div>
        ))}
        {groups.length === 0 && (
          <Text variant="body" style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '16px 0' }}>
            Không tìm thấy sân bay
          </Text>
        )}
      </div>
    </Modal>
  );
}
