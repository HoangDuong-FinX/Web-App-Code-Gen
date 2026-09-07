// src/state/store.ts
import { useState, useCallback, useRef } from 'react';
import { createContext, useContext } from 'react';
import type {
  TripType,
  Airport,
  PassengerCount,
  SearchCriteria,
  SearchSession,
  Passenger,
  PassengerWithId,
  MealSelection,
  BaggageSelection,
  SeatSelection,
  PaymentInquiryPayload,
  DoneState,
  RecentSearch,
  ScreenId,
} from '../types';

export interface BookingStore {
  // Navigation
  currentScreen: ScreenId;
  navigate: (screen: ScreenId) => void;

  // Search criteria
  searchCriteria: SearchCriteria;
  setTripType: (t: TripType) => void;
  setOrigin: (a: Airport | null) => void;
  setDestination: (a: Airport | null) => void;
  setDepartureDate: (d: string) => void;
  setReturnDate: (d: string) => void;
  setPassengers: (p: PassengerCount) => void;
  swapAirports: () => void;

  // Sessions
  outboundSession: SearchSession | null;
  returnSession: SearchSession | null;
  setOutboundSession: (s: SearchSession) => void;
  setReturnSession: (s: SearchSession | null) => void;

  // Selected offers
  selectedOutboundOfferId: string | null;
  selectedReturnOfferId: string | null;
  setSelectedOutboundOfferId: (id: string | null) => void;
  setSelectedReturnOfferId: (id: string | null) => void;

  // Passengers
  passengerForms: Passenger[];
  passengerIds: string[];
  setPassengerForms: (forms: Passenger[]) => void;
  setPassengerIds: (ids: string[]) => void;

  // Services
  mealSelections: MealSelection[];
  baggageSelections: BaggageSelection[];
  seatSelections: SeatSelection[];
  returnMealSelections: MealSelection[];
  returnBaggageSelections: BaggageSelection[];
  returnSeatSelections: SeatSelection[];
  setMealSelections: (s: MealSelection[]) => void;
  setBaggageSelections: (s: BaggageSelection[]) => void;
  setSeatSelections: (s: SeatSelection[]) => void;
  setReturnMealSelections: (s: MealSelection[]) => void;
  setReturnBaggageSelections: (s: BaggageSelection[]) => void;
  setReturnSeatSelections: (s: SeatSelection[]) => void;

  // Payment
  outboundPaymentPayload: PaymentInquiryPayload | null;
  returnPaymentPayload: PaymentInquiryPayload | null;
  setOutboundPaymentPayload: (p: PaymentInquiryPayload | null) => void;
  setReturnPaymentPayload: (p: PaymentInquiryPayload | null) => void;

  // Done
  doneState: DoneState | null;
  setDoneState: (s: DoneState) => void;

  // Recent searches
  recentSearches: RecentSearch[];
  addRecentSearch: (s: RecentSearch) => void;
  deleteRecentSearch: (id: string) => void;
  loadRecentSearches: () => void;

  // Reset
  resetBooking: () => void;
}

// Suppress unused import warning
type _PassengerWithId = PassengerWithId;

const RECENT_SEARCHES_KEY = 'vikki_recent_searches';
const MAX_RECENT = 4;

function defaultDepartureDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 28);
  return d.toISOString().slice(0, 10);
}

function defaultReturnDate(departure: string): string {
  const d = new Date(departure);
  d.setDate(d.getDate() + 4);
  return d.toISOString().slice(0, 10);
}

const defaultDep = defaultDepartureDate();

const DEFAULT_CRITERIA: SearchCriteria = {
  tripType: 'round-trip',
  origin: null,
  destination: null,
  departureDate: defaultDep,
  returnDate: defaultReturnDate(defaultDep),
  passengers: { adults: 1, children: 0, infants: 0 },
};

const StoreContext = createContext<BookingStore | null>(null);
export { StoreContext };

export function useStore(): BookingStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export function useBookingStore(): BookingStore {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('search');
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(DEFAULT_CRITERIA);
  const [outboundSession, setOutboundSessionState] = useState<SearchSession | null>(null);
  const [returnSession, setReturnSessionState] = useState<SearchSession | null>(null);
  const [selectedOutboundOfferId, setSelectedOutboundOfferIdState] = useState<string | null>(null);
  const [selectedReturnOfferId, setSelectedReturnOfferIdState] = useState<string | null>(null);
  const [passengerForms, setPassengerFormsState] = useState<Passenger[]>([]);
  const [passengerIds, setPassengerIdsState] = useState<string[]>([]);
  const [mealSelections, setMealSelectionsState] = useState<MealSelection[]>([]);
  const [baggageSelections, setBaggageSelectionsState] = useState<BaggageSelection[]>([]);
  const [seatSelections, setSeatSelectionsState] = useState<SeatSelection[]>([]);
  const [returnMealSelections, setReturnMealSelectionsState] = useState<MealSelection[]>([]);
  const [returnBaggageSelections, setReturnBaggageSelectionsState] = useState<BaggageSelection[]>([]);
  const [returnSeatSelections, setReturnSeatSelectionsState] = useState<SeatSelection[]>([]);
  const [outboundPaymentPayload, setOutboundPaymentPayloadState] = useState<PaymentInquiryPayload | null>(null);
  const [returnPaymentPayload, setReturnPaymentPayloadState] = useState<PaymentInquiryPayload | null>(null);
  const [doneState, setDoneStateValue] = useState<DoneState | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const navigate = useCallback((screen: ScreenId) => setCurrentScreen(screen), []);

  const setTripType = useCallback((t: TripType) => {
    setSearchCriteria((prev) => ({ ...prev, tripType: t }));
  }, []);

  const setOrigin = useCallback((a: Airport | null) => {
    setSearchCriteria((prev) => ({ ...prev, origin: a }));
  }, []);

  const setDestination = useCallback((a: Airport | null) => {
    setSearchCriteria((prev) => ({ ...prev, destination: a }));
  }, []);

  const setDepartureDate = useCallback((d: string) => {
    setSearchCriteria((prev) => {
      const newReturn = prev.returnDate < d ? defaultReturnDate(d) : prev.returnDate;
      return { ...prev, departureDate: d, returnDate: newReturn };
    });
  }, []);

  const setReturnDate = useCallback((d: string) => {
    setSearchCriteria((prev) => {
      const safeReturn = d < prev.departureDate ? defaultReturnDate(prev.departureDate) : d;
      return { ...prev, returnDate: safeReturn };
    });
  }, []);

  const setPassengers = useCallback((p: PassengerCount) => {
    setSearchCriteria((prev) => ({ ...prev, passengers: p }));
  }, []);

  const swapAirports = useCallback(() => {
    setSearchCriteria((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  }, []);

  const setOutboundSession = useCallback((s: SearchSession) => setOutboundSessionState(s), []);
  const setReturnSession = useCallback((s: SearchSession | null) => setReturnSessionState(s), []);
  const setSelectedOutboundOfferId = useCallback((id: string | null) => setSelectedOutboundOfferIdState(id), []);
  const setSelectedReturnOfferId = useCallback((id: string | null) => setSelectedReturnOfferIdState(id), []);
  const setPassengerForms = useCallback((forms: Passenger[]) => setPassengerFormsState(forms), []);
  const setPassengerIds = useCallback((ids: string[]) => setPassengerIdsState(ids), []);
  const setMealSelections = useCallback((s: MealSelection[]) => setMealSelectionsState(s), []);
  const setBaggageSelections = useCallback((s: BaggageSelection[]) => setBaggageSelectionsState(s), []);
  const setSeatSelections = useCallback((s: SeatSelection[]) => setSeatSelectionsState(s), []);
  const setReturnMealSelections = useCallback((s: MealSelection[]) => setReturnMealSelectionsState(s), []);
  const setReturnBaggageSelections = useCallback((s: BaggageSelection[]) => setReturnBaggageSelectionsState(s), []);
  const setReturnSeatSelections = useCallback((s: SeatSelection[]) => setReturnSeatSelectionsState(s), []);
  const setOutboundPaymentPayload = useCallback((p: PaymentInquiryPayload | null) => setOutboundPaymentPayloadState(p), []);
  const setReturnPaymentPayload = useCallback((p: PaymentInquiryPayload | null) => setReturnPaymentPayloadState(p), []);
  const setDoneState = useCallback((s: DoneState) => setDoneStateValue(s), []);

  const loadRecentSearches = useCallback(() => {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentSearch[];
        setRecentSearches(parsed.slice(0, MAX_RECENT));
      }
    } catch {
      // localStorage unavailable — silently skip
    }
  }, []);

  const addRecentSearch = useCallback((s: RecentSearch) => {
    setRecentSearches((prev) => {
      const deduped = prev.filter(
        (r) =>
          !(r.origin.code === s.origin.code &&
            r.destination.code === s.destination.code &&
            r.departureDate === s.departureDate &&
            r.returnDate === s.returnDate)
      );
      const updated = [s, ...deduped].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const deleteRecentSearch = useCallback((id: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const resetBooking = useCallback(() => {
    setCurrentScreen('search');
    setOutboundSessionState(null);
    setReturnSessionState(null);
    setSelectedOutboundOfferIdState(null);
    setSelectedReturnOfferIdState(null);
    setPassengerFormsState([]);
    setPassengerIdsState([]);
    setMealSelectionsState([]);
    setBaggageSelectionsState([]);
    setSeatSelectionsState([]);
    setReturnMealSelectionsState([]);
    setReturnBaggageSelectionsState([]);
    setReturnSeatSelectionsState([]);
    setOutboundPaymentPayloadState(null);
    setReturnPaymentPayloadState(null);
    setDoneStateValue(null);
  }, []);

  const _ref = useRef(null);
  void _ref;

  return {
    currentScreen,
    navigate,
    searchCriteria,
    setTripType,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    setPassengers,
    swapAirports,
    outboundSession,
    returnSession,
    setOutboundSession,
    setReturnSession,
    selectedOutboundOfferId,
    selectedReturnOfferId,
    setSelectedOutboundOfferId,
    setSelectedReturnOfferId,
    passengerForms,
    passengerIds,
    setPassengerForms,
    setPassengerIds,
    mealSelections,
    baggageSelections,
    seatSelections,
    returnMealSelections,
    returnBaggageSelections,
    returnSeatSelections,
    setMealSelections,
    setBaggageSelections,
    setSeatSelections,
    setReturnMealSelections,
    setReturnBaggageSelections,
    setReturnSeatSelections,
    outboundPaymentPayload,
    returnPaymentPayload,
    setOutboundPaymentPayload,
    setReturnPaymentPayload,
    doneState,
    setDoneState,
    recentSearches,
    addRecentSearch,
    deleteRecentSearch,
    loadRecentSearches,
    resetBooking,
  };
}
