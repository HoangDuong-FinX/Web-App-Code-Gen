// Domain types for Vikki Flight Booking

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

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchCriteria {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string; // ISO YYYY-MM-DD
  returnDate: string | null; // ISO YYYY-MM-DD, only for round-trip
  passengers: PassengerCounts;
}

export interface FlightOffer {
  offerId: string;
  flightNumber: string;
  aircraft: string;
  departureTime: string; // HH:MM
  arrivalTime: string;
  duration: string; // e.g. '1h 45m'
  stops: number;
  fareClass: string; // e.g. 'Eco', 'Business'
  priceAmount: number; // VND, per seat
  availableSeats: number;
  baggageInfo: string; // e.g. 'Xách tay 7kg và 01 túi xách nhỏ'
  departureDate: string; // ISO YYYY-MM-DD
  origin: string; // IATA
  destination: string; // IATA
}

export interface SearchSession {
  sessionId: string;
  expiresAt: string; // ISO 8601
  offers: FlightOffer[];
}

export interface PassengerInfo {
  passengerId: string | null; // returned by API after submission
  passengerIndex: number; // 1-based
  type: 'adult' | 'child' | 'infant';
  gender: 'M' | 'F';
  lastName: string;
  firstName: string;
  dateOfBirth: string | null; // ISO YYYY-MM-DD or null
  phone: string;
  email: string;
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
  seatNumber: string; // e.g. '1A'
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
  priceAmount: number | null;
  available: boolean;
}

export interface MealSelection {
  optionId: string;
  quantity: number;
  name: string;
  priceAmount: number;
}

export interface BaggageSelection {
  optionId: string;
  name: string;
  priceAmount: number;
}

export interface SeatSelection {
  passengerIndex: number; // 1-based
  seatNumber: string;
  priceAmount: number;
}

export interface LegServices {
  meals: MealSelection[];
  baggage: BaggageSelection[];
  seats: SeatSelection[];
}

export type PaymentResult = 'success' | 'failed' | 'partial' | 'simulated';

export interface BookingResult {
  paymentResult: PaymentResult;
  outboundBookingCode: string | null;
  returnBookingCode: string | null;
  transactionId: string | null;
  amount: number;
  timestamp: string; // ISO 8601
  errorMessage: string | null;
  viaHost: boolean;
}

export interface RecentSearch {
  id: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate: string | null;
  tripType: TripType;
  passengers: PassengerCounts;
}

// Navigation state machine screen IDs
export type ScreenId =
  | 'search'
  | 'results'
  | 'results-return'
  | 'passengers'
  | 'services'
  | 'payment'
  | 'checkout'
  | 'done';

// App-level state
export interface AppState {
  screen: ScreenId;
  searchCriteria: SearchCriteria;
  outboundSession: SearchSession | null;
  returnSession: SearchSession | null;
  selectedOutboundOffer: FlightOffer | null;
  selectedReturnOffer: FlightOffer | null;
  passengers: PassengerInfo[];
  outboundServices: LegServices;
  returnServices: LegServices;
  bookingKey: string | null;
  bookingResult: BookingResult | null;
  // UI state
  masterDataError: string | null;
  searchError: string | null;
  passengerError: string | null;
  servicesError: string | null;
  checkoutError: string | null;
}
