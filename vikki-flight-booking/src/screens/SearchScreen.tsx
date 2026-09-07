import React, { useEffect, useState, useCallback } from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction, Airport, CityPair, RecentSearch } from '../types';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { AlertNote } from '../components/ui/AlertNote';
import { InlineError } from '../components/ui/InlineError';
import { AirportPickerModal } from '../components/modals/AirportPickerModal';
import { DatePickerModal } from '../components/modals/DatePickerModal';
import { PassengerCountModal } from '../components/modals/PassengerCountModal';
import {
  fixtureLoadAirports,
  fixtureLoadCityPairs,
  fixtureSearch,
} from '../fixtures';
import { formatDate } from '../utils/format';

const RECENT_SEARCHES_KEY = 'vikki_recent_searches';

function loadRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentSearch[];
  } catch {
    return [];
  }
}

function saveRecentSearch(search: RecentSearch): void {
  try {
    const existing = loadRecentSearches();
    const deduped = existing.filter(
      (s) =>
        !(s.origin.code === search.origin.code &&
          s.destination.code === search.destination.code &&
          s.departureDate === search.departureDate &&
          s.returnDate === search.returnDate),
    );
    const updated = [search, ...deduped].slice(0, 4);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently skip
  }
}

function deleteRecentSearch(id: string): void {
  try {
    const existing = loadRecentSearches();
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(existing.filter((s) => s.id !== id)),
    );
  } catch {
    // silently skip
  }
}

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const SearchScreen: React.FC<Props> = ({ state, dispatch }) => {
  const { searchCriteria } = state;
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cityPairs, setCityPairs] = useState<CityPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [masterDataLoading, setMasterDataLoading] = useState(true);
  const [showAirportPicker, setShowAirportPicker] = useState(false);
  const [airportPickerMode, setAirportPickerMode] = useState<'origin' | 'destination'>('origin');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'departure' | 'return'>('departure');
  const [showPassengerCount, setShowPassengerCount] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load master data on mount
  useEffect(() => {
    setMasterDataLoading(true);
    dispatch({ type: 'SET_MASTER_DATA_ERROR', error: null });
    Promise.all([fixtureLoadAirports(), fixtureLoadCityPairs()])
      .then(([ap, cp]) => {
        setAirports(ap);
        setCityPairs(cp);
      })
      .catch(() => {
        dispatch({ type: 'SET_MASTER_DATA_ERROR', error: vi.search.masterDataError });
      })
      .finally(() => setMasterDataLoading(false));
  }, [dispatch]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(loadRecentSearches());
  }, []);

  const isRouteValid = useCallback(
    (origin: string | null, destination: string | null): boolean => {
      if (!origin || !destination) return false;
      return cityPairs.some((cp) => cp.origin === origin && cp.destination === destination);
    },
    [cityPairs],
  );

  const routeValid =
    searchCriteria.origin && searchCriteria.destination
      ? isRouteValid(searchCriteria.origin.code, searchCriteria.destination.code)
      : false;

  const routeInvalid =
    searchCriteria.origin !== null &&
    searchCriteria.destination !== null &&
    !routeValid &&
    cityPairs.length > 0;

  const canSearch =
    !masterDataLoading &&
    !loading &&
    routeValid &&
    searchCriteria.origin !== null &&
    searchCriteria.destination !== null &&
    !state.masterDataError;

  const handleSwap = () => {
    const { origin, destination, departureDate, returnDate } = searchCriteria;
    let newReturnDate = returnDate;
    if (
      searchCriteria.tripType === 'round-trip' &&
      returnDate &&
      returnDate < departureDate
    ) {
      const dep = new Date(departureDate + 'T00:00:00');
      dep.setDate(dep.getDate() + 4);
      newReturnDate = dep.toISOString().slice(0, 10);
    }
    dispatch({
      type: 'SET_SEARCH_CRITERIA',
      criteria: {
        origin: destination,
        destination: origin,
        returnDate: newReturnDate,
      },
    });
  };

  const handleSearch = async () => {
    if (!canSearch || !searchCriteria.origin || !searchCriteria.destination) return;
    setLoading(true);
    dispatch({ type: 'SET_SEARCH_ERROR', error: null });
    try {
      const session = await fixtureSearch(
        searchCriteria.origin.code,
        searchCriteria.destination.code,
        searchCriteria.departureDate,
      );
      dispatch({ type: 'SET_OUTBOUND_SESSION', session });
      // Save recent search
      const recent: RecentSearch = {
        id: `${Date.now()}`,
        origin: searchCriteria.origin,
        destination: searchCriteria.destination,
        departureDate: searchCriteria.departureDate,
        returnDate: searchCriteria.returnDate,
        tripType: searchCriteria.tripType,
        passengers: searchCriteria.passengers,
      };
      saveRecentSearch(recent);
      setRecentSearches(loadRecentSearches());
      dispatch({ type: 'NAVIGATE', screen: 'results' });
    } catch {
      dispatch({ type: 'SET_SEARCH_ERROR', error: vi.search.searchError });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecent = (id: string) => {
    deleteRecentSearch(id);
    setRecentSearches(loadRecentSearches());
  };

  const paxSummary = (() => {
    const { adults, children, infants } = searchCriteria.passengers;
    const parts: string[] = [];
    if (adults > 0) parts.push(`${adults} ${vi.common.adultShort}`);
    if (children > 0) parts.push(`${children} ${vi.common.childShort}`);
    if (infants > 0) parts.push(`${infants} ${vi.common.infantShort}`);
    return parts.join(', ');
  })();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)]">
        {vi.search.title}
      </h1>

      <div className="flex flex-col gap-3">
        <SegmentedControl
          options={[
            { label: vi.search.roundTrip, value: 'round-trip' },
            { label: vi.search.oneWay, value: 'one-way' },
          ]}
          value={searchCriteria.tripType}
          onChange={(v) => dispatch({ type: 'SET_TRIP_TYPE', tripType: v as 'one-way' | 'round-trip' })}
          ariaLabel={vi.search.tripTypeLabel}
          data-testid="trip-type-toggle"
        />

        <Button
          variant="secondary"
          ariaLabel={vi.search.originLabel}
          data-testid="origin-airport-button"
          onClick={() => { setAirportPickerMode('origin'); setShowAirportPicker(true); }}
          fullWidth
        >
          {searchCriteria.origin
            ? `${vi.search.originPrefix}: ${searchCriteria.origin.code} — ${searchCriteria.origin.city}`
            : vi.search.originLabel}
        </Button>

        <Button
          variant="ghost"
          ariaLabel={vi.search.swapLabel}
          data-testid="swap-airports-button"
          onClick={handleSwap}
        >
          ⇄
        </Button>

        <Button
          variant="secondary"
          ariaLabel={vi.search.destinationLabel}
          data-testid="destination-airport-button"
          onClick={() => { setAirportPickerMode('destination'); setShowAirportPicker(true); }}
          fullWidth
        >
          {searchCriteria.destination
            ? `${vi.search.destinationPrefix}: ${searchCriteria.destination.code} — ${searchCriteria.destination.city}`
            : vi.search.destinationLabel}
        </Button>

        <InlineError
          visible={routeInvalid}
          data-testid="invalid-route-error"
        >
          {vi.search.invalidRoute}
        </InlineError>

        <Button
          variant="secondary"
          ariaLabel={vi.search.passengersLabel}
          data-testid="passenger-count-button"
          onClick={() => setShowPassengerCount(true)}
          fullWidth
        >
          {`${vi.search.passengersPrefix}: ${paxSummary}`}
        </Button>

        <Button
          variant="secondary"
          ariaLabel={vi.search.departureDateLabel}
          data-testid="departure-date-button"
          onClick={() => { setDatePickerMode('departure'); setShowDatePicker(true); }}
          fullWidth
        >
          {`${vi.search.departureDatePrefix}: ${formatDate(searchCriteria.departureDate)}`}
        </Button>

        {searchCriteria.tripType === 'round-trip' && (
          <Button
            variant="secondary"
            ariaLabel={vi.search.returnDateLabel}
            data-testid="return-date-button"
            onClick={() => { setDatePickerMode('return'); setShowDatePicker(true); }}
            fullWidth
          >
            {searchCriteria.returnDate
              ? `${vi.search.returnDatePrefix}: ${formatDate(searchCriteria.returnDate)}`
              : vi.search.returnDateLabel}
          </Button>
        )}

        <Button
          variant="primary"
          ariaLabel={vi.search.searchButtonLabel}
          data-testid="search-button"
          onClick={handleSearch}
          disabled={!canSearch || loading}
          fullWidth
        >
          {loading ? vi.common.loading : vi.search.searchButton}
        </Button>
      </div>

      {state.masterDataError && (
        <AlertNote
          visible
          tone="error"
          data-testid="master-data-error"
          action={
            <Button
              variant="ghost"
              onClick={() => {
                dispatch({ type: 'SET_MASTER_DATA_ERROR', error: null });
                setMasterDataLoading(true);
                Promise.all([fixtureLoadAirports(), fixtureLoadCityPairs()])
                  .then(([ap, cp]) => { setAirports(ap); setCityPairs(cp); })
                  .catch(() => dispatch({ type: 'SET_MASTER_DATA_ERROR', error: vi.search.masterDataError }))
                  .finally(() => setMasterDataLoading(false));
              }}
            >
              {vi.search.retry}
            </Button>
          }
        >
          {state.masterDataError}
        </AlertNote>
      )}

      {state.searchError && (
        <AlertNote
          visible
          tone="error"
          data-testid="search-error"
          action={
            <Button variant="ghost" onClick={() => dispatch({ type: 'SET_SEARCH_ERROR', error: null })}>
              {vi.search.retry}
            </Button>
          }
        >
          {state.searchError}
        </AlertNote>
      )}

      {recentSearches.length > 0 && (
        <div className="flex flex-col gap-3 mt-6">
          <h2 className="text-[var(--text-headline)] text-[var(--color-text-primary)]" data-testid="recent-searches-header">
            {vi.search.recentSearches}
          </h2>
          {recentSearches.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-1 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]" data-testid="recent-search-route">
                    {s.origin.city} ({s.origin.code}) ⇄ {s.destination.city} ({s.destination.code})
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]" data-testid="recent-search-dates">
                    {s.departureDate}{s.returnDate ? ` — ${s.returnDate}` : ''}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  ariaLabel={vi.search.deleteSearch}
                  data-testid="recent-search-delete-button"
                  onClick={() => handleDeleteRecent(s.id)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AirportPickerModal
        open={showAirportPicker}
        onClose={() => setShowAirportPicker(false)}
        mode={airportPickerMode}
        airports={airports}
        onSelect={(airport, mode) => {
          if (mode === 'origin') {
            dispatch({ type: 'SET_SEARCH_CRITERIA', criteria: { origin: airport } });
          } else {
            dispatch({ type: 'SET_SEARCH_CRITERIA', criteria: { destination: airport } });
          }
          setShowAirportPicker(false);
        }}
      />

      <DatePickerModal
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        mode={datePickerMode}
        departureDate={searchCriteria.departureDate}
        returnDate={searchCriteria.returnDate}
        tripType={searchCriteria.tripType}
        onConfirm={(dep, ret) => {
          let newReturn = ret;
          if (searchCriteria.tripType === 'round-trip' && ret && ret < dep) {
            const d = new Date(dep + 'T00:00:00');
            d.setDate(d.getDate() + 4);
            newReturn = d.toISOString().slice(0, 10);
          }
          dispatch({
            type: 'SET_SEARCH_CRITERIA',
            criteria: { departureDate: dep, returnDate: newReturn },
          });
          setShowDatePicker(false);
        }}
      />

      <PassengerCountModal
        open={showPassengerCount}
        onClose={() => setShowPassengerCount(false)}
        passengers={searchCriteria.passengers}
        onConfirm={(pax) => {
          dispatch({ type: 'SET_SEARCH_CRITERIA', criteria: { passengers: pax } });
          setShowPassengerCount(false);
        }}
      />
    </div>
  );
};
