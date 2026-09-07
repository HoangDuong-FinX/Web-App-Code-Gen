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

export interface Flight {
  offer_id: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  origin: string;
  destination: string;
  aircraft_type: string;
  fare_classes: FareClass[];
}

export interface FareClass {
  class_code: string;
  class_name: string;
  price_amount: number;
  available: boolean;
}

export interface Passenger {
  last_name: string;
  first_name: string;
  gender: 'm' | 'f' | 'o';
  date_of_birth: string | null;
  phone?: string;
  email?: string;
}

export interface PassengerWithId extends Passenger {
  passenger_id?: string;
  index?: number;
}

export interface AncillaryOption {
  option_id: string;
  name: string;
  price_amount: number;
}

export interface SeatOption {
  row: number;
  column: number;
  seat_label: string;
  available: boolean;
  price_amount: number | null;
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
}

export interface BookingSession {
  session_id: string;
  expires_at: string;
  offer_id?: string;
  passengers?: PassengerWithId[];
  ancillary_selections?: Record<string, string[]>;
  seat_selections?: Record<string, string>;
}