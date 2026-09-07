import { create } from 'zustand';
import type { AppState, SearchCriteria, Session, FlightOffer, Passenger } from './types';

const useStore = create<
  AppState & {
    setCurrentScreen: (screen: string) => void;
    setSearchCriteria: (criteria: SearchCriteria) => void;
    setOutboundSession: (session: Session) => void;
    setReturnSession: (session: Session) => void;
    setOutboundOffer: (offer: FlightOffer) => void;
    setReturnOffer: (offer: FlightOffer) => void;
    setPassengers: (passengers: Passenger[]) => void;
    setHostIdentity: (name: string) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
    setPaymentResult: (result: 'success' | 'failed' | 'partial' | 'simulated' | null) => void;
    setBookingCode: (code: string | null) => void;
    setTransactionId: (id: string | null) => void;
    reset: () => void;
  }
>((set) => ({
  currentScreen: 'search',
  searchCriteria: null,
  outboundSession: null,
  returnSession: null,
  outboundOffer: null,
  returnOffer: null,
  passengers: [],
  hostIdentity: null,
  error: null,
  loading: false,
  paymentResult: null,
  bookingCode: null,
  transactionId: null,

  setCurrentScreen: (screen: string) => set({ currentScreen: screen }),
  setSearchCriteria: (criteria: SearchCriteria) => set({ searchCriteria: criteria }),
  setOutboundSession: (session: Session) => set({ outboundSession: session }),
  setReturnSession: (session: Session) => set({ returnSession: session }),
  setOutboundOffer: (offer: FlightOffer) => set({ outboundOffer: offer }),
  setReturnOffer: (offer: FlightOffer) => set({ returnOffer: offer }),
  setPassengers: (passengers: Passenger[]) => set({ passengers }),
  setHostIdentity: (name: string) => set({ hostIdentity: name }),
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ loading }),
  setPaymentResult: (result: 'success' | 'failed' | 'partial' | 'simulated' | null) =>
    set({ paymentResult: result }),
  setBookingCode: (code: string | null) => set({ bookingCode: code }),
  setTransactionId: (id: string | null) => set({ transactionId: id }),
  reset: () =>
    set({
      currentScreen: 'search',
      searchCriteria: null,
      outboundSession: null,
      returnSession: null,
      outboundOffer: null,
      returnOffer: null,
      passengers: [],
      error: null,
      loading: false,
      paymentResult: null,
      bookingCode: null,
      transactionId: null,
    }),
}));

export { useStore };
