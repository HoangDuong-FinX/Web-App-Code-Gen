import { useState, useEffect, useMemo } from 'react';
import type { Airport, CityPair } from '../types';
import { t } from '../i18n';
import { loadAirports, loadCityPairs } from '../sdk';

interface Props {
  context: 'origin' | 'destination';
  currentOrigin: Airport | null;
  currentDestination: Airport | null;
  onSelect: (airport: Airport) => void;
  onClose: () => void;
}

export function AirportPickerModal({ context, currentOrigin, currentDestination, onSelect, onClose }: Props) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      const [aRes, cpRes] = await Promise.all([loadAirports(), loadCityPairs()]);
      if (aRes.isSuccess && aRes.data) setAirports(aRes.data);
      if (cpRes.isSuccess && cpRes.data) setCityPairs(cpRes.data);
    })();
  }, []);

  const pairedAirport = context === 'origin' ? currentDestination : currentOrigin;

  const filteredAirports = useMemo(() => {
    const q = query.toLowerCase();
    return airports.filter(
      (a) => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.cityName.toLowerCase().includes(q),
    );
  }, [airports, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, Airport[]> = {};
    for (const a of filteredAirports) {
      const key = a.countryCode;
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }
    return Object.entries(groups);
  }, [filteredAirports]);

  const hasRoute = (airport: Airport): boolean => {
    if (!pairedAirport) return true;
    if (context === 'origin') {
      return cityPairs.some((p) => p.origin === airport.code && p.destination === pairedAirport.code);
    }
    return cityPairs.some((p) => p.origin === pairedAirport.code && p.destination === airport.code);
  };

  const title = context === 'origin' ? t('airportPicker.origin.title') : t('airportPicker.destination.title');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-[#F9FBF9] w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-medium text-[#191919]">{title}</h2>
          <button type="button" aria-label={t('airportPicker.close.aria')} data-testid="close-action" className="w-8 h-8 flex items-center justify-center text-xl" onClick={onClose}>
            \u2715
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <input
            type="search"
            data-testid="search-input"
            aria-label={t('airportPicker.search.aria')}
            placeholder={t('airportPicker.search.placeholder')}
            className="w-full border border-[#E6E8E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E12127]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {grouped.map(([countryCode, items]) => (
            <div key={countryCode}>
              <h3 className="text-xs font-semibold text-[#999999] uppercase px-4 py-2">{countryCode}</h3>
              {items.map((airport) => {
                const noRoute = !hasRoute(airport);
                return (
                  <button
                    key={airport.code}
                    type="button"
                    data-testid="airport-item"
                    aria-label={`${airport.name} (${airport.code})`}
                    disabled={noRoute}
                    className={`w-full text-left px-4 py-3 flex items-center gap-2 ${noRoute ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}`}
                    onClick={() => !noRoute && onSelect(airport)}
                  >
                    <span className={`text-base font-medium ${noRoute ? 'text-[#999999]' : 'text-[#191919]'}`}>{airport.name}</span>
                    <span className="text-sm text-[#555555]">{airport.code}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
