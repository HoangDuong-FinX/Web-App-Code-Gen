// Application state management using React useReducer + Context
// State is kept at app root and passed down; no global store library.

import type {
  ScreenId,
  AppState,
  SearchCriteria,
  SearchSession,
  FlightOffer,
  PassengerInfo,
  LegServices,
  BookingResult,
  TripType,
} from './types';

const today = new Date();
const defaultDeparture = new Date(today);
defaultDeparture.setDate(today.getDate() + 28);
const defaultReturn = new Date(defaultDeparture);
defaultReturn.setDate(defaultDeparture.getDate() + 4);

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const emptyServices: LegServices = { meals: [], baggage: [], seats: [] };

export const INITIAL_STATE: AppState = {
  screen: 'search',
  searchCriteria: {
    tripType: 'round-trip',
    origin: null,
    destination: null,
    departureDate: fmt(defaultDeparture),
    returnDate: fmt(defaultReturn),
    passengers: { adults: 1, children: 0, infants: 0 },
  },
  outboundSession: null,
  returnSession: null,
  selectedOutboundOffer: null,
  selectedReturnOffer: null,
  passengers: [],
  outboundServices: { ...emptyServices },
  returnServices: { ...emptyServices },
  bookingKey: null,
  bookingResult: null,
  masterDataError: null,
  searchError: null,
  passengerError: null,
  servicesError: null,
  checkoutError: null,
};

export type AppAction =
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'SET_SEARCH_CRITERIA'; criteria: Partial<SearchCriteria> }
  | { type: 'SET_TRIP_TYPE'; tripType: TripType }
  | { type: 'SET_OUTBOUND_SESSION'; session: SearchSession }
  | { type: 'SET_RETURN_SESSION'; session: SearchSession }
  | { type: 'SELECT_OUTBOUND_OFFER'; offer: FlightOffer }
  | { type: 'SELECT_RETURN_OFFER'; offer: FlightOffer }
  | { type: 'SET_PASSENGERS'; passengers: PassengerInfo[] }
  | { type: 'UPDATE_PASSENGER'; index: number; passenger: Partial<PassengerInfo> }
  | { type: 'SET_OUTBOUND_SERVICES'; services: LegServices }
  | { type: 'SET_RETURN_SERVICES'; services: LegServices }
  | { type: 'SET_BOOKING_KEY'; key: string }
  | { type: 'SET_BOOKING_RESULT'; result: BookingResult }
  | { type: 'SET_MASTER_DATA_ERROR'; error: string | null }
  | { type: 'SET_SEARCH_ERROR'; error: string | null }
  | { type: 'SET_PASSENGER_ERROR'; error: string | null }
  | { type: 'SET_SERVICES_ERROR'; error: string | null }
  | { type: 'SET_CHECKOUT_ERROR'; error: string | null }
  | { type: 'RESET' };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };

    case 'SET_SEARCH_CRITERIA':
      return {
        ...state,
        searchCriteria: { ...state.searchCriteria, ...action.criteria },
      };

    case 'SET_TRIP_TYPE': {
      const returnDate =
        action.tripType === 'round-trip'
          ? state.searchCriteria.returnDate ?? fmt(defaultReturn)
          : null;
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          tripType: action.tripType,
          returnDate,
        },
      };
    }

    case 'SET_OUTBOUND_SESSION':
      return { ...state, outboundSession: action.session, searchError: null };

    case 'SET_RETURN_SESSION':
      return { ...state, returnSession: action.session };

    case 'SELECT_OUTBOUND_OFFER':
      return {
        ...state,
        selectedOutboundOffer: action.offer,
        outboundServices: { ...emptyServices },
      };

    case 'SELECT_RETURN_OFFER':
      return {
        ...state,
        selectedReturnOffer: action.offer,
        returnServices: { ...emptyServices },
      };

    case 'SET_PASSENGERS':
      return { ...state, passengers: action.passengers };

    case 'UPDATE_PASSENGER': {
      const updated = state.passengers.map((p, i) =>
        i === action.index ? { ...p, ...action.passenger } : p,
      );
      return { ...state, passengers: updated };
    }

    case 'SET_OUTBOUND_SERVICES':
      return { ...state, outboundServices: action.services };

    case 'SET_RETURN_SERVICES':
      return { ...state, returnServices: action.services };

    case 'SET_BOOKING_KEY':
      return { ...state, bookingKey: action.key };

    case 'SET_BOOKING_RESULT':
      return { ...state, bookingResult: action.result };

    case 'SET_MASTER_DATA_ERROR':
      return { ...state, masterDataError: action.error };

    case 'SET_SEARCH_ERROR':
      return { ...state, searchError: action.error };

    case 'SET_PASSENGER_ERROR':
      return { ...state, passengerError: action.error };

    case 'SET_SERVICES_ERROR':
      return { ...state, servicesError: action.error };

    case 'SET_CHECKOUT_ERROR':
      return { ...state, checkoutError: action.error };

    case 'RESET':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
