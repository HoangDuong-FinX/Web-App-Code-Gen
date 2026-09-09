import { createContext, useContext, type Dispatch } from 'react';
import type {
  TripType, Airport, SearchSession, FlightOffer, FareClass,
  PassengerForm, AncillarySelection, SeatSelection, BookingResult,
  CityPair, AirportGroup,
} from './types';

export interface RecentSearch {
  tripType: TripType; origin: Airport | null; destination: Airport | null;
  departureDate: string; returnDate: string; adults: number; children: number; infants: number;
}

export interface AppState {
  tripType: TripType; origin: Airport | null; destination: Airport | null;
  departureDate: string; returnDate: string; adults: number; children: number; infants: number;
  airports: AirportGroup[]; cityPairs: CityPair[]; masterDataLoaded: boolean;
  outboundSession: SearchSession | null; returnSession: SearchSession | null;
  selectedOutboundOffer: FlightOffer | null; selectedOutboundFare: FareClass | null;
  selectedReturnOffer: FlightOffer | null; selectedReturnFare: FareClass | null;
  passengerForms: PassengerForm[]; outboundAncillary: AncillarySelection[]; returnAncillary: AncillarySelection[];
  outboundSeats: SeatSelection[]; returnSeats: SeatSelection[]; bookingResult: BookingResult | null;
  vatRequested: boolean; recentSearches: RecentSearch[]; holdExpired: boolean;
}

function defaultDate(): string { const d = new Date(); d.setDate(d.getDate() + 28); return d.toISOString().slice(0, 10); }
function defaultReturnDate(): string { const d = new Date(); d.setDate(d.getDate() + 32); return d.toISOString().slice(0, 10); }
function loadRecentSearches(): RecentSearch[] { try { const raw = localStorage.getItem('flight_booking_recent'); if (raw) { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed.slice(0, 4) as RecentSearch[]; } } catch { /* ignore */ } return []; }

export const initialState: AppState = {
  tripType: 'oneWay', origin: null, destination: null, departureDate: defaultDate(), returnDate: defaultReturnDate(),
  adults: 1, children: 0, infants: 0, airports: [], cityPairs: [], masterDataLoaded: false,
  outboundSession: null, returnSession: null, selectedOutboundOffer: null, selectedOutboundFare: null,
  selectedReturnOffer: null, selectedReturnFare: null, passengerForms: [], outboundAncillary: [], returnAncillary: [],
  outboundSeats: [], returnSeats: [], bookingResult: null, vatRequested: false, recentSearches: loadRecentSearches(), holdExpired: false,
};

export type AppAction =
  | { type: 'SET_TRIP_TYPE'; payload: TripType } | { type: 'SET_ORIGIN'; payload: Airport | null } | { type: 'SET_DESTINATION'; payload: Airport | null }
  | { type: 'SWAP_AIRPORTS' } | { type: 'SET_DEPARTURE_DATE'; payload: string } | { type: 'SET_RETURN_DATE'; payload: string }
  | { type: 'SET_ADULTS'; payload: number } | { type: 'SET_CHILDREN'; payload: number } | { type: 'SET_INFANTS'; payload: number }
  | { type: 'SET_AIRPORTS'; payload: AirportGroup[] } | { type: 'SET_CITY_PAIRS'; payload: CityPair[] } | { type: 'SET_MASTER_DATA_LOADED'; payload: boolean }
  | { type: 'SET_OUTBOUND_SESSION'; payload: SearchSession } | { type: 'SET_RETURN_SESSION'; payload: SearchSession }
  | { type: 'SELECT_OUTBOUND_FARE'; payload: { offer: FlightOffer; fare: FareClass } } | { type: 'SELECT_RETURN_FARE'; payload: { offer: FlightOffer; fare: FareClass } }
  | { type: 'SET_PASSENGER_FORMS'; payload: PassengerForm[] } | { type: 'UPDATE_PASSENGER'; payload: { index: number; form: PassengerForm } }
  | { type: 'SET_OUTBOUND_ANCILLARY'; payload: AncillarySelection[] } | { type: 'SET_RETURN_ANCILLARY'; payload: AncillarySelection[] }
  | { type: 'SET_OUTBOUND_SEATS'; payload: SeatSelection[] } | { type: 'SET_RETURN_SEATS'; payload: SeatSelection[] }
  | { type: 'SET_BOOKING_RESULT'; payload: BookingResult } | { type: 'SET_VAT_REQUESTED'; payload: boolean }
  | { type: 'ADD_RECENT_SEARCH'; payload: RecentSearch } | { type: 'CLEAR_RECENT_SEARCHES' }
  | { type: 'SET_HOLD_EXPIRED'; payload: boolean } | { type: 'RESET' };

function saveRecentSearches(searches: RecentSearch[]): void { try { localStorage.setItem('flight_booking_recent', JSON.stringify(searches)); } catch { /* ignore */ } }

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TRIP_TYPE': return { ...state, tripType: action.payload };
    case 'SET_ORIGIN': return { ...state, origin: action.payload };
    case 'SET_DESTINATION': return { ...state, destination: action.payload };
    case 'SWAP_AIRPORTS': return { ...state, origin: state.destination, destination: state.origin };
    case 'SET_DEPARTURE_DATE': return { ...state, departureDate: action.payload };
    case 'SET_RETURN_DATE': return { ...state, returnDate: action.payload };
    case 'SET_ADULTS': return { ...state, adults: action.payload, infants: Math.min(state.infants, action.payload) };
    case 'SET_CHILDREN': return { ...state, children: action.payload };
    case 'SET_INFANTS': return { ...state, infants: Math.min(action.payload, state.adults) };
    case 'SET_AIRPORTS': return { ...state, airports: action.payload };
    case 'SET_CITY_PAIRS': return { ...state, cityPairs: action.payload };
    case 'SET_MASTER_DATA_LOADED': return { ...state, masterDataLoaded: action.payload };
    case 'SET_OUTBOUND_SESSION': return { ...state, outboundSession: action.payload, holdExpired: false };
    case 'SET_RETURN_SESSION': return { ...state, returnSession: action.payload };
    case 'SELECT_OUTBOUND_FARE': return { ...state, selectedOutboundOffer: action.payload.offer, selectedOutboundFare: action.payload.fare, outboundAncillary: [], outboundSeats: [] };
    case 'SELECT_RETURN_FARE': return { ...state, selectedReturnOffer: action.payload.offer, selectedReturnFare: action.payload.fare, returnAncillary: [], returnSeats: [] };
    case 'SET_PASSENGER_FORMS': return { ...state, passengerForms: action.payload };
    case 'UPDATE_PASSENGER': { const forms = [...state.passengerForms]; forms[action.payload.index] = action.payload.form; return { ...state, passengerForms: forms }; }
    case 'SET_OUTBOUND_ANCILLARY': return { ...state, outboundAncillary: action.payload };
    case 'SET_RETURN_ANCILLARY': return { ...state, returnAncillary: action.payload };
    case 'SET_OUTBOUND_SEATS': return { ...state, outboundSeats: action.payload };
    case 'SET_RETURN_SEATS': return { ...state, returnSeats: action.payload };
    case 'SET_BOOKING_RESULT': return { ...state, bookingResult: action.payload };
    case 'SET_VAT_REQUESTED': return { ...state, vatRequested: action.payload };
    case 'ADD_RECENT_SEARCH': { const updated = [action.payload, ...state.recentSearches].slice(0, 4); saveRecentSearches(updated); return { ...state, recentSearches: updated }; }
    case 'CLEAR_RECENT_SEARCHES': saveRecentSearches([]); return { ...state, recentSearches: [] };
    case 'SET_HOLD_EXPIRED': return { ...state, holdExpired: action.payload };
    case 'RESET': return { ...initialState, airports: state.airports, cityPairs: state.cityPairs, masterDataLoaded: state.masterDataLoaded, recentSearches: state.recentSearches };
    default: return state;
  }
}

export const AppStateContext = createContext<AppState>(initialState);
export const AppDispatchContext = createContext<Dispatch<AppAction>>(() => undefined);

export function useAppState(): AppState { return useContext(AppStateContext); }
export function useAppDispatch(): Dispatch<AppAction> { return useContext(AppDispatchContext); }
