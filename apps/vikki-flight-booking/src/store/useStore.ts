import { useState, useCallback } from 'react';

export interface Passenger {
  lastName: string;
  firstName: string;
  gender: 'male' | 'female';
  dob: string | null;
  phone: string | null;
  email: string | null;
}

export interface FlightOffer {
  offerId: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureAirport: string;
  arrivalAirport: string;
  departureAirportName: string;
  arrivalAirportName: string;
  airlineLogo: string;
  fareClassName: string;
  farePrice: number;
}

export interface AncillarySelection {
  passengerId: string;
  optionId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface SeatSelection {
  passengerIndex: number;
  seatId: string;
  seatLabel: string;
  price: number;
}

export interface StoreState {
  tripType: 'one-way' | 'round-trip';
  origin: string | null;
  originName: string | null;
  destination: string | null;
  destinationName: string | null;
  departureDate: string | null;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  sessionId: string | null;
  returnSessionId: string | null;
  expiresAt: string | null;
  offers: FlightOffer[];
  returnOffers: FlightOffer[];
  selectedOfferId: string | null;
  selectedReturnOfferId: string | null;
  passengers: Passenger[];
  passengerIds: string[];
  ancillarySelections: AncillarySelection[];
  returnAncillarySelections: AncillarySelection[];
  seatSelections: SeatSelection[];
  returnSeatSelections: SeatSelection[];
  bookingKey: string | null;
  returnBookingKey: string | null;
  paymentError: string | null;
  transactionId: string | null;
  returnTransactionId: string | null;
  viaHost: boolean;
  outboundBookingCode: string | null;
  returnBookingCode: string | null;
}

const initialState: StoreState = {
  tripType: 'one-way',
  origin: null,
  originName: null,
  destination: null,
  destinationName: null,
  departureDate: null,
  returnDate: null,
  adults: 1,
  children: 0,
  infants: 0,
  sessionId: null,
  returnSessionId: null,
  expiresAt: null,
  offers: [],
  returnOffers: [],
  selectedOfferId: null,
  selectedReturnOfferId: null,
  passengers: [],
  passengerIds: [],
  ancillarySelections: [],
  returnAncillarySelections: [],
  seatSelections: [],
  returnSeatSelections: [],
  bookingKey: null,
  returnBookingKey: null,
  paymentError: null,
  transactionId: null,
  returnTransactionId: null,
  viaHost: false,
  outboundBookingCode: null,
  returnBookingCode: null,
};

let globalState = { ...initialState };
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((l) => l());
}

export function useStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const update = useCallback((partial: Partial<StoreState>) => {
    globalState = { ...globalState, ...partial };
    notify();
  }, []);

  const reset = useCallback(() => {
    globalState = { ...initialState };
    notify();
  }, []);

  return {
    ...globalState,
    update,
    reset,
  };
}
