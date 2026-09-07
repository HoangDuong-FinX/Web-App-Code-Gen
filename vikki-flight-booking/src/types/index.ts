// src/types/index.ts
export type TripType = 'one-way' | 'round-trip';

export type Gender = 'M' | 'F';

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
  offer_id: string;
  flight_number: string;
  aircraft_type: string;
  departure_time: string; // HH:mm
  arrival_time: string;   // HH:mm
  duration_minutes: number;
  stops: number;
  fare_class: string;
  fare_label: string;
  price_amount: number;
  available_seats: number;
  baggage_allowance: string;
}

export interface SearchSession {
  session_id: string;
  expires_at: string; // ISO 8601
  offers: FlightOffer[];
}

export interface Passenger {
  last_name: string;
  first_name: string;
  gender: Gender;
  date_of_birth: string | null; // ISO YYYY-MM-DD or null
  phone: string | null;
  email: string | null;
}

export interface PassengerWithId extends Passenger {
  passenger_id: string;
}

export interface MealOption {
  option_id: string;
  name: string;
  price_amount: number;
  available: boolean;
}

export interface BaggageOption {
  option_id: string;
  name: string;
  price_amount: number;
  available: boolean;
}

export interface SeatOption {
  seat_number: string;
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
  price_amount: number | null;
  available: boolean;
}

export interface AncillaryCatalog {
  meals: MealOption[];
  baggage: BaggageOption[];
}

export interface MealSelection {
  passenger_id: string;
  option_id: string;
  quantity: number;
}

export interface BaggageSelection {
  passenger_id: string;
  option_id: string;
}

export interface SeatSelection {
  passenger_index: number; // 1-based
  seat_number: string;
  price_amount: number;
}

export interface PaymentInquiryPayload {
  booking_key: string;
  amount: number;
}

export type PaymentResult = 'success' | 'failed' | 'partial' | 'simulated';

export interface DoneState {
  result: PaymentResult;
  amount: number;
  bookingCode: string | null;
  returnBookingCode: string | null;
  transactionId: string | null;
  timestamp: string;
  errorMessage: string | null;
  viaHost: boolean;
}

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchCriteria {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string; // YYYY-MM-DD
  returnDate: string;    // YYYY-MM-DD
  passengers: PassengerCount;
}

export interface RecentSearch {
  id: string;
  tripType: TripType;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate: string;
  passengers: PassengerCount;
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
