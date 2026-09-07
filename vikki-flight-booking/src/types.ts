// Core domain types for Vikki Flight Booking

export type TripType = 'one-way' | 'round-trip';

export type PassengerType = 'adult' | 'child' | 'infant';

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
  fareId: string;
  name: string;
  priceAmount: number;
  availableSeats: number;
  baggageIncluded: string;
}

export interface FlightOffer {
  offerId: string;
  flightNumber: string;
  departureTime: string; // HH:MM
  arrivalTime: string;   // HH:MM
  durationMinutes: number;
  aircraft: string;
  stops: number;
  fareClasses: FareClass[];
}

export interface SearchResult {
  sessionId: string;
  expiresAt: string; // ISO 8601
  offers: FlightOffer[];
}

export interface Passenger {
  passengerId?: string;
  lastName: string;
  firstName: string;
  gender: 'M' | 'F';
  dateOfBirth: string | null; // ISO YYYY-MM-DD or null
  phone: string;
  email: string;
  type: PassengerType;
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

export interface AncillaryCatalog {
  meals: MealOption[];
  baggage: BaggageOption[];
}

export interface SeatInfo {
  seatNumber: string;
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
  priceAmount: number | null;
  available: boolean;
}

export interface MealSelection {
  optionId: string;
  quantity: number;
}

export interface BaggageSelection {
  optionId: string;
}

export interface SeatSelection {
  passengerIndex: number; // 1-based
  seatNumber: string;
  priceAmount: number;
}

export interface ServicesState {
  meals: MealSelection[];
  baggage: BaggageSelection | null;
  seats: SeatSelection[];
}

export interface PaymentInquiryPayload {
  bookingKey: string;
  amount: number;
}

export type PaymentResult = 'success' | 'failed' | 'partial' | 'simulated';

export interface BookingResult {
  paymentResult: PaymentResult;
  transactionId?: string;
  bookingCode?: string;
  returnBookingCode?: string;
  amount: number;
  timestamp: string;
  errorReason?: string;
  viaHost: boolean;
}

export interface RecentSearch {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  adultCount: number;
  childCount: number;
  infantCount: number;
}

export interface SearchCriteria {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
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
