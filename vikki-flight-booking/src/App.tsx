import React, { useReducer, useEffect, useCallback } from 'react';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneScreen } from './screens/DoneScreen';
import type { AppState, AppAction, ScreenId, Airport, CityPair, FlightOffer, PassengerInfo, ServicesData, BookingResult } from './types/state';
import { fixtureLoadAirports } from './fixtures/airports';
import { fixtureLoadCityPairs } from './fixtures/cityPairs';
import './styles/tokens.css';

const EMPTY_SERVICES: ServicesData = { meals: [], baggage: null, seats: [] };

const today = new Date();
const defaultDeparture = new Date(today);
defaultDeparture.setDate(today.getDate() + 28);
const defaultReturn = new Date(defaultDeparture);
defaultReturn.setDate(defaultDeparture.getDate() + 4);

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const INITIAL_STATE: AppState = {
  screen: 'search',
  tripType: 'round-trip',
  origin: null,
  destination: null,
  departureDate: dateStr(defaultDeparture),
  returnDate: dateStr(defaultReturn),
  adults: 2,
  children: 1,
  infants: 0,
  sessionId: '',
  expiresAt: '',
  outboundOffers: [],
  returnOffers: [],
  selectedOutboundOffer: null,
  selectedReturnOffer: null,
  passengers: [],
  outboundServices: EMPTY_SERVICES,
  returnServices: EMPTY_SERVICES,
  bookingKey: '',
  returnBookingKey: '',
  bookingResult: null,
  masterDataError: '',
  searchError: '',
  passengerError: '',
  servicesError: '',
  checkoutError: '',
  checkoutLoadError: '',
  isSearching: false,
  isSubmittingPassengers: false,
  isSubmittingServices: false,
  isSubmittingPayment: false,
  airports: [],
  cityPairs: [],
  masterDataLoaded: false,
};

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };
    case 'SET_TRIP_TYPE':
      return { ...state, tripType: action.tripType };
    case 'SET_ORIGIN':
      return { ...state, origin: action.airport };
    case 'SET_DESTINATION':
      return { ...state, destination: action.airport };
    case 'SWAP_AIRPORTS': {
      const newDep = state.returnDate;
      const newRet = state.departureDate;
      const adjustedRet = newRet < newDep ? addDays(newDep, 4) : newRet;
      return {
        ...state,
        origin: state.destination,
        destination: state.origin,
        departureDate: newDep,
        returnDate: adjustedRet,
      };
    }
    case 'SET_DEPARTURE_DATE': {
      const dep = action.date;
      const ret = state.returnDate < dep ? addDays(dep, 4) : state.returnDate;
      return { ...state, departureDate: dep, returnDate: ret };
    }
    case 'SET_RETURN_DATE':
      return { ...state, returnDate: action.date };
    case 'SET_PASSENGERS_COUNT':
      return { ...state, adults: action.adults, children: action.children, infants: action.infants };
    case 'SET_MASTER_DATA':
      return { ...state, airports: action.airports, cityPairs: action.cityPairs, masterDataLoaded: true, masterDataError: '' };
    case 'SET_MASTER_DATA_ERROR':
      return { ...state, masterDataError: action.error, masterDataLoaded: false };
    case 'SET_SEARCH_ERROR':
      return { ...state, searchError: action.error, isSearching: false };
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.value, searchError: '' };
    case 'SET_SESSION':
      return {
        ...state,
        sessionId: action.sessionId,
        expiresAt: action.expiresAt,
        outboundOffers: action.outboundOffers,
        isSearching: false,
        searchError: '',
      };
    case 'SET_RETURN_OFFERS':
      return { ...state, returnOffers: action.returnOffers };
    case 'SELECT_OUTBOUND_OFFER':
      return {
        ...state,
        selectedOutboundOffer: action.offer,
        outboundServices: EMPTY_SERVICES,
      };
    case 'SELECT_RETURN_OFFER':
      return {
        ...state,
        selectedReturnOffer: action.offer,
        returnServices: EMPTY_SERVICES,
      };
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.passengers, passengerError: '', isSubmittingPassengers: false };
    case 'SET_PASSENGER_ERROR':
      return { ...state, passengerError: action.error, isSubmittingPassengers: false };
    case 'SET_SUBMITTING_PASSENGERS':
      return { ...state, isSubmittingPassengers: action.value };
    case 'SET_OUTBOUND_SERVICES':
      return { ...state, outboundServices: action.services };
    case 'SET_RETURN_SERVICES':
      return { ...state, returnServices: action.services };
    case 'SET_SERVICES_ERROR':
      return { ...state, servicesError: action.error, isSubmittingServices: false };
    case 'SET_SUBMITTING_SERVICES':
      return { ...state, isSubmittingServices: action.value };
    case 'SET_BOOKING_KEY':
      return { ...state, bookingKey: action.bookingKey, returnBookingKey: action.returnBookingKey, checkoutLoadError: '' };
    case 'SET_CHECKOUT_ERROR':
      return { ...state, checkoutError: action.error, isSubmittingPayment: false };
    case 'SET_CHECKOUT_LOAD_ERROR':
      return { ...state, checkoutLoadError: action.error };
    case 'SET_SUBMITTING_PAYMENT':
      return { ...state, isSubmittingPayment: action.value };
    case 'SET_BOOKING_RESULT':
      return { ...state, bookingResult: action.result, isSubmittingPayment: false };
    case 'RESET':
      return { ...INITIAL_STATE, airports: state.airports, cityPairs: state.cityPairs, masterDataLoaded: state.masterDataLoaded };
    default:
      return state;
  }
}

export interface AppProps {
  hostRuntime?: {
    id?: { name?: string };
    theme?: 'light' | 'dark';
    locale?: string;
  };
  basename?: string;
}

export default function App({ hostRuntime }: AppProps): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const navigate = useCallback((screen: ScreenId) => {
    dispatch({ type: 'NAVIGATE', screen });
  }, []);

  // Load master data on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [airports, cityPairs] = await Promise.all([
          fixtureLoadAirports(),
          fixtureLoadCityPairs(),
        ]) as [Airport[], CityPair[]];
        if (!cancelled) {
          dispatch({ type: 'SET_MASTER_DATA', airports, cityPairs });
        }
      } catch {
        if (!cancelled) {
          dispatch({ type: 'SET_MASTER_DATA_ERROR', error: 'masterDataError' });
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const theme = hostRuntime?.theme ?? 'light';

  function renderScreen(): React.ReactElement {
    // Guard: screens beyond search require a sessionId
    const requiresSession: ScreenId[] = ['passengers', 'services', 'payment', 'checkout', 'done'];
    if (requiresSession.includes(state.screen) && !state.sessionId) {
      return (
        <SearchScreen
          state={state}
          dispatch={dispatch}
          navigate={navigate}
          hostRuntime={hostRuntime}
        />
      );
    }

    switch (state.screen) {
      case 'search':
        return (
          <SearchScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
            hostRuntime={hostRuntime}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
            isReturn={false}
          />
        );
      case 'results-return':
        return (
          <ResultsScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
            isReturn={true}
          />
        );
      case 'passengers':
        return (
          <PassengersScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
            hostRuntime={hostRuntime}
          />
        );
      case 'services':
        return (
          <ServicesScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
          />
        );
      case 'payment':
        return (
          <PaymentScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
          />
        );
      case 'done':
        return (
          <DoneScreen
            state={state}
            dispatch={dispatch}
            navigate={navigate}
          />
        );
      default: {
        const _exhaustive: never = state.screen;
        return <div>{_exhaustive}</div>;
      }
    }
  }

  return (
    <div
      className={`gg-brand-vikki vikki-app theme-${theme}`}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-page)',
        color: 'var(--color-text-primary)',
      }}
      data-testid="app-root"
    >
      {renderScreen()}
    </div>
  );
}
