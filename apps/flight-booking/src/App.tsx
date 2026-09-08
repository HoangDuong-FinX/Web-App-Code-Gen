import React, { useState, useCallback, useReducer } from 'react';
import type {
  ScreenId,
  BookingState,
  Airport,
  Session,
  Flight,
  Fare,
  Traveller,
  AncillarySelection,
  SeatSelection,
  DoneStatus,
} from './types';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { PassengersScreen } from './screens/PassengersScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { PaymentReviewScreen } from './screens/PaymentReviewScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { DoneScreen } from './screens/DoneScreen';

function createInitialState(): BookingState {
  return {
    tripType: 'one-way',
    origin: null,
    destination: null,
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    outboundSession: null,
    returnSession: null,
    selectedOutboundOffer: null,
    selectedOutboundFare: null,
    selectedReturnOffer: null,
    selectedReturnFare: null,
    travellers: [],
    outboundAncillarySelections: [],
    returnAncillarySelections: [],
    outboundSeatSelection: null,
    returnSeatSelection: null,
    doneStatus: 'success',
    bookingCode: '',
    transactionId: '',
    paymentError: '',
    totalAmount: 0,
  };
}

type BookingAction =
  | { type: 'SET_TRIP_TYPE'; payload: 'one-way' | 'round-trip' }
  | { type: 'SET_ORIGIN'; payload: Airport | null }
  | { type: 'SET_DESTINATION'; payload: Airport | null }
  | { type: 'SET_DEPARTURE_DATE'; payload: string }
  | { type: 'SET_RETURN_DATE'; payload: string }
  | { type: 'SET_PASSENGERS'; payload: { adults: number; children: number; infants: number } }
  | { type: 'SET_OUTBOUND_SESSION'; payload: Session }
  | { type: 'SET_RETURN_SESSION'; payload: Session }
  | { type: 'SELECT_OUTBOUND_OFFER'; payload: { offer: Flight; fare: Fare } }
  | { type: 'SELECT_RETURN_OFFER'; payload: { offer: Flight; fare: Fare } }
  | { type: 'SET_TRAVELLERS'; payload: Traveller[] }
  | { type: 'SET_OUTBOUND_ANCILLARIES'; payload: AncillarySelection[] }
  | { type: 'SET_RETURN_ANCILLARIES'; payload: AncillarySelection[] }
  | { type: 'SET_OUTBOUND_SEAT'; payload: SeatSelection | null }
  | { type: 'SET_RETURN_SEAT'; payload: SeatSelection | null }
  | { type: 'SET_DONE'; payload: { status: DoneStatus; bookingCode: string; transactionId: string; paymentError: string; totalAmount: number } }
  | { type: 'CLEAR_PAYMENT_ERROR' }
  | { type: 'RESET' };

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_TRIP_TYPE':
      return { ...state, tripType: action.payload };
    case 'SET_ORIGIN':
      return { ...state, origin: action.payload };
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload };
    case 'SET_DEPARTURE_DATE':
      return { ...state, departureDate: action.payload };
    case 'SET_RETURN_DATE':
      return { ...state, returnDate: action.payload };
    case 'SET_PASSENGERS':
      return { ...state, ...action.payload };
    case 'SET_OUTBOUND_SESSION':
      return { ...state, outboundSession: action.payload };
    case 'SET_RETURN_SESSION':
      return { ...state, returnSession: action.payload };
    case 'SELECT_OUTBOUND_OFFER':
      return {
        ...state,
        selectedOutboundOffer: action.payload.offer,
        selectedOutboundFare: action.payload.fare,
        outboundAncillarySelections: [],
        outboundSeatSelection: null,
      };
    case 'SELECT_RETURN_OFFER':
      return {
        ...state,
        selectedReturnOffer: action.payload.offer,
        selectedReturnFare: action.payload.fare,
        returnAncillarySelections: [],
        returnSeatSelection: null,
      };
    case 'SET_TRAVELLERS':
      return { ...state, travellers: action.payload };
    case 'SET_OUTBOUND_ANCILLARIES':
      return { ...state, outboundAncillarySelections: action.payload };
    case 'SET_RETURN_ANCILLARIES':
      return { ...state, returnAncillarySelections: action.payload };
    case 'SET_OUTBOUND_SEAT':
      return { ...state, outboundSeatSelection: action.payload };
    case 'SET_RETURN_SEAT':
      return { ...state, returnSeatSelection: action.payload };
    case 'SET_DONE':
      return {
        ...state,
        doneStatus: action.payload.status,
        bookingCode: action.payload.bookingCode,
        transactionId: action.payload.transactionId,
        paymentError: action.payload.paymentError,
        totalAmount: action.payload.totalAmount,
      };
    case 'CLEAR_PAYMENT_ERROR':
      return { ...state, paymentError: '' };
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

export type { BookingAction };

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('search');
  const [state, dispatch] = useReducer(bookingReducer, undefined, createInitialState);

  const navigate = useCallback((screen: ScreenId) => {
    setCurrentScreen(screen);
  }, []);

  const getExpiresAt = useCallback((): string | null => {
    const outExp = state.outboundSession?.expires_at ?? null;
    const retExp = state.returnSession?.expires_at ?? null;
    if (outExp && retExp) {
      return new Date(outExp) < new Date(retExp) ? outExp : retExp;
    }
    return outExp ?? retExp;
  }, [state.outboundSession, state.returnSession]);

  const computeTotal = useCallback((): number => {
    const outPrice = state.selectedOutboundFare?.price_amount ?? 0;
    const retPrice = state.selectedReturnFare?.price_amount ?? 0;
    const paxCount = state.adults + state.children;
    let ticketTotal = (outPrice + retPrice) * paxCount;
    if (state.infants > 0) {
      ticketTotal = ticketTotal * 1.1;
    }
    const seatsCost = (state.outboundSeatSelection?.price ?? 0) + (state.returnSeatSelection?.price ?? 0);
    return Math.round(ticketTotal + seatsCost);
  }, [state.selectedOutboundFare, state.selectedReturnFare, state.adults, state.children, state.infants, state.outboundSeatSelection, state.returnSeatSelection]);

  const renderScreen = () => {
    if (currentScreen !== 'search' && !state.outboundSession) {
      setCurrentScreen('search');
      return null;
    }

    switch (currentScreen) {
      case 'search':
        return (
          <SearchScreen
            state={state}
            dispatch={dispatch}
            onNavigate={navigate}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            state={state}
            dispatch={dispatch}
            expiresAt={getExpiresAt()}
            onNavigate={navigate}
          />
        );
      case 'passengers':
        return (
          <PassengersScreen
            state={state}
            dispatch={dispatch}
            expiresAt={getExpiresAt()}
            onNavigate={navigate}
          />
        );
      case 'services':
        return (
          <ServicesScreen
            state={state}
            dispatch={dispatch}
            expiresAt={getExpiresAt()}
            onNavigate={navigate}
          />
        );
      case 'payment-review':
        return (
          <PaymentReviewScreen
            state={state}
            computeTotal={computeTotal}
            onNavigate={navigate}
          />
        );
      case 'checkout':
        return (
          <CheckoutScreen
            state={state}
            dispatch={dispatch}
            expiresAt={getExpiresAt()}
            computeTotal={computeTotal}
            onNavigate={navigate}
          />
        );
      case 'done':
        return (
          <DoneScreen
            state={state}
            dispatch={dispatch}
            onNavigate={navigate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-lg min-h-screen bg-white shadow-sm">
        {renderScreen()}
      </div>
    </div>
  );
}