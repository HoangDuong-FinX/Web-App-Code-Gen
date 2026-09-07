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
  departure_time: string;
  arrival_time: string;
  aircraft_type: string;
  duration_minutes: number;
  available_seats: number;
  price_amount: number;
  stops: number;
}

export interface Passenger {
  last_name: string;
  first_name: string;
  gender: 'M' | 'F';
  date_of_birth?: string | null;
  phone?: string | null;
  email?: string | null;
  passenger_id?: string;
}

export interface SearchCriteria {
  trip_type: 'one-way' | 'round-trip';
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  adult_count: number;
  child_count: number;
  infant_count: number;
}

export interface Session {
  session_id: string;
  expires_at: string;
  offers: FlightOffer[];
}

export interface AppState {
  currentScreen: string;
  searchCriteria: SearchCriteria | null;
  outboundSession: Session | null;
  returnSession: Session | null;
  outboundOffer: FlightOffer | null;
  returnOffer: FlightOffer | null;
  passengers: Passenger[];
  hostIdentity: string | null;
  error: string | null;
  loading: boolean;
  paymentResult: 'success' | 'failed' | 'partial' | 'simulated' | null;
  bookingCode: string | null;
  transactionId: string | null;
}
