import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import type { BookingState, TripType, Airport, PassengerCount, FlightOffer, Session, PassengerInfo, PaymentResult, ScreenId } from '../types';

const initialBookingState: BookingState = {
  tripType: 'oneway',
  origin: null,
  destination: null,
  departureDate: '',
  returnDate: '',
  passengerCount: { adults: 1, children: 0, infants: 0 },
  outboundSession: null,
  returnSession: null,
  selectedOutboundOffer: null,
  selectedReturnOffer: null,
  passengers: [],
  passengerIds: [],
  returnPassengerIds: [],
  selectedServices: [],
  selectedSeats: [],
  returnSelectedServices: [],
  returnSelectedSeats: [],
  paymentInquiry: null,
  paymentResult: null,
  returnPaymentResult: null,
  fallbackReason: null,
};

type BookingAction =
  | { type: 'SET_TRIP_TYPE'; payload: TripType }
  | { type: 'SET_ORIGIN'; payload: Airport }
  | { type: 'SET_DESTINATION'; payload: Airport }
  | { type: 'SWAP_LOCATIONS' }
  | { type: 'SET_DEPARTURE_DATE'; payload: string }
  | { type: 'SET_RETURN_DATE'; payload: string }
  | { type: 'SET_PASSENGER_COUNT'; payload: PassengerCount }
  | { type: 'SET_OUTBOUND_SESSION'; payload: Session }
  | { type: 'SET_RETURN_SESSION'; payload: Session }
  | { type: 'SELECT_OUTBOUND_OFFER'; payload: FlightOffer }
  | { type: 'SELECT_RETURN_OFFER'; payload: FlightOffer }
  | { type: 'SET_PASSENGERS'; payload: PassengerInfo[] }
  | { type: 'SET_PASSENGER_IDS'; payload: string[] }
  | { type: 'SET_RETURN_PASSENGER_IDS'; payload: string[] }
  | { type: 'SET_PAYMENT_RESULT'; payload: PaymentResult }
  | { type: 'SET_RETURN_PAYMENT_RESULT'; payload: PaymentResult }
  | { type: 'SET_FALLBACK_REASON'; payload: string }
  | { type: 'RESET' };

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_TRIP_TYPE':
      return { ...state, tripType: action.payload };
    case 'SET_ORIGIN':
      return { ...state, origin: action.payload };
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload };
    case 'SWAP_LOCATIONS':
      return { ...state, origin: state.destination, destination: state.origin };
    case 'SET_DEPARTURE_DATE':
      return { ...state, departureDate: action.payload };
    case 'SET_RETURN_DATE':
      return { ...state, returnDate: action.payload };
    case 'SET_PASSENGER_COUNT':
      return { ...state, passengerCount: action.payload };
    case 'SET_OUTBOUND_SESSION':
      return { ...state, outboundSession: action.payload };
    case 'SET_RETURN_SESSION':
      return { ...state, returnSession: action.payload };
    case 'SELECT_OUTBOUND_OFFER':
      return { ...state, selectedOutboundOffer: action.payload };
    case 'SELECT_RETURN_OFFER':
      return { ...state, selectedReturnOffer: action.payload };
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.payload };
    case 'SET_PASSENGER_IDS':
      return { ...state, passengerIds: action.payload };
    case 'SET_RETURN_PASSENGER_IDS':
      return { ...state, returnPassengerIds: action.payload };
    case 'SET_PAYMENT_RESULT':
      return { ...state, paymentResult: action.payload };
    case 'SET_RETURN_PAYMENT_RESULT':
      return { ...state, returnPaymentResult: action.payload };
    case 'SET_FALLBACK_REASON':
      return { ...state, fallbackReason: action.payload };
    case 'RESET':
      return initialBookingState;
    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextValue>({
  state: initialBookingState,
  dispatch: () => undefined,
});

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}

// Hold timer hook
export function useHoldTimer(
  expiresAt: string | null,
  onExpire: () => void
): number {
  const [remaining, setRemaining] = React.useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(0);
      return;
    }
    const calcRemaining = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };
    setRemaining(calcRemaining());

    intervalRef.current = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onExpire();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [expiresAt, onExpire]);

  return remaining;
}

export { initialBookingState };
