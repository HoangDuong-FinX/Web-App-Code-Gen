export type Screen = 'search' | 'results' | 'results-return' | 'passengers' | 'services' | 'review' | 'checkout' | 'payment-pending' | 'payment-success' | 'payment-failed' | 'payment-partial' | 'hold-expired';

export interface Flight {
  id: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  airlineLogo?: string;
}

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export interface BookingState {
  tripType: 'oneway' | 'round';
  origin: string | null;
  destination: string | null;
  departureDate: string | null;
  returnDate: string | null;
  passengerCount: PassengerCount;
  sessionId: string | null;
  returnSessionId: string | null;
  expiresAt: string | null;
  offers: Flight[];
  returnOffers: Flight[];
  selectedOutboundFlight: Flight | null;
  selectedReturnFlight: Flight | null;
}