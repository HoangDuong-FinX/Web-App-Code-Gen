import { useState, useMemo } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId, Airport } from '../types';
import type { NavigationState, AirportPickerMode } from '../App';

interface AirportPickerScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
  mode: AirportPickerMode;
}

function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function AirportPickerScreen({ navigate, mode }: AirportPickerScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return state.airports;
    const q = removeDiacritics(query.trim());
    return state.airports.map((group) => ({ ...group, airports: group.airports.filter((a) => removeDiacritics(a.airportCode).includes(q) || removeDiacritics(a.airportName).includes(q) || removeDiacritics(a.cityName).includes(q)) })).filter((g) => g.airports.length > 0);
  }, [query, state.airports]);

  function selectAirport(airport: Airport) {
    if (mode === 'departure') { dispatch({ type: 'SET_ORIGIN', payload: airport }); } else { dispatch({ type: 'SET_DESTINATION', payload: airport }); }
    navigate('search');
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col" aria-label={t.airportPicker.heading}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">{t.airportPicker.heading}</h1>
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-xl" onClick={() => navigate('search')} aria-label={t.airportPicker.close} data-testid="close-airport-picker">{String.fromCharCode(10005)}</button>
      </div>
      <div className="p-4">
        <input type="search" className="w-full border border-gray-300 rounded-lg p-3 text-sm" placeholder={t.airportPicker.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} aria-label={t.airportPicker.searchPlaceholder} data-testid="airport-search-input" />
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredGroups.map((group) => (
          <div key={group.groupName} className="mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2" data-testid="airport-group-header">{group.groupName}</h2>
            {group.airports.map((airport) => (
              <button key={airport.airportCode} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left" onClick={() => selectAirport(airport)} aria-label={`${airport.airportCode} - ${airport.airportName}, ${airport.cityName}`}>
                <span className="font-bold text-red-600 text-sm w-10" data-testid="airport-code">{airport.airportCode}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900" data-testid="airport-name">{airport.airportName}</p>
                  <p className="text-xs text-gray-500" data-testid="city-name">{airport.cityName}</p>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
