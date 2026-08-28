export type ScreenId =
  | 'search-home'
  | 'airport-picker'
  | 'date-picker'
  | 'passenger-picker'
  | 'select-flight'
  | 'select-return-flight'
  | 'booking-summary'
  | 'enter-passengers'
  | 'services-hub'
  | 'seat-map'
  | 'meal-selection'
  | 'baggage-selection'
  | 'review-detail'
  | 'checkout-pay'
  | 'result-success'
  | 'result-failure'
  | 'result-partial'
  | 'hold-expired'
  | 'error-master-data';

export type TripType = 'oneway' | 'round';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  group: 'popular' | 'vietnam' | 'international';
}

export interface CityPair {
  origin: string;
  destination: string;
}

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCounts;
  tripType: TripType;
}

export interface FlightOffer {
  offerId: string;
  flightCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  cabinClass: string;
  seatsRemaining: number;
}

export interface SearchSession {
  sessionId: string;
  expiresAt: string;
  offers: FlightOffer[];
}

export interface PassengerData {
  lastName: string;
  firstName: string;
  gender: 'male' | 'female' | '';
  dateOfBirth: string;
  phone: string;
  email: string;
  passengerId?: string;
}

export interface AncillaryOption {
  optionId: string;
  name: string;
  category: 'meal' | 'baggage';
  unitPrice: number;
}

export interface AncillarySelection {
  optionId: string;
  passengerId: string;
}

export interface SeatOption {
  row: number;
  col: number;
  seatCode: string;
  available: boolean;
  priceAmount: number | null;
}

export interface SeatSelection {
  passengerIndex: number;
  seatCode: string;
}

export interface PaymentInquiryPayload {
  bookingKey: string;
  amount: number;
}

export interface PaymentResult {
  isSuccess: boolean;
  paymentSessionId?: string;
  error?: { code: string; message: string };
}

export interface RecentSearch {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: PassengerCounts;
  tripType: TripType;
}

export interface SdkResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: { status: number; code: string; message: string };
}

export class FlightApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'FlightApiError';
    this.status = status;
    this.code = code;
  }
}

export interface HostIdentity {
  id: string;
  name: string;
}

export interface BookingState {
  tripType: TripType;
  searchParams: SearchParams | null;
  outboundSession: SearchSession | null;
  returnSession: SearchSession | null;
  selectedOutboundOffer: FlightOffer | null;
  selectedReturnOffer: FlightOffer | null;
  passengers: PassengerData[];
  ancillarySelections: AncillarySelection[];
  seatSelections: SeatSelection[];
  returnAncillarySelections: AncillarySelection[];
  returnSeatSelections: SeatSelection[];
  vatRequested: boolean;
  bookingKeys: { outbound?: string; return?: string };
  paymentResult: PaymentResult | null;
  transactionId: string | null;
}

export interface ScreenProps {
  booking: BookingState;
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
  navigate: (target: ScreenId) => void;
  airports: Airport[];
  cityPairs: CityPair[];
  masterDataLoading: boolean;
  masterDataError: boolean;
  loadMasterData: () => void;
  recentSearches: RecentSearch[];
  setRecentSearches: React.Dispatch<React.SetStateAction<RecentSearch[]>>;
  airportPickerMode: 'origin' | 'destination';
  setAirportPickerMode: React.Dispatch<React.SetStateAction<'origin' | 'destination'>>;
  handleSearch: (params: SearchParams) => Promise<void>;
  searchLoading: boolean;
  handleSelectOutbound: (offer: FlightOffer) => void;
  handleSelectReturn: (offer: FlightOffer) => void;
  handleSubmitPassengers: (passengers: PassengerData[]) => Promise<{ success: boolean }>;
  handlePay: () => Promise<void>;
  ancillaryOptions: AncillaryOption[];
  setAncillaryOptions: React.Dispatch<React.SetStateAction<AncillaryOption[]>>;
  returnAncillaryOptions: AncillaryOption[];
  setReturnAncillaryOptions: React.Dispatch<React.SetStateAction<AncillaryOption[]>>;
  resetBooking: () => void;
  paymentFailureReason: string;
  isReturn?: boolean;
}
