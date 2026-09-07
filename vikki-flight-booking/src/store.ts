// App state store — plain React state via context
// No global state library; lifted to the common ancestor (App.tsx).

import type {
  TripType,
  Airport,
  CityPair,
  FlightOffer,
  FareClass,
  Passenger,
  PassengerType,
  AncillaryCatalog,
  SeatInfo,
  MealSelection,
  BaggageSelection,
  SeatSelection,
  BookingResult,
  SearchCriteria,
  RecentSearch,
  ScreenId,
} from './types';
import { createContext, useContext } from 'react';

export interface BookingState {
  // Navigation
  currentScreen: ScreenId;

  // Master data
  airports: Airport[];
  cityPairs: CityPair[];
  masterDataLoaded: boolean;
  masterDataError: string | null;

  // Search criteria
  searchCriteria: SearchCriteria;

  // Search results
  outboundSessionId: string | null;
  returnSessionId: string | null;
  expiresAt: string | null; // ISO 8601 — earliest expiry for round-trip
  outboundOffers: FlightOffer[];
  returnOffers: FlightOffer[];
  dailyPrices: Record<string, number>;

  // Selected offers
  selectedOutboundOffer: FlightOffer | null;
  selectedOutboundFare: FareClass | null;
  selectedReturnOffer: FlightOffer | null;
  selectedReturnFare: FareClass | null;

  // Passengers
  passengers: Passenger[];

  // Services
  outboundAncillaryCatalog: AncillaryCatalog | null;
  returnAncillaryCatalog: AncillaryCatalog | null;
  seatMap: SeatInfo[];
  outboundMeals: MealSelection[];
  outboundBaggage: BaggageSelection | null;
  outboundSeats: SeatSelection[];
  returnMeals: MealSelection[];
  returnBaggage: BaggageSelection | null;
  returnSeats: SeatSelection[];

  // Payment
  outboundBookingKey: string | null;
  returnBookingKey: string | null;
  bookingResult: BookingResult | null;

  // Recent searches
  recentSearches: RecentSearch[];

  // Host runtime (fixture: defaults)
  hostName: string | null;
  hostTheme: 'light' | 'dark';
}

export const DEFAULT_SEARCH_CRITERIA: SearchCriteria = {
  tripType: 'round-trip',
  origin: 'SGN',
  destination: 'DLI',
  departureDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    return d.toISOString().split('T')[0];
  })(),
  returnDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 32);
    return d.toISOString().split('T')[0];
  })(),
  adultCount: 2,
  childCount: 1,
  infantCount: 0,
};

export function buildInitialPassengers(criteria: SearchCriteria): Passenger[] {
  const passengers: Passenger[] = [];
  const addPax = (type: PassengerType, count: number) => {
    for (let i = 0; i < count; i++) {
      passengers.push({
        lastName: '',
        firstName: '',
        gender: 'M',
        dateOfBirth: null,
        phone: '',
        email: '',
        type,
      });
    }
  };
  addPax('adult', criteria.adultCount);
  addPax('child', criteria.childCount);
  addPax('infant', criteria.infantCount);
  return passengers;
}

export function calculateTotal(
  outboundFare: FareClass | null,
  returnFare: FareClass | null,
  criteria: SearchCriteria,
  outboundMeals: MealSelection[],
  outboundBaggage: BaggageSelection | null,
  outboundSeats: SeatSelection[],
  returnMeals: MealSelection[],
  returnBaggage: BaggageSelection | null,
  returnSeats: SeatSelection[],
  ancillaryCatalog: AncillaryCatalog | null,
  returnAncillaryCatalog: AncillaryCatalog | null,
): number {
  if (!outboundFare) return 0;

  const paxCount = criteria.adultCount + criteria.childCount;
  let fareTotal = outboundFare.priceAmount;
  if (returnFare) fareTotal += returnFare.priceAmount;
  let ticketTotal = fareTotal * paxCount;
  if (criteria.infantCount >= 1) ticketTotal += outboundFare.priceAmount * 0.1;

  let servicesTotal = 0;
  const getMealPrice = (optionId: string, catalog: AncillaryCatalog | null): number => {
    if (!catalog) return 0;
    return catalog.meals.find(m => m.optionId === optionId)?.priceAmount ?? 0;
  };
  const getBaggagePrice = (optionId: string, catalog: AncillaryCatalog | null): number => {
    if (!catalog) return 0;
    return catalog.baggage.find(b => b.optionId === optionId)?.priceAmount ?? 0;
  };

  for (const meal of outboundMeals) {
    servicesTotal += getMealPrice(meal.optionId, ancillaryCatalog) * meal.quantity;
  }
  if (outboundBaggage) {
    servicesTotal += getBaggagePrice(outboundBaggage.optionId, ancillaryCatalog);
  }
  for (const meal of returnMeals) {
    servicesTotal += getMealPrice(meal.optionId, returnAncillaryCatalog) * meal.quantity;
  }
  if (returnBaggage) {
    servicesTotal += getBaggagePrice(returnBaggage.optionId, returnAncillaryCatalog);
  }

  const seatsTotal =
    outboundSeats.reduce((s, seat) => s + seat.priceAmount, 0) +
    returnSeats.reduce((s, seat) => s + seat.priceAmount, 0);

  return ticketTotal + servicesTotal + seatsTotal;
}

export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}p`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}p`;
}

export function isHoldExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date() > new Date(expiresAt);
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.abs(Math.sin(Date.now() + i) * chars.length)) % chars.length];
  }
  return code;
}

export interface AppContextValue {
  state: BookingState;
  navigate: (screen: ScreenId) => void;
  setState: React.Dispatch<React.SetStateAction<BookingState>>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
