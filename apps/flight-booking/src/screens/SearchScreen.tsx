import React, { useEffect, useState, useCallback } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState, AirportPickerMode } from '../App';
import { sdk } from '../sdk';
import type { AirportGroup, CityPair, SearchSession } from '../types';
import { formatPrice } from '../utils';

interface SearchScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

export function SearchScreen({ navigate }: SearchScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.masterDataLoaded) {
      loadMasterData();
    }
  }, []);

  async function loadMasterData() {
    setError(null);
    const [airportsRes, pairsRes] = await Promise.all([
      sdk.http.get<AirportGroup[]>('/airports'),
      sdk.http.get<CityPair[]>('/city-pairs'),
    ]);
    if (airportsRes.isSuccess && airportsRes.data && pairsRes.isSuccess && pairsRes.data) {
      dispatch({ type: 'SET_AIRPORTS', payload: airportsRes.data });
      dispatch({ type: 'SET_CITY_PAIRS', payload: pairsRes.data });
      dispatch({ type: 'SET_MASTER_DATA_LOADED', payload: true });
    } else {
      setError(t.search.masterDataError);
    }
  }

  const isRouteValid = useCallback((): boolean => {
    if (!state.origin || !state.destination) return false;
    return state.cityPairs.some(
      (p) => p.origin === state.origin?.airportCode && p.destination === state.destination?.airportCode
    );
  }, [state.origin, state.destination, state.cityPairs]);

  const canSearch = state.masterDataLoaded && state.origin && state.destination && isRouteValid();

  async function handleSearch() {
    if (!canSearch || !state.origin || !state.destination) return;
    setLoading(true);
    setSearchError(null);

    const outboundRes = await sdk.http.post<{ session_id: string; expires_at: number; offers: SearchSession['offers'] }>(
      '/search',
      {
        origin: state.origin.airportCode,
        destination: state.destination.airportCode,
        departureDate: state.departureDate,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
      }
    );

    if (!outboundRes.isSuccess || !outboundRes.data) {
      setSearchError(t.search.error);
      setLoading(false);
      return;
    }

    dispatch({
      type: 'SET_OUTBOUND_SESSION',
      payload: {
        sessionId: outboundRes.data.session_id,
        expiresAt: outboundRes.data.expires_at,
        offers: outboundRes.data.offers,
      },
    });

    if (state.tripType === 'roundTrip') {
      const returnRes = await sdk.http.post<{ session_id: string; expires_at: number; offers: SearchSession['offers'] }>(
        '/search',
        {
          origin: state.destination.airportCode,
          destination: state.origin.airportCode,
          departureDate: state.returnDate,
          adults: state.adults,
          children: state.children,
          infants: state.infants,
        }
      );
      if (returnRes.isSuccess && returnRes.data) {
        dispatch({
          type: 'SET_RETURN_SESSION',
          payload: {
            sessionId: returnRes.data.session_id,
            expiresAt: returnRes.data.expires_at,
            offers: returnRes.data.offers,
          },
        });
      }
    }

    dispatch({
      type: 'ADD_RECENT_SEARCH',
      payload: {
        tripType: state.tripType,
        origin: state.origin,
        destination: state.destination,
        departureDate: state.departureDate,
        returnDate: state.returnDate,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
      },
    });

    setLoading(false);
    navigate('results');
  }

  const showNoRoute = state.origin && state.destination && !isRouteValid();

  const passengerLabel = t.search.passengerSummary
    .replace('{adults}', String(state.adults))
    .replace('{children}', String(state.children))
    .replace('{infants}', String(state.infants));

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t.search.heading}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-testid="master-data-error">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            className="mt-2 text-sm text-red-600 font-medium underline"
            onClick={loadMasterData}
            aria-label={t.common.retry}
          >
            {t.common.retry}
          </button>
        </div>
      )}

      <div className="flex gap-2" data-testid="trip-type-toggle">
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            state.tripType === 'oneWay'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => dispatch({ type: 'SET_TRIP_TYPE', payload: 'oneWay' })}
          aria-label={t.search.oneWay}
          aria-pressed={state.tripType === 'oneWay'}
        >
          {t.search.oneWay}
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            state.tripType === 'roundTrip'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
          onClick={() => dispatch({ type: 'SET_TRIP_TYPE', payload: 'roundTrip' })}
          aria-label={t.search.roundTrip}
          aria-pressed={state.tripType === 'roundTrip'}
        >
          {t.search.roundTrip}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="w-full text-left border border-gray-300 rounded-lg p-3 text-sm"
          onClick={() => navigate('airport-picker', { airportPickerMode: 'departure' })}
          aria-label={t.search.selectDeparture}
          data-testid="origin-field"
        >
          {state.origin ? `${state.origin.airportCode} - ${state.origin.cityName}` : t.search.selectDeparture}
        </button>

        <button
          className="self-center w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-lg"
          onClick={() => dispatch({ type: 'SWAP_AIRPORTS' })}
          aria-label={t.search.swapAirports}
          data-testid="swap-airports"
        >
          &#8645;
        </button>

        <button
          className="w-full text-left border border-gray-300 rounded-lg p-3 text-sm"
          onClick={() => navigate('airport-picker', { airportPickerMode: 'arrival' })}
          aria-label={t.search.selectArrival}
          data-testid="destination-field"
        >
          {state.destination ? `${state.destination.airportCode} - ${state.destination.cityName}` : t.search.selectArrival}
        </button>

        {showNoRoute && (
          <p className="text-red-600 text-xs" data-testid="no-route-message" aria-live="polite">
            {t.search.noRoute}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="w-full text-left border border-gray-300 rounded-lg p-3 text-sm"
          onClick={() => navigate('date-picker')}
          aria-label={t.search.selectDepartureDate}
          data-testid="departure-date-field"
        >
          {t.search.departureDate}: {state.departureDate}
        </button>
        {state.tripType === 'roundTrip' && (
          <button
            className="w-full text-left border border-gray-300 rounded-lg p-3 text-sm"
            onClick={() => navigate('date-picker')}
            aria-label={t.search.selectReturnDate}
            data-testid="return-date-field"
          >
            {t.search.returnDate}: {state.returnDate}
          </button>
        )}
      </div>

      <button
        className="w-full text-left border border-gray-300 rounded-lg p-3 text-sm"
        onClick={() => navigate('passenger-count')}
        aria-label={t.search.selectPassengers}
        data-testid="passenger-summary-field"
      >
        {passengerLabel}
      </button>

      <button
        className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors ${
          canSearch && !loading ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
        }`}
        disabled={!canSearch || loading}
        onClick={handleSearch}
        aria-label={t.search.searchFlights}
        data-testid="search-submit"
      >
        {loading ? t.common.loading : t.search.searchFlights}
      </button>

      {searchError && (
        <p className="text-red-600 text-xs" data-testid="search-error-message" aria-live="assertive">
          {searchError}
        </p>
      )}

      {state.recentSearches.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">{t.search.recentSearches}</h2>
            <button
              className="text-sm text-red-600 font-medium"
              onClick={() => dispatch({ type: 'CLEAR_RECENT_SEARCHES' })}
              aria-label={t.search.clearAll}
              data-testid="clear-all-recent"
            >
              {t.search.clearAll}
            </button>
          </div>
          {state.recentSearches.map((rs, idx) => (
            <button
              key={idx}
              className="w-full text-left border border-gray-200 rounded-lg p-3"
              aria-label={`${rs.origin?.airportCode ?? ''} - ${rs.destination?.airportCode ?? ''}`}
              onClick={() => {
                if (rs.origin) dispatch({ type: 'SET_ORIGIN', payload: rs.origin });
                if (rs.destination) dispatch({ type: 'SET_DESTINATION', payload: rs.destination });
                dispatch({ type: 'SET_TRIP_TYPE', payload: rs.tripType });
                dispatch({ type: 'SET_DEPARTURE_DATE', payload: rs.departureDate });
                dispatch({ type: 'SET_RETURN_DATE', payload: rs.returnDate });
                dispatch({ type: 'SET_ADULTS', payload: rs.adults });
                dispatch({ type: 'SET_CHILDREN', payload: rs.children });
                dispatch({ type: 'SET_INFANTS', payload: rs.infants });
              }}
            >
              <p className="font-semibold text-sm text-gray-900" data-testid="recent-route-label">
                {rs.origin?.airportCode ?? ''} &#8594; {rs.destination?.airportCode ?? ''}
              </p>
              <p className="text-xs text-gray-500" data-testid="recent-date-label">
                {rs.departureDate}{rs.tripType === 'roundTrip' ? ` - ${rs.returnDate}` : ''}
              </p>
              <p className="text-xs text-gray-500" data-testid="recent-passenger-label">
                {rs.adults + rs.children + rs.infants} pax
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
