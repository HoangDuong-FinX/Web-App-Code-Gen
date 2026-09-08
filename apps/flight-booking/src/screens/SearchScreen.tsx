import React, { useState, useEffect, useCallback } from 'react';
import type { BookingState, Airport, CityPair, RecentSearch, ScreenId } from '../types';
import type { BookingAction } from '../App';
import { t } from '../i18n/vi';
import { loadAirportsFixture } from '../fixtures/airports';
import { loadCityPairsFixture } from '../fixtures/cityPairs';
import { searchFlightsFixture } from '../fixtures/flights';
import { AirportPickerModal } from '../modals/AirportPickerModal';
import { DatePickerModal } from '../modals/DatePickerModal';
import { PassengerCountModal } from '../modals/PassengerCountModal';

const RECENT_SEARCHES_KEY = 'vikki:flight-booking-1:recent-searches';

interface SearchScreenProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  onNavigate: (screen: ScreenId) => void;
}

export function SearchScreen({ state, dispatch, onNavigate }: SearchScreenProps) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [masterDataError, setMasterDataError] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showAirportPicker, setShowAirportPicker] = useState<'origin' | 'destination' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassengerCount, setShowPassengerCount] = useState(false);

  const loadMasterData = useCallback(async () => {
    setLoading(true);
    setMasterDataError(false);
    try {
      const [airportsData, cityPairsData] = await Promise.all([
        loadAirportsFixture(),
        loadCityPairsFixture(),
      ]);
      setAirports(airportsData);
      setCityPairs(cityPairsData);
    } catch {
      setMasterDataError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMasterData();
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentSearch[];
        setRecentSearches(parsed.slice(0, 4));
      }
    } catch {
      setRecentSearches([]);
    }
  }, [loadMasterData]);

  const getDefaultDepartureDate = (): string => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  };

  const effectiveDepartureDate = state.departureDate || getDefaultDepartureDate();

  const filteredDestinations = useCallback(
    (originCode: string): Airport[] => {
      const validDests = cityPairs
        .filter((cp) => cp.origin_code === originCode)
        .map((cp) => cp.destination_code);
      return airports.filter((a) => validDests.includes(a.code));
    },
    [airports, cityPairs]
  );

  const handleSwapAirports = () => {
    if (!state.origin || !state.destination) return;
    const oldOrigin = state.origin;
    const oldDest = state.destination;
    dispatch({ type: 'SET_ORIGIN', payload: oldDest });
    dispatch({ type: 'SET_DESTINATION', payload: oldOrigin });
  };

  const handleSelectAirport = (airport: Airport) => {
    if (showAirportPicker === 'origin') {
      dispatch({ type: 'SET_ORIGIN', payload: airport });
      if (state.destination && state.destination.code === airport.code) {
        dispatch({ type: 'SET_DESTINATION', payload: null });
      }
    } else {
      dispatch({ type: 'SET_DESTINATION', payload: airport });
    }
    setShowAirportPicker(null);
  };

  const handleDateConfirm = (departure: string, returnDate: string) => {
    dispatch({ type: 'SET_DEPARTURE_DATE', payload: departure });
    if (state.tripType === 'round-trip') {
      dispatch({ type: 'SET_RETURN_DATE', payload: returnDate });
    }
    setShowDatePicker(false);
  };

  const handlePassengerConfirm = (adults: number, children: number, infants: number) => {
    dispatch({ type: 'SET_PASSENGERS', payload: { adults, children, infants } });
    setShowPassengerCount(false);
  };

  const handleRecentSearchTap = (rs: RecentSearch) => {
    const originAirport = airports.find((a) => a.code === rs.origin) ?? null;
    const destAirport = airports.find((a) => a.code === rs.destination) ?? null;
    dispatch({ type: 'SET_TRIP_TYPE', payload: rs.tripType });
    dispatch({ type: 'SET_ORIGIN', payload: originAirport });
    dispatch({ type: 'SET_DESTINATION', payload: destAirport });
    dispatch({ type: 'SET_DEPARTURE_DATE', payload: rs.departure_date });
    if (rs.tripType === 'round-trip') {
      dispatch({ type: 'SET_RETURN_DATE', payload: rs.return_date });
    }
    dispatch({ type: 'SET_PASSENGERS', payload: { adults: rs.adults, children: rs.children, infants: rs.infants } });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      /* silent */
    }
  };

  const canSearch = !loading && !masterDataError && !!state.origin && !!state.destination;

  const handleSearch = async () => {
    if (!canSearch || !state.origin || !state.destination) return;
    setSearching(true);
    setSearchError(false);
    try {
      const outboundSession = await searchFlightsFixture(
        state.origin.code,
        state.destination.code,
        effectiveDepartureDate
      );
      dispatch({ type: 'SET_OUTBOUND_SESSION', payload: outboundSession });

      if (state.tripType === 'round-trip' && state.returnDate) {
        const returnSession = await searchFlightsFixture(
          state.destination.code,
          state.origin.code,
          state.returnDate
        );
        dispatch({ type: 'SET_RETURN_SESSION', payload: returnSession });
      }

      const newRecent: RecentSearch = {
        origin: state.origin.code,
        destination: state.destination.code,
        departure_date: effectiveDepartureDate,
        return_date: state.returnDate,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
        tripType: state.tripType,
      };
      try {
        const existing = recentSearches.filter(
          (rs) => !(rs.origin === newRecent.origin && rs.destination === newRecent.destination && rs.departure_date === newRecent.departure_date)
        );
        const updated = [newRecent, ...existing].slice(0, 4);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        setRecentSearches(updated);
      } catch {
        /* silent */
      }

      onNavigate('results');
    } catch {
      setSearchError(true);
    } finally {
      setSearching(false);
    }
  };

  const passengerLabel = (() => {
    const parts: string[] = [];
    if (state.adults > 0) parts.push(`${state.adults} ${t('passengers.adult')}`);
    if (state.children > 0) parts.push(`${state.children} ${t('passengers.child')}`);
    if (state.infants > 0) parts.push(`${state.infants} ${t('passengers.infant')}`);
    return parts.join(', ') || t('search.passengersPlaceholder');
  })();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('search.title')}</h1>

      {loading && (
        <div className="flex items-center justify-center py-4" aria-label={t('search.loadingAirports')}>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
        </div>
      )}

      {masterDataError && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700" aria-label={t('search.masterDataError')}>
          <p>{t('search.masterDataError')}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-red-700 underline"
            onClick={loadMasterData}
            aria-label={t('search.retry')}
          >
            {t('search.retry')}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex rounded-lg bg-gray-100 p-1" aria-label={t('search.tripTypeLabel')}>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              state.tripType === 'one-way' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => dispatch({ type: 'SET_TRIP_TYPE', payload: 'one-way' })}
            aria-label={t('search.tripOneWay')}
          >
            {t('search.tripOneWay')}
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              state.tripType === 'round-trip' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => dispatch({ type: 'SET_TRIP_TYPE', payload: 'round-trip' })}
            aria-label={t('search.tripRoundTrip')}
          >
            {t('search.tripRoundTrip')}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="flex flex-col rounded-lg border border-gray-300 p-3 text-left"
          onClick={() => setShowAirportPicker('origin')}
          aria-label={t('search.originPlaceholder')}
          data-testid="origin-selector"
        >
          <span className="text-xs text-gray-500">{t('search.origin')}</span>
          <span className="text-sm text-gray-900">
            {state.origin ? `${state.origin.code} - ${state.origin.name}` : t('search.originPlaceholder')}
          </span>
        </button>

        <button
          type="button"
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
          onClick={handleSwapAirports}
          aria-label={t('search.swapAirports')}
          data-testid="swap-airports-action"
        >
          ⇅
        </button>

        <button
          type="button"
          className="flex flex-col rounded-lg border border-gray-300 p-3 text-left"
          onClick={() => setShowAirportPicker('destination')}
          aria-label={t('search.destinationPlaceholder')}
          data-testid="destination-selector"
        >
          <span className="text-xs text-gray-500">{t('search.destination')}</span>
          <span className="text-sm text-gray-900">
            {state.destination ? `${state.destination.code} - ${state.destination.name}` : t('search.destinationPlaceholder')}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="flex flex-col rounded-lg border border-gray-300 p-3 text-left"
          onClick={() => setShowDatePicker(true)}
          aria-label={t('search.departureDatePlaceholder')}
          data-testid="departure-date-selector"
        >
          <span className="text-xs text-gray-500">{t('search.departureDate')}</span>
          <span className="text-sm text-gray-900">{effectiveDepartureDate}</span>
        </button>

        {state.tripType === 'round-trip' && (
          <button
            type="button"
            className="flex flex-col rounded-lg border border-gray-300 p-3 text-left"
            onClick={() => setShowDatePicker(true)}
            aria-label={t('search.returnDatePlaceholder')}
            data-testid="return-date-selector"
          >
            <span className="text-xs text-gray-500">{t('search.returnDate')}</span>
            <span className="text-sm text-gray-900">{state.returnDate || t('search.returnDatePlaceholder')}</span>
          </button>
        )}
      </div>

      <button
        type="button"
        className="flex flex-col rounded-lg border border-gray-300 p-3 text-left"
        onClick={() => setShowPassengerCount(true)}
        aria-label={t('search.passengersLabel')}
        data-testid="passenger-count-selector"
      >
        <span className="text-xs text-gray-500">{t('search.passengers')}</span>
        <span className="text-sm text-gray-900">{passengerLabel}</span>
      </button>

      {recentSearches.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('search.recentSearches')}</h2>
            <button
              type="button"
              className="text-sm text-red-500"
              onClick={handleClearRecentSearches}
              aria-label={t('search.clearAllLabel')}
              data-testid="clear-all-action"
            >
              {t('search.clearAll')}
            </button>
          </div>
          {recentSearches.map((rs, idx) => (
            <button
              key={`${rs.origin}-${rs.destination}-${rs.departure_date}-${idx}`}
              type="button"
              className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-left text-sm hover:bg-gray-100"
              onClick={() => handleRecentSearchTap(rs)}
              aria-label={`${rs.origin} → ${rs.destination}`}
            >
              <span className="font-medium text-gray-900" data-testid="recent-route-label">
                {rs.origin} → {rs.destination}
              </span>
              <span className="text-gray-500" data-testid="recent-date-label">{rs.departure_date}</span>
              <span className="text-gray-500" data-testid="recent-passenger-label">{rs.adults + rs.children + rs.infants}</span>
            </button>
          ))}
        </div>
      )}

      {searchError && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700" aria-label={t('search.searchErrorLabel')}>
          <p>{t('search.searchError')}</p>
        </div>
      )}

      <button
        type="button"
        className={`w-full rounded-lg py-3 text-center font-medium text-white transition-colors ${
          canSearch && !searching ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300'
        }`}
        disabled={!canSearch || searching}
        onClick={handleSearch}
        aria-label={t('search.submit')}
        data-testid="search-submit-action"
      >
        {searching ? t('search.loadingAirports') : t('search.submit')}
      </button>

      {showAirportPicker !== null && (
        <AirportPickerModal
          airports={
            showAirportPicker === 'destination' && state.origin
              ? filteredDestinations(state.origin.code)
              : airports
          }
          onSelect={handleSelectAirport}
          onClose={() => setShowAirportPicker(null)}
        />
      )}

      {showDatePicker && (
        <DatePickerModal
          departureDate={effectiveDepartureDate}
          returnDate={state.returnDate}
          isRoundTrip={state.tripType === 'round-trip'}
          onConfirm={handleDateConfirm}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {showPassengerCount && (
        <PassengerCountModal
          adults={state.adults}
          childCount={state.children}
          infants={state.infants}
          onConfirm={handlePassengerConfirm}
          onClose={() => setShowPassengerCount(false)}
        />
      )}
    </div>
  );
}