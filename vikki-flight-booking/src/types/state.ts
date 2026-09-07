// Central state types for the Vikki Flight Booking app

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

export interface FlightOffer {
  offerId: string;
  flightNumber: string;
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  duration: string;      // e.g. "1h 45m"
  aircraft: string;
  fareClass: string;
  priceAmount: number;   // per seat in VND
  availableSeats: number;
  date: string;          // YYYY-MM-DD
  origin: string;
  destination: string;
}

export interface PassengerForm {
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  dob: string;    // YYYY-MM-DD or ''
  phone: string;
  email: string;
  emailError: boolean;
}

export interface PassengerInfo extends PassengerForm {
  passengerId: string; // pax_...
  type: 'adult' | 'child' | 'infant';
  index: number; // 1-based
}

export interface MealSelection {
  optionId: string;
  name: string;
  priceAmount: number;
  quantity: number;
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

export interface ServicesData {
  meals: MealSelection[];
  baggage: BaggageSelection | null;
  seats: SeatSelection[];
}

export type PaymentResult = 'success' | 'failed' | 'partial' | 'simulated';

export interface BookingResult {
  paymentResult: PaymentResult;
  outboundBookingCode: string;
  returnBookingCode?: string;
  transactionId?: string;
  amount: number;
  timestamp: string;
  errorMessage?: string;
  viaHost: boolean;
}

export interface RecentSearch {
  id: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  adults: number;
  children: number;
  infants: number;
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

export interface AppState {
  screen: ScreenId;
  // Search criteria
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string; // YYYY-MM-DD
  returnDate: string;    // YYYY-MM-DD
  adults: number;
  children: number;
  infants: number;
  // Session
  sessionId: string;
  expiresAt: string; // ISO 8601
  // Offers
  outboundOffers: FlightOffer[];
  returnOffers: FlightOffer[];
  selectedOutboundOffer: FlightOffer | null;
  selectedReturnOffer: FlightOffer | null;
  // Passengers
  passengers: PassengerInfo[];
  // Services (per leg: outbound index 0, return index 1)
  outboundServices: ServicesData;
  returnServices: ServicesData;
  // Payment
  bookingKey: string;
  returnBookingKey: string;
  bookingResult: BookingResult | null;
  // UI
  masterDataError: string;
  searchError: string;
  passengerError: string;
  servicesError: string;
  checkoutError: string;
  checkoutLoadError: string;
  isSearching: boolean;
  isSubmittingPassengers: boolean;
  isSubmittingServices: boolean;
  isSubmittingPayment: boolean;
  // Master data
  airports: Airport[];
  cityPairs: CityPair[];
  masterDataLoaded: boolean;
}

export type AppAction =
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'SET_TRIP_TYPE'; tripType: TripType }
  | { type: 'SET_ORIGIN'; airport: Airport }
  | { type: 'SET_DESTINATION'; airport: Airport }
  | { type: 'SWAP_AIRPORTS' }
  | { type: 'SET_DEPARTURE_DATE'; date: string }
  | { type: 'SET_RETURN_DATE'; date: string }
  | { type: 'SET_PASSENGERS_COUNT'; adults: number; children: number; infants: number }
  | { type: 'SET_MASTER_DATA'; airports: Airport[]; cityPairs: CityPair[] }
  | { type: 'SET_MASTER_DATA_ERROR'; error: string }
  | { type: 'SET_SEARCH_ERROR'; error: string }
  | { type: 'SET_SEARCHING'; value: boolean }
  | { type: 'SET_SESSION'; sessionId: string; expiresAt: string; outboundOffers: FlightOffer[] }
  | { type: 'SET_RETURN_OFFERS'; returnOffers: FlightOffer[] }
  | { type: 'SELECT_OUTBOUND_OFFER'; offer: FlightOffer }
  | { type: 'SELECT_RETURN_OFFER'; offer: FlightOffer }
  | { type: 'SET_PASSENGERS'; passengers: PassengerInfo[] }
  | { type: 'SET_PASSENGER_ERROR'; error: string }
  | { type: 'SET_SUBMITTING_PASSENGERS'; value: boolean }
  | { type: 'SET_OUTBOUND_SERVICES'; services: ServicesData }
  | { type: 'SET_RETURN_SERVICES'; services: ServicesData }
  | { type: 'SET_SERVICES_ERROR'; error: string }
  | { type: 'SET_SUBMITTING_SERVICES'; value: boolean }
  | { type: 'SET_BOOKING_KEY'; bookingKey: string; returnBookingKey: string }
  | { type: 'SET_CHECKOUT_ERROR'; error: string }
  | { type: 'SET_CHECKOUT_LOAD_ERROR'; error: string }
  | { type: 'SET_SUBMITTING_PAYMENT'; value: boolean }
  | { type: 'SET_BOOKING_RESULT'; result: BookingResult }
  | { type: 'RESET' };
