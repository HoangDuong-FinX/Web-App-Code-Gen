import React from 'react';

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
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  aircraft_type: string;
  stops: number;
}

export interface FareClass {
  cabin_class: string;
  price_amount: number;
  available_seats: number;
  baggage_allowance: string;
}

export interface FlightOffer {
  offer_id: string;
  flights: Flight[];
  fare_classes: FareClass[];
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

export interface Passenger {
  last_name: string;
  first_name: string;
  gender: 'M' | 'F';
  date_of_birth: string | null;
  phone: string | null;
  email: string | null;
  passenger_id?: string;
}

export interface AncillaryOption {
  option_id: string;
  name: string;
  price_amount: number;
  available: boolean;
}

export interface Seat {
  seat_number: string;
  zone: 'Front' | 'Premium' | 'Standard' | 'Relax';
  price_amount: number | null;
  available: boolean;
}

export interface BookingState {
  searchCriteria: SearchCriteria | null;
  outboundSession: Session | null;
  returnSession: Session | null;
  selectedOutboundOffer: FlightOffer | null;
  selectedReturnOffer: FlightOffer | null;
  passengers: Passenger[];
  paymentResult: 'success' | 'failed' | 'partial' | 'simulated' | null;
  transactionId: string | null;
  bookingCode: string | null;
  paymentError: string | null;
  viaHost: boolean;
}

export interface AppContextType {
  currentScreen: string;
  booking: BookingState;
  navigateTo: (screen: string) => void;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
}
