export interface Airport {
  code: string;
  name: string;
  city: string;
  category: 'popular' | 'vietnam' | 'international';
}

export interface CityPair {
  origin: string;
  destination: string;
}

export interface FlightOfferResponse {
  offerId: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureAirport: string;
  arrivalAirport: string;
  departureAirportName: string;
  arrivalAirportName: string;
  airlineLogo: string;
  fareClassName: string;
  farePrice: number;
}

export interface SearchResponse {
  sessionId: string;
  expiresAt: string;
  offers: FlightOfferResponse[];
}

export interface AncillaryOption {
  optionId: string;
  name: string;
  unitPrice: number;
  category: 'meals' | 'baggage';
}

export interface SeatOption {
  seatId: string;
  row: number;
  col: string;
  state: 'available' | 'unavailable';
  priceAmount: number | null;
  isEmergency: boolean;
}

export interface SeatMapResponse {
  rows: SeatOption[][];
}

export interface PaymentInquiryPayload {
  bookingKey: string;
  amount: number;
}

export interface PaymentResult {
  paymentSessionId: string;
  transactionId: string | null;
  settledAt: string | null;
  viaHost: boolean;
  bookingCode: string;
}

export interface PaymentPollingResult {
  transactionId: string;
}
