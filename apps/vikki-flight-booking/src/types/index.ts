
export type ScreenId =
  | 'search'
  | 'results'
  | 'results-return'
  | 'passengers'
  | 'services'
  | 'review'
  | 'checkout'
  | 'payment-pending'
  | 'payment-success'
  | 'payment-failed'
  | 'payment-partial'
  | 'hold-expired';

export type TripType = 'oneway' | 'round';

export interface Airport {
  code: string;
  name: string;
  city: string;
}

export interface CityPair {
  origin: string;
  destination: string;
}

export interface FlightOffer {
  offerId: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
}

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export interface PassengerInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  documentNumber: string;
  phone: string;
  type: 'adult' | 'child' | 'infant';
}

export interface Session {
  sessionId: string;
  expiresAt: string;
  offers: FlightOffer[];
}

export interface BookingState {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate: string;
  passengerCount: PassengerCount;
  outboundSession: Session | null;
  returnSession: Session | null;
  selectedOutboundOffer: FlightOffer | null;
  selectedReturnOffer: FlightOffer | null;
  passengers: PassengerInfo[];
  passengerIds: string[];
  returnPassengerIds: string[];
  selectedServices: ServiceSelection[];
  selectedSeats: SeatSelection[];
  returnSelectedServices: ServiceSelection[];
  returnSelectedSeats: SeatSelection[];
  paymentInquiry: PaymentInquiry | null;
  paymentResult: PaymentResult | null;
  returnPaymentResult: PaymentResult | null;
  fallbackReason: string | null;
}

export interface ServiceSelection {
  passengerId: string;
  optionId: string;
  name: string;
  price: number;
}

export interface SeatSelection {
  passengerIndex: number;
  seatId: string;
  price: number;
}

export interface PaymentInquiry {
  bookingKey: string;
  amount: number;
}

export interface PaymentResult {
  status: 'success' | 'failed' | 'partial';
  transactionId?: string;
  bookingReference?: string;
  errorReason?: string;
  chargeStatusMessage?: string;
}

export interface HostRuntime {
  locale?: string;
  payment?: {
    startPayment: (params: Record<string, unknown>) => Promise<unknown>;
    polling: (params: Record<string, unknown>) => Promise<unknown>;
  };
}

export interface MiniAppProps {
  hostRuntime?: HostRuntime;
  basename?: string;
}
