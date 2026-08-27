import type { Airport, CityPair, Session, PassengerInfo } from '../types';

const BOOKING_SERVICE_BASE = import.meta.env.VITE_BOOKING_SERVICE_BASE ?? '/api/booking';
const DATA_WRAPPER_BASE = import.meta.env.VITE_DATA_WRAPPER_BASE ?? '/api/data';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`) as Error & { status: number; body?: unknown };
    (error as Error & { status: number }).status = response.status;
    try {
      (error as Error & { body?: unknown }).body = await response.json();
    } catch { /* ignore */ }
    throw error;
  }
  return response.json() as Promise<T>;
}

export async function fetchAirports(): Promise<Airport[]> {
  return request<Airport[]>(`${DATA_WRAPPER_BASE}/airports`);
}

export async function fetchCityPairs(): Promise<CityPair[]> {
  return request<CityPair[]>(`${DATA_WRAPPER_BASE}/city-pairs`);
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  adults: number;
  children: number;
  infants: number;
}

export interface SearchResponse {
  session_id: string;
  expires_at: string;
  offers: Array<{
    offer_id: string;
    airline: string;
    airline_logo: string;
    flight_number: string;
    departure_time: string;
    arrival_time: string;
    duration: string;
    stops: number;
    price_amount: number;
  }>;
}

export async function searchFlights(params: SearchParams): Promise<SearchResponse> {
  return request<SearchResponse>(`${BOOKING_SERVICE_BASE}/search`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export interface SubmitPassengersParams {
  sessionId: string;
  passengers: Array<{
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    documentNumber: string | null;
    phone: string;
  }>;
}

export interface SubmitPassengersResponse {
  passengers: Array<{ passenger_id: string }>;
}

export async function submitPassengers(params: SubmitPassengersParams): Promise<SubmitPassengersResponse> {
  return request<SubmitPassengersResponse>(
    `${BOOKING_SERVICE_BASE}/sessions/${encodeURIComponent(params.sessionId)}/passengers`,
    {
      method: 'POST',
      body: JSON.stringify({ passengers: params.passengers }),
    }
  );
}
