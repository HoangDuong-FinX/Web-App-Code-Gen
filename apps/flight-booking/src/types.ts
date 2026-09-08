export interface Airport {
  code: string;
  name: string;
  group: 'popular' | 'vietnam' | 'international';
}

export interface CityPair {
  origin_code: string;
  destination_code: string;
}

export interface Flight {
  offer_id: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  stops: number;
  aircraft: string;
  fares: Fare[];
}

export interface Fare {
  fare_class: string;
  price_amount: number;
  available: boolean;
}

export interface Session {
  session_id: string;
  expires_at: string;
  offers: Flight[];
}

export interface Traveller {
  last_name: string;
  first_middle_name: string;
  gender: 'Male' | 'Female';
  date_of_birth: string;
  phone: string;
  email: string;
  passenger_id?: string;
}

export interface AncillaryItem {
  option_id: string;
  name: string;
  description: string;
  unit_price: number;
  group: 'meal' | 'baggage' | 'transfer';
}

export interface AncillarySelection {
  option_id: string;
  quantity: number;
}

export interface Seat {
  seat_id: string;
  row: number;
  column: string;
  available: boolean;
  price_amount: number | null;
  fare_tier: string | null;
}

export interface SeatSelection {
  passenger_index: number;
  seat_id: string;
  seat_label: string;
  price: number;
}

export interface PaymentPayload {
  bookingKey: string;
  amount: number;
}

export interface RecentSearch {
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string;
  adults: number;
  children: number;
  infants: number;
  tripType: 'one-way' | 'round-trip';
}

export type ScreenId = 'search' | 'results' | 'passengers' | 'services' | 'payment-review' | 'checkout' | 'done';

export type DoneStatus = 'success' | 'failure' | 'partial' | 'simulated';

export interface BookingState {
  tripType: 'one-way' | 'round-trip';
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  outboundSession: Session | null;
  returnSession: Session | null;
  selectedOutboundOffer: Flight | null;
  selectedOutboundFare: Fare | null;
  selectedReturnOffer: Flight | null;
  selectedReturnFare: Fare | null;
  travellers: Traveller[];
  outboundAncillarySelections: AncillarySelection[];
  returnAncillarySelections: AncillarySelection[];
  outboundSeatSelection: SeatSelection | null;
  returnSeatSelection: SeatSelection | null;
  doneStatus: DoneStatus;
  bookingCode: string;
  transactionId: string;
  paymentError: string;
  totalAmount: number;
}