import { create } from 'zustand';
import { BookingSession, Passenger, PassengerWithId } from '../types';

interface StoreState {
  // Search state
  tripType: 'roundTrip' | 'oneWay';
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  recentSearches: Array<{ origin: string; destination: string; tripType: string; timestamp: number }>;

  // Session state
  outboundSessionId: string | null;
  outboundExpiresAt: string | null;
  returnSessionId: string | null;
  returnExpiresAt: string | null;
  holdExpired: boolean;

  // Offer selection
  outboundOfferId: string | null;
  returnOfferId: string | null;

  // Passenger state
  passengers: PassengerWithId[];
  outboundPassengers: PassengerWithId[];
  returnPassengers: PassengerWithId[];

  // Ancillary & seat selections
  outboundAncillaries: Record<string, string[]>;
  outboundSeats: Record<string, string>;
  returnAncillaries: Record<string, string[]>;
  returnSeats: Record<string, string>;

  // Payment state
  outboundBookingKey: string | null;
  outboundAmount: number | null;
  returnBookingKey: string | null;
  returnAmount: number | null;
  outboundTransactionId: string | null;
  returnTransactionId: string | null;
  paymentOutcome: 'success' | 'failure' | 'partial' | 'simulated' | null;
  paymentError: string | null;

  // Actions
  setTripType: (type: 'roundTrip' | 'oneWay') => void;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setDepartDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  setAdultCount: (count: number) => void;
  setChildCount: (count: number) => void;
  setInfantCount: (count: number) => void;
  addRecentSearch: (search: { origin: string; destination: string; tripType: string }) => void;
  clearRecentSearches: () => void;

  setOutboundSession: (sessionId: string, expiresAt: string) => void;
  setReturnSession: (sessionId: string, expiresAt: string) => void;
  setHoldExpired: (expired: boolean) => void;

  setOutboundOffer: (offerId: string) => void;
  setReturnOffer: (offerId: string) => void;

  setPassengers: (passengers: PassengerWithId[]) => void;
  setOutboundPassengers: (passengers: PassengerWithId[]) => void;
  setReturnPassengers: (passengers: PassengerWithId[]) => void;

  setOutboundAncillaries: (ancillaries: Record<string, string[]>) => void;
  setOutboundSeats: (seats: Record<string, string>) => void;
  setReturnAncillaries: (ancillaries: Record<string, string[]>) => void;
  setReturnSeats: (seats: Record<string, string>) => void;

  setOutboundBookingKey: (key: string, amount: number) => void;
  setReturnBookingKey: (key: string, amount: number) => void;
  setOutboundTransactionId: (id: string) => void;
  setReturnTransactionId: (id: string) => void;
  setPaymentOutcome: (outcome: 'success' | 'failure' | 'partial' | 'simulated') => void;
  setPaymentError: (error: string | null) => void;

  resetStore: () => void;
}

const initialState = {
  tripType: 'roundTrip' as const,
  origin: '',
  destination: '',
  departDate: '',
  returnDate: '',
  adultCount: 1,
  childCount: 0,
  infantCount: 0,
  recentSearches: [],
  outboundSessionId: null,
  outboundExpiresAt: null,
  returnSessionId: null,
  returnExpiresAt: null,
  holdExpired: false,
  outboundOfferId: null,
  returnOfferId: null,
  passengers: [],
  outboundPassengers: [],
  returnPassengers: [],
  outboundAncillaries: {},
  outboundSeats: {},
  returnAncillaries: {},
  returnSeats: {},
  outboundBookingKey: null,
  outboundAmount: null,
  returnBookingKey: null,
  returnAmount: null,
  outboundTransactionId: null,
  returnTransactionId: null,
  paymentOutcome: null,
  paymentError: null,
};

export const useStore = create<StoreState>((set) => ({
  ...initialState,

  setTripType: (type) => set({ tripType: type }),
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setDepartDate: (departDate) => set({ departDate }),
  setReturnDate: (returnDate) => set({ returnDate }),
  setAdultCount: (adultCount) => set({ adultCount }),
  setChildCount: (childCount) => set({ childCount }),
  setInfantCount: (infantCount) => set({ infantCount }),
  addRecentSearch: (search) =>
    set((state) => {
      const existing = state.recentSearches.filter(
        (s) => !(s.origin === search.origin && s.destination === search.destination && s.tripType === search.tripType)
      );
      return {
        recentSearches: [
          { ...search, timestamp: Date.now() },
          ...existing,
        ].slice(0, 4),
      };
    }),
  clearRecentSearches: () => set({ recentSearches: [] }),

  setOutboundSession: (sessionId, expiresAt) => set({ outboundSessionId: sessionId, outboundExpiresAt: expiresAt }),
  setReturnSession: (sessionId, expiresAt) => set({ returnSessionId: sessionId, returnExpiresAt: expiresAt }),
  setHoldExpired: (expired) => set({ holdExpired: expired }),

  setOutboundOffer: (offerId) => set({ outboundOfferId: offerId, outboundAncillaries: {}, outboundSeats: {} }),
  setReturnOffer: (offerId) => set({ returnOfferId: offerId, returnAncillaries: {}, returnSeats: {} }),

  setPassengers: (passengers) => set({ passengers }),
  setOutboundPassengers: (passengers) => set({ outboundPassengers: passengers }),
  setReturnPassengers: (passengers) => set({ returnPassengers: passengers }),

  setOutboundAncillaries: (ancillaries) => set({ outboundAncillaries: ancillaries }),
  setOutboundSeats: (seats) => set({ outboundSeats: seats }),
  setReturnAncillaries: (ancillaries) => set({ returnAncillaries: ancillaries }),
  setReturnSeats: (seats) => set({ returnSeats: seats }),

  setOutboundBookingKey: (key, amount) => set({ outboundBookingKey: key, outboundAmount: amount }),
  setReturnBookingKey: (key, amount) => set({ returnBookingKey: key, returnAmount: amount }),
  setOutboundTransactionId: (id) => set({ outboundTransactionId: id }),
  setReturnTransactionId: (id) => set({ returnTransactionId: id }),
  setPaymentOutcome: (outcome) => set({ paymentOutcome: outcome }),
  setPaymentError: (error) => set({ paymentError: error }),

  resetStore: () => set(initialState),
}));