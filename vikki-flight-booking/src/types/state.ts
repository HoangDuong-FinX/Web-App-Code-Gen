// Application state types
export type TripType = 'one-way' | 'round-trip';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  group: 'Popular' | 'Vietnam' | 'International';
}

export interface CityPair {
  origin: string;
  destination: string;
}

export interface FareClass {
  fareClass: string;
  priceAmount: number;
  baggageInfo: string;
}

export interface FlightOffer {
  offerId: string;
  flightNumber: string;
  aircraft: string;
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  durationMin: number;
  stops: number;
  fareClasses: FareClass[];
}

export interface PassengerData {
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  dob: string; // ISO YYYY-MM-DD or empty
  phone: string;
  email: string;
  passengerId?: string; // from API response
}

export interface MealOption {
  optionId: string;
  name: string;
  priceAmount: number;
  available: boolean;
}

export interface BaggageOption {
  optionId: string;
  name: string;
  priceAmount: number;
  available: boolean;
}

export interface SeatOption {
  seatNumber: string;
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
  priceAmount: number | null;
  available: boolean;
}

export interface AncillarySelection {
  passengerId: string;
  optionId: string;
}

export interface SeatSelection {
  passengerIndex: number; // 1-based
  seatNumber: string;
}

export interface ServicesData {
  mealSelections: Record<string, number>; // optionId -> quantity
  baggageSelectionId: string | null;
  seatSelections: SeatSelection[];
}

export type PaymentResult = 'success' | 'failed' | 'partial' | 'simulated';

export interface BookingResult {
  paymentResult: PaymentResult;
  transactionId?: string;
  bookingCode?: string;
  amount: number;
  timestamp: string;
  errorMessage?: string;
  viaHost: boolean;
}

export interface SearchCriteria {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string; // YYYY-MM-DD
  returnDate: string;    // YYYY-MM-DD
  adults: number;
  children: number;
  infants: number;
}

export interface BookingSession {
  sessionId: string;
  expiresAt: string; // ISO timestamp
  offers: FlightOffer[];
}

export interface AppState {
  screen: ScreenId;
  searchCriteria: SearchCriteria;
  outboundSession: BookingSession | null;
  returnSession: BookingSession | null;
  selectedOutboundOffer: { offerId: string; fareClass: FareClass } | null;
  selectedReturnOffer: { offerId: string; fareClass: FareClass } | null;
  passengers: PassengerData[];
  passengerIds: string[];
  services: ServicesData;
  bookingKey: string | null;
  bookingResult: BookingResult | null;
  // Modal state
  modal: ModalState;
}

export type ScreenId =
  | 'search'
  | 'results'
  | 'results-return'
  | 'passengers'
  | 'services'
  | 'payment'
  | 'checkout'
  | 'done';

export type ModalId =
  | 'airport-picker-origin'
  | 'airport-picker-destination'
  | 'date-picker'
  | 'passenger-count'
  | 'seat-map'
  | 'meal-picker'
  | 'baggage-picker'
  | null;

export interface ModalState {
  open: ModalId;
}

export function defaultSearchCriteria(): SearchCriteria {
  const today = new Date();
  const dep = new Date(today);
  dep.setDate(dep.getDate() + 28);
  const ret = new Date(dep);
  ret.setDate(ret.getDate() + 4);
  return {
    tripType: 'round-trip',
    origin: null,
    destination: null,
    departureDate: dep.toISOString().slice(0, 10),
    returnDate: ret.toISOString().slice(0, 10),
    adults: 2,
    children: 1,
    infants: 0,
  };
}

export function defaultServicesData(): ServicesData {
  return {
    mealSelections: {},
    baggageSelectionId: null,
    seatSelections: [],
  };
}

export function initialAppState(): AppState {
  return {
    screen: 'search',
    searchCriteria: defaultSearchCriteria(),
    outboundSession: null,
    returnSession: null,
    selectedOutboundOffer: null,
    selectedReturnOffer: null,
    passengers: [],
    passengerIds: [],
    services: defaultServicesData(),
    bookingKey: null,
    bookingResult: null,
    modal: { open: null },
  };
}
