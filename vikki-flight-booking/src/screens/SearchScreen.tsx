import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { SegmentedControl } from '../components/SegmentedControl';
import { AlertNote } from '../components/AlertNote';
import { InlineError } from '../components/InlineError';
import { AirportPickerModal } from '../modals/AirportPickerModal';
import { DatePickerModal } from '../modals/DatePickerModal';
import { PassengerCountModal } from '../modals/PassengerCountModal';
import { t } from '../i18n';
import { formatDateVi } from '../utils/date';
import { fixtureSearch } from '../fixtures/flights';
import type { AppState, AppAction, ScreenId, TripType, Airport } from '../types/state';

interface SearchScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
  hostRuntime?: { id?: { name?: string }; theme?: string; locale?: string };
}

type Modal = 'airport-origin' | 'airport-destination' | 'date' | 'passenger-count' | null;

export function SearchScreen({ state, dispatch, navigate }: SearchScreenProps): React.ReactElement {
  const [modal, setModal] = useState<Modal>(null);

  // Load recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<Array<{
    id: string; origin: string; destination: string;
    originCity: string; destinationCity: string;
    departureDate: string; returnDate?: string; tripType: TripType;
  }>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vikki-flight-recent-searches');
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch { /* localStorage unavailable */ }
  }, []);

  const saveRecentSearch = useCallback(() => {
    if (!state.origin || !state.destination) return;
    try {
      const item = {
        id: `${Date.now()}`,
        origin: state.origin.code,
        destination: state.destination.code,
        originCity: state.origin.city,
        destinationCity: state.destination.city,
        departureDate: state.departureDate,
        returnDate: state.tripType === 'round-trip' ? state.returnDate : undefined,
        tripType: state.tripType,
      };
      const existing: typeof recentSearches = JSON.parse(
        localStorage.getItem('vikki-flight-recent-searches') ?? '[]'
      );
      // Deduplicate by route+dates
      const deduped = existing.filter(
        s => !(s.origin === item.origin && s.destination === item.destination &&
          s.departureDate === item.departureDate && s.returnDate === item.returnDate)
      );
      const updated = [item, ...deduped].slice(0, 4);
      localStorage.setItem('vikki-flight-recent-searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch { /* localStorage unavailable */ }
  }, [state.origin, state.destination, state.departureDate, state.returnDate, state.tripType]);

  const deleteRecentSearch = useCallback((id: string) => {
    try {
      const updated = recentSearches.filter(s => s.id !== id);
      localStorage.setItem('vikki-flight-recent-searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch { /* localStorage unavailable */ }
  }, [recentSearches]);

  // Route validation
  const isRouteValid = useCallback((): boolean => {
    if (!state.origin || !state.destination) return false;
    if (!state.masterDataLoaded) return false;
    return state.cityPairs.some(
      p => p.origin === state.origin!.code && p.destination === state.destination!.code
    );
  }, [state.origin, state.destination, state.cityPairs, state.masterDataLoaded]);

  const showInvalidRoute = !!(state.origin && state.destination && state.masterDataLoaded && !isRouteValid());

  const canSearch = state.masterDataLoaded && isRouteValid() && !state.isSearching;

  const handleSearch = useCallback(async () => {
    if (!canSearch || !state.origin || !state.destination) return;
    dispatch({ type: 'SET_SEARCHING', value: true });
    try {
      const result = await fixtureSearch({
        tripType: state.tripType,
        origin: state.origin.code,
        destination: state.destination.code,
        departureDate: state.departureDate,
        returnDate: state.tripType === 'round-trip' ? state.returnDate : undefined,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
      });
      dispatch({
        type: 'SET_SESSION',
        sessionId: result.sessionId,
        expiresAt: result.expiresAt,
        outboundOffers: result.offers,
      });
      saveRecentSearch();
      navigate('results');
    } catch {
      dispatch({ type: 'SET_SEARCH_ERROR', error: t('search.error') });
    }
  }, [canSearch, state, dispatch, navigate, saveRecentSearch]);

  const passengerLabel = (() => {
    const { adults, children, infants } = state;
    if (infants > 0) return t('search.passengerSummaryFull', { adults, children, infants });
    if (children > 0) return t('search.passengerSummaryWithChild', { adults, children });
    return t('search.passengerSummary', { adults });
  })();

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="title-1" semantic="h1">{t('search.title')}</Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SegmentedControl
          options={[
            { label: t('search.tripType.roundTrip'), value: 'round-trip' },
            { label: t('search.tripType.oneWay'), value: 'one-way' },
          ]}
          value={state.tripType}
          onChange={v => dispatch({ type: 'SET_TRIP_TYPE', tripType: v as TripType })}
          ariaLabel={t('search.tripType.roundTrip')}
          data-testid="trip-type-toggle"
        />

        <Button
          variant="secondary"
          onClick={() => setModal('airport-origin')}
          ariaLabel={t('search.origin.placeholder')}
          data-testid="origin-airport-button"
          fullWidth
        >
          {state.origin
            ? `${t('search.origin.label')}: ${state.origin.code} — ${state.origin.city}`
            : t('search.origin.placeholder')
          }
        </Button>

        <Button
          variant="ghost"
          onClick={() => dispatch({ type: 'SWAP_AIRPORTS' })}
          ariaLabel={t('search.swapAirports.ariaLabel')}
          data-testid="swap-airports-button"
          style={{ alignSelf: 'center', fontSize: '20px' }}
        >
          ⇄
        </Button>

        <Button
          variant="secondary"
          onClick={() => setModal('airport-destination')}
          ariaLabel={t('search.destination.placeholder')}
          data-testid="destination-airport-button"
          fullWidth
        >
          {state.destination
            ? `${t('search.destination.label')}: ${state.destination.code} — ${state.destination.city}`
            : t('search.destination.placeholder')
          }
        </Button>

        <InlineError
          visible={showInvalidRoute}
          data-testid="invalid-route-error"
        >
          {t('search.invalidRoute')}
        </InlineError>

        <Button
          variant="secondary"
          onClick={() => setModal('passenger-count')}
          ariaLabel={t('search.passengers.label')}
          data-testid="passenger-count-button"
          fullWidth
        >
          {`${t('search.passengers.label')}: ${passengerLabel}`}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setModal('date')}
          ariaLabel={t('search.departureDate.label')}
          data-testid="departure-date-button"
          fullWidth
        >
          {`${t('search.departureDate.label')}: ${formatDateVi(state.departureDate)}`}
        </Button>

        {state.tripType === 'round-trip' && (
          <Button
            variant="secondary"
            onClick={() => setModal('date')}
            ariaLabel={t('search.returnDate.label')}
            data-testid="return-date-button"
            fullWidth
          >
            {`${t('search.returnDate.label')}: ${formatDateVi(state.returnDate)}`}
          </Button>
        )}

        <Button
          variant="primary"
          onClick={handleSearch}
          disabled={!canSearch}
          ariaLabel={t('search.searchButton.ariaLabel')}
          data-testid="search-button"
          fullWidth
        >
          {state.isSearching ? t('search.loading') : t('search.searchButton')}
        </Button>
      </div>

      {state.masterDataError && (
        <AlertNote tone="critical" visible data-testid="master-data-error" role="alert">
          {t('search.masterDataError')}
        </AlertNote>
      )}

      {state.searchError && (
        <AlertNote tone="critical" visible data-testid="search-error" role="alert">
          {state.searchError}
        </AlertNote>
      )}

      {recentSearches.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <Text variant="headline" semantic="h2" data-testid="recent-searches-header">
            {t('search.recentSearches.title')}
          </Text>
          {recentSearches.map(s => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '12px',
                borderRadius: 'var(--radius-8)',
                background: 'var(--gray-50)',
                border: '1px solid var(--gray-200)',
                position: 'relative',
              }}
            >
              <Text variant="body-semibold" data-testid="recent-search-route">
                {s.originCity} ({s.origin}) {s.tripType === 'round-trip' ? '\u21c4' : '\u2192'} {s.destinationCity} ({s.destination})
              </Text>
              <Text variant="footnote" data-testid="recent-search-dates">
                {formatDateVi(s.departureDate)}{s.returnDate ? ` — ${formatDateVi(s.returnDate)}` : ''}
              </Text>
              <button
                type="button"
                onClick={() => deleteRecentSearch(s.id)}
                aria-label={t('search.recentSearch.delete.ariaLabel')}
                data-testid="recent-search-delete-button"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  fontSize: '16px',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {modal === 'airport-origin' && (
        <AirportPickerModal
          airports={state.airports}
          initialTab="origin"
          selectedOrigin={state.origin}
          selectedDestination={state.destination}
          onSelect={(airport: Airport, tab: 'origin' | 'destination') => {
            if (tab === 'origin') dispatch({ type: 'SET_ORIGIN', airport });
            else dispatch({ type: 'SET_DESTINATION', airport });
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'airport-destination' && (
        <AirportPickerModal
          airports={state.airports}
          initialTab="destination"
          selectedOrigin={state.origin}
          selectedDestination={state.destination}
          onSelect={(airport: Airport, tab: 'origin' | 'destination') => {
            if (tab === 'origin') dispatch({ type: 'SET_ORIGIN', airport });
            else dispatch({ type: 'SET_DESTINATION', airport });
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'date' && (
        <DatePickerModal
          tripType={state.tripType}
          departureDate={state.departureDate}
          returnDate={state.returnDate}
          onConfirm={(dep, ret) => {
            dispatch({ type: 'SET_DEPARTURE_DATE', date: dep });
            if (ret) dispatch({ type: 'SET_RETURN_DATE', date: ret });
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'passenger-count' && (
        <PassengerCountModal
          adults={state.adults}
          children={state.children}
          infants={state.infants}
          onConfirm={(adults, children, infants) => {
            dispatch({ type: 'SET_PASSENGERS_COUNT', adults, children, infants });
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
