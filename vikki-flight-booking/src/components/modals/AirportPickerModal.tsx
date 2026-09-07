import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SegmentedControl } from '../ui/SegmentedControl';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { vi } from '../../i18n/vi';
import type { Airport } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  mode: 'origin' | 'destination';
  airports: Airport[];
  onSelect: (airport: Airport, mode: 'origin' | 'destination') => void;
}

export const AirportPickerModal: React.FC<Props> = ({
  open,
  onClose,
  mode,
  airports,
  onSelect,
}) => {
  const [tab, setTab] = useState<'origin' | 'destination'>(mode);
  const [query, setQuery] = useState('');

  React.useEffect(() => { setTab(mode); }, [mode]);
  React.useEffect(() => { if (open) setQuery(''); }, [open]);

  const filtered = airports.filter((a) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q)
    );
  });

  const groups: Array<{ label: string; items: Airport[] }> = [
    { label: vi.airportPicker.popularGroup, items: filtered.filter((a) => a.group === 'Popular') },
    { label: vi.airportPicker.vietnamGroup, items: filtered.filter((a) => a.group === 'Vietnam') },
    { label: vi.airportPicker.internationalGroup, items: filtered.filter((a) => a.group === 'International') },
  ].filter((g) => g.items.length > 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={vi.airportPicker.title}
      data-testid="airport-picker-modal"
    >
      <div className="flex flex-col gap-3 p-4">
        <SegmentedControl
          options={[
            { label: vi.airportPicker.originTab, value: 'origin' },
            { label: vi.airportPicker.destinationTab, value: 'destination' },
          ]}
          value={tab}
          onChange={(v) => setTab(v as 'origin' | 'destination')}
          ariaLabel={vi.airportPicker.title}
          data-testid="origin-destination-tabs"
        />

        <TextField
          placeholder={vi.airportPicker.searchPlaceholder}
          value={query}
          onChange={setQuery}
          ariaLabel={vi.airportPicker.searchLabel}
          data-testid="airport-search-input"
        />

        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <h3 className="text-[10px] font-medium text-[var(--color-text-secondary)] uppercase tracking-wide">
              {group.label}
            </h3>
            {group.items.map((airport) => (
              <Button
                key={airport.code}
                variant="ghost"
                ariaLabel={`${vi.airportPicker.title}: ${airport.city}, ${airport.name}`}
                data-testid="airport-item-button"
                onClick={() => onSelect(airport, tab)}
                fullWidth
                className="justify-start text-left"
              >
                <span className="font-semibold mr-2">{airport.code}</span>
                <span className="text-[var(--color-text-secondary)]">
                  {airport.city} — {airport.name}
                </span>
              </Button>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
};
