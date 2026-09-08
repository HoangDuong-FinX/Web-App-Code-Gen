export interface Airport {
  code: string;
  name: string;
  cityName: string;
  countryCode: string;
}

export interface CityPair {
  origin: string;
  destination: string;
}

export type TripType = 'one-way' | 'round-trip';

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchCriteria {
  origin: Airport | null;
  destination: Airport | null;
  tripType: TripType;
  departureDate: string | null;
  returnDate: string | null;
  passengers: PassengerCounts;
}

export interface FareClass {
  classId: string;
  className: string;
  price: number;
  soldOut: boolean;
}

export interface Flight {
  flightCode: string;
  aircraftType: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  fareClasses: FareClass[];
}

export interface SearchSession {
  sessionId: string;
  expiresAt: string;
  flights: Flight[];
}

export interface SearchResult {
  outbound: SearchSession;
  inbound: SearchSession | null;
}

export interface DayPrice {
  date: string;
  price: number | null;
  hasFlights: boolean;
}

export interface PassengerForm {
  passengerType: 'adult' | 'child' | 'infant';
  lastName: string;
  firstMiddleName: string;
  gender: 'male' | 'female';
  dob: string;
  phone: string;
  email: string;
}

export interface AncillaryOption {
  optionId: string;
  groupCode: string;
  name: string;
  price: number;
  maxQty: number;
}

export interface AncillarySelection {
  optionId: string;
  quantity: number;
}

export interface SeatRow {
  row: number;
  seats: SeatCell[];
}

export interface SeatCell {
  code: string;
  price: number | null;
  unavailable: boolean;
  isEmergency: boolean;
}

export interface SeatSelection {
  passengerIndex: number;
  seatCode: string;
  price: number;
}

export interface PaymentPayload {
  bookingKey: string;
  amount: number;
  currency: string;
  merchantName: string;
  merchantDescription: string;
}

export type PaymentOutcome = 'success' | 'failed' | 'cancelled';

export interface PaymentResult {
  outcome: PaymentOutcome;
  transactionId: string | null;
  amount: number;
  bookingCode: string;
  failureReason?: string;
}

export interface RecentSearch {
  id: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate: string | null;
  tripType: TripType;
  passengers: PassengerCounts;
  summary: string;
}

export type ScreenId =
  | 'search'
  | 'airport-picker-modal'
  | 'date-picker-modal'
  | 'passenger-count-modal'
  | 'results'
  | 'passengers'
  | 'services'
  | 'seat-selection-sheet'
  | 'payment-review'
  | 'checkout'
  | 'done-success'
  | 'done-failed'
  | 'done-partial';

export interface BookingState {
  searchCriteria: SearchCriteria;
  searchResult: SearchResult | null;
  selectedOutboundFlight: Flight | null;
  selectedOutboundFare: FareClass | null;
  selectedInboundFlight: Flight | null;
  selectedInboundFare: FareClass | null;
  passengerForms: PassengerForm[];
  ancillaryOptions: AncillaryOption[];
  ancillarySelections: AncillarySelection[];
  seatSelections: SeatSelection[];
  inboundSeatSelections: SeatSelection[];
  paymentPayload: PaymentPayload | null;
  inboundPaymentPayload: PaymentPayload | null;
  paymentResult: PaymentResult | null;
  inboundPaymentResult: PaymentResult | null;
  vatRequested: boolean;
}
