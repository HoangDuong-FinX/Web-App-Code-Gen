export interface Airport {
  airportCode: string;
  airportName: string;
  cityName: string;
}

export interface AirportGroup {
  groupName: string;
  airports: Airport[];
}

export interface CityPair {
  origin: string;
  destination: string;
}

export interface FareClass {
  fareClassName: string;
  priceAmount: number;
  available: boolean;
}

export interface FlightOffer {
  offerId: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fareClasses: FareClass[];
}

export interface SearchSession {
  sessionId: string;
  expiresAt: number;
  offers: FlightOffer[];
}

export interface PassengerForm {
  type: 'adult' | 'child' | 'infant';
  lastName: string;
  firstName: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
  email: string;
  passengerId?: string;
}

export interface AncillaryOption {
  optionId: string;
  name: string;
  category: 'meal' | 'baggage' | 'transfer';
  priceAmount: number;
  imageUrl: string;
}

export interface AncillarySelection {
  optionId: string;
  name: string;
  quantity: number;
  priceAmount: number;
}

export interface SeatInfo {
  seatId: string;
  row: number;
  column: string;
  available: boolean;
  priceAmount: number | null;
  fareTier: string;
}

export interface SeatSelection {
  passengerIndex: number;
  seatId: string;
  seatLabel: string;
  price: number;
}

export interface BookingResult {
  status: 'success' | 'failure' | 'partial';
  bookingCode: string;
  outboundBookingCode?: string;
  transactionId: string | null;
  amount: number;
  failureReason?: string;
  viaHost: boolean;
  vatRequested: boolean;
}

export interface DateChip {
  date: string;
  label: string;
  lowestPrice: number | null;
}

export type TripType = 'oneWay' | 'roundTrip';

export type ScreenId =
  | 'search'
  | 'airport-picker'
  | 'date-picker'
  | 'passenger-count'
  | 'results'
  | 'results-return'
  | 'passengers'
  | 'services'
  | 'meals-baggage'
  | 'seats'
  | 'review'
  | 'checkout'
  | 'done-success'
  | 'done-failure'
  | 'done-partial';
