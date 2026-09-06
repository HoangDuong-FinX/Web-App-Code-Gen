import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import { fixtureSearch } from '../fixtures';
import { Airport, CityPair, SearchCriteria } from '../types';

interface SearchProps {
  airports: Airport[];
  cityPairs: CityPair[];
  masterDataError: string | null;
  masterDataLoading: boolean;
}

const Search: React.FC<SearchProps> = ({
  airports,
  cityPairs,
  masterDataError,
  masterDataLoading,
}) => {
  const { navigateTo, updateBooking, booking } = useStore();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [origin, setOrigin] = useState('SGN');
  const [destination, setDestination] = useState('DLI');
  const [departureDate, setDepartureDate] = useState('2026-08-20');
  const [returnDate, setReturnDate] = useState('2026-08-25');
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(1);
  const [infantCount, setInfantCount] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const isValidRoute = cityPairs.some(
    (pair) => pair.origin === origin && pair.destination === destination
  );

  const handleSearch = async () => {
    if (!isValidRoute) {
      setSearchError(t('search.invalidRoute'));
      return;
    }

    setSearching(true);
    try {
      const criteria: SearchCriteria = {
        trip_type: tripType,
        origin,
        destination,
        departure_date: departureDate,
        return_date: tripType === 'round-trip' ? returnDate : undefined,
        adult_count: adultCount,
        child_count: childCount,
        infant_count: infantCount,
      };

      const session = await fixtureSearch(criteria);
      updateBooking({
        searchCriteria: criteria,
        outboundSession: session,
        passengers: Array(adultCount + childCount + infantCount)
          .fill(null)
          .map(() => ({
            last_name: '',
            first_name: '',
            gender: 'M',
            date_of_birth: null,
            phone: null,
            email: null,
          })),
      });
      navigateTo('results');
    } catch (error) {
      setSearchError(t('search.error'));
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('search.title')}</h1>

      {masterDataError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">
          {masterDataError}
        </div>
      )}

      {searchError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">
          {searchError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('search.tripType')}</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="round-trip"
                checked={tripType === 'round-trip'}
                onChange={(e) => setTripType(e.target.value as 'one-way' | 'round-trip')}
              />
              {' '}
              {t('search.roundTrip')}
            </label>
            <label>
              <input
                type="radio"
                value="one-way"
                checked={tripType === 'one-way'}
                onChange={(e) => setTripType(e.target.value as 'one-way' | 'round-trip')}
              />
              {' '}
              {t('search.oneWay')}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('search.origin')}</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} — {a.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('search.destination')}</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {airports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.code} — {a.city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('search.departureDate')}</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {tripType === 'round-trip' && (
          <div>
            <label className="block text-sm font-medium mb-2">{t('search.returnDate')}</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Adults</label>
            <input
              type="number"
              min="1"
              max="4"
              value={adultCount}
              onChange={(e) => setAdultCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Children</label>
            <input
              type="number"
              min="0"
              max="4"
              value={childCount}
              onChange={(e) => setChildCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Infants</label>
            <input
              type="number"
              min="0"
              max={adultCount}
              value={infantCount}
              onChange={(e) => setInfantCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={searching || !isValidRoute || masterDataLoading}
          className="w-full p-3 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
          aria-label={t('search.searchButton')}
        >
          {searching ? 'Searching...' : t('search.searchButton')}
        </button>
      </div>
    </div>
  );
};

export default Search;
