export type TripType = 'one-way' | 'round-trip';

export interface Airport {
  code: string;
  name: string;
  group: 'popular' | 'domestic' | 'international';
}

export interface CityPair {
  origin: string;
  destination: string;
}

export interface SearchCriteria {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
}

export interface RecentSearch {
  route: string;
  date: string;
  passengers: string;
  criteria: SearchCriteria;
}

export interface FareClass {
  fareClassName: string;
  offerId: string;
  priceAmount: number;
  available: boolean;
}

export interface Flight {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  originCode: string;
  destCode: string;
  fareClasses: FareClass[];
}

export interface SearchSession {
  sessionId: string;
  expiresAt: string;
  offers: Flight[];
}

export type PassengerType = 'adult' | 'child' | 'infant';

export interface PassengerDetail {
  lastName: string;
  firstName: string;
  gender: 'Nam' | 'N\u1eef';
  dateOfBirth: string;
  phone: string;
  email: string;
  type: PassengerType;
  isValid: boolean;
  passengerId: string;
}

export interface AncillaryOption {
  optionId: string;
  name: string;
  category: 'meal' | 'baggage';
  priceAmount: number;
}

export interface AncillarySelection {
  optionId: string;
  name: string;
  quantity: number;
  priceAmount: number;
}

export interface Seat {
  seatCode: string;
  row: number;
  column: string;
  available: boolean;
  priceAmount: number | null;
  priceTier: string;
}

export interface SeatSelection {
  seatCode: string;
  priceAmount: number;
}

export interface PaymentResult {
  status: 'success' | 'failed' | 'partial' | 'cancelled';
  bookingCode: string;
  returnBookingCode: string;
  transactionId: string | null;
  amount: number;
  failureReason: string;
  sdkError: string;
  simulated: boolean;
  vatRequested: boolean;
}

export type ScreenId =
  | 'search'
  | 'results'
  | 'results-expired'
  | 'passengers'
  | 'services'
  | 'seat-map'
  | 'payment'
  | 'checkout'
  | 'done-success'
  | 'done-failed'
  | 'done-partial';

export interface BookingState {
  currentScreen: ScreenId;
  searchCriteria: SearchCriteria;
  recentSearches: RecentSearch[];
  outboundSession: SearchSession | null;
  returnSession: SearchSession | null;
  selectedOutboundOffer: FareClass | null;
  selectedOutboundFlight: Flight | null;
  selectedReturnOffer: FareClass | null;
  selectedReturnFlight: Flight | null;
  passengers: PassengerDetail[];
  iAmPassenger: boolean;
  outboundAncillaries: AncillarySelection[];
  returnAncillaries: AncillarySelection[];
  outboundSeat: SeatSelection | null;
  returnSeat: SeatSelection | null;
  paymentResult: PaymentResult | null;
  vatRequested: boolean;
}
