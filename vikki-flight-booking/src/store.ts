import { create } from 'zustand';
import { AppState, SearchCriteria, Session, FlightOffer, Passenger } from './types';

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

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setSearchCriteria: (criteria) => set({ searchCriteria: criteria }),
  setOutboundSession: (session) => set({ outboundSession: session }),
  setReturnSession: (session) => set({ returnSession: session }),
  setOutboundOffer: (offer) => set({ outboundOffer: offer }),
  setReturnOffer: (offer) => set({ returnOffer: offer }),
  setPassengers: (passengers) => set({ passengers }),
  setHostIdentity: (name) => set({ hostIdentity: name }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setPaymentResult: (result) => set({ paymentResult: result }),
  setBookingCode: (code) => set({ bookingCode: code }),
  setTransactionId: (id) => set({ transactionId: id }),
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
