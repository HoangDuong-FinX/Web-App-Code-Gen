import React, { useState, useMemo } from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import IconButton from '../components/IconButton';

export default function AirportPicker(props: ScreenProps) {
  const { airports, cityPairs, airportPickerMode, navigate, setBooking, booking } = props;
  const [query, setQuery] = useState('');

  const title = airportPickerMode === 'origin' ? t('airport.title.origin') : t('airport.title.destination');

  const filteredAirports = useMemo(() => {
    let list = airports;
    if (airportPickerMode === 'destination' && booking.searchParams?.origin) {
      const validDests = cityPairs.filter(p => p.origin === booking.searchParams!.origin).map(p => p.destination);
      if (validDests.length > 0) {
        list = airports.filter(a => validDests.includes(a.code));
      }
    }
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(a => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q));
  }, [airports, query, airportPickerMode, cityPairs, booking.searchParams]);

  const handleSelect = (code: string) => {
    navigate('search-home');
  };

  return (
    <div className="overlay" aria-label={t('airport.overlay.aria')}>
      <div className="overlay-content">
        <div className="header-row">
          <Text variant="title-2" as="h2">{title}</Text>
          <IconButton icon="close" onClick={() => navigate('search-home')} ariaLabel={t('common.back.aria')} />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('airport.search.placeholder')}
          aria-label={t('airport.search.aria')}
          style={{ padding: '10px 14px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, width: '100%' }}
        />
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredAirports.map(a => (
            <button
              key={a.code}
              type="button"
              onClick={() => handleSelect(a.code)}
              aria-label={`${a.name} (${a.code})`}
              style={{ padding: '12px 0', borderBottom: '1px solid var(--line-normal)', textAlign: 'left', fontSize: 14 }}
            >
              <span style={{ fontWeight: 600 }}>{a.code}</span> - {a.name}, {a.city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
