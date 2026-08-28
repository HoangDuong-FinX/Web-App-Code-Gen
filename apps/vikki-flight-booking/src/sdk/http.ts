import { Airport, CityPair, SearchResponse, AncillaryOption, SeatMapResponse, PaymentInquiryPayload } from '../types';
import { fixtureAirports } from '../fixtures/airports';
import { fixtureCityPairs } from '../fixtures/city-pairs';
import { fixtureSearchResults } from '../fixtures/search-results';
import { fixtureAncillaryOptions } from '../fixtures/ancillary-options';
import { fixtureSeatMap } from '../fixtures/seat-map';
import { fixturePaymentPayload } from '../fixtures/payment-payload';

export class FlightApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'FlightApiError';
  }
}

interface SdkHttpResponse {
  isSuccess: boolean;
  data?: unknown;
  status?: number;
  message?: string;
}

type SdkHttp = {
  get: (url: string, config?: Record<string, unknown>) => Promise<SdkHttpResponse>;
  post: (url: string, body: unknown, config?: Record<string, unknown>) => Promise<SdkHttpResponse>;
};

function getSdkHttp(): SdkHttp | null {
  const win = window as unknown as { sdk?: { http?: SdkHttp } };
  return win.sdk?.http ?? null;
}

function unwrap<T>(response: SdkHttpResponse): T {
  if (!response.isSuccess) {
    throw new FlightApiError(
      response.status ?? 500,
      'API_ERROR',
      response.message ?? 'Unknown error'
    );
  }
  return response.data as T;
}

const DATA_WRAPPER_BASE = 'https://api.finx.com.vn/data-wrapper';
const BOOKING_SERVICE_BASE = 'https://api.finx.com.vn/internal/vja';
const TIMEOUT = 40000;

export async function loadAirports(): Promise<Airport[]> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return fixtureAirports;
  }
  const response = await sdk.get(`${DATA_WRAPPER_BASE}/airports`, { timeout: TIMEOUT });
  return unwrap<Airport[]>(response);
}

export async function loadCityPairs(): Promise<CityPair[]> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return fixtureCityPairs;
  }
  const response = await sdk.get(`${DATA_WRAPPER_BASE}/city-pairs`, { timeout: TIMEOUT });
  return unwrap<CityPair[]>(response);
}

export async function submitSearch(params: {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: { adults: number; children: number; infants: number };
}): Promise<SearchResponse> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return fixtureSearchResults;
  }
  const response = await sdk.post(`${BOOKING_SERVICE_BASE}/search`, params, { timeout: TIMEOUT });
  return unwrap<SearchResponse>(response);
}

export async function submitPassengers(sessionId: string, passengers: Array<{
  lastName: string;
  firstName: string;
  gender: string;
  dob: string | null;
  phone: string | null;
  email: string | null;
}>): Promise<{ passengers: Array<{ passenger_id: string }> }> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return { passengers: passengers.map((_, i) => ({ passenger_id: `pax_${i + 1}` })) };
  }
  const response = await sdk.post(
    `${BOOKING_SERVICE_BASE}/sessions/${sessionId}/passengers`,
    { passengers },
    { timeout: TIMEOUT }
  );
  return unwrap<{ passengers: Array<{ passenger_id: string }> }>(response);
}

export async function loadAncillaryOptions(sessionId: string, offerId: string): Promise<AncillaryOption[]> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return fixtureAncillaryOptions;
  }
  const response = await sdk.get(
    `${BOOKING_SERVICE_BASE}/sessions/${sessionId}/ancillary-options?offer_id=${encodeURIComponent(offerId)}`,
    { timeout: TIMEOUT }
  );
  return unwrap<AncillaryOption[]>(response);
}

export async function loadSeatOptions(sessionId: string, offerId: string): Promise<SeatMapResponse> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return fixtureSeatMap;
  }
  const response = await sdk.get(
    `${BOOKING_SERVICE_BASE}/sessions/${sessionId}/seat-options?offer_id=${encodeURIComponent(offerId)}`,
    { timeout: TIMEOUT }
  );
  return unwrap<SeatMapResponse>(response);
}

export async function submitAncillarySelections(sessionId: string, selections: Array<{
  passenger_id: string;
  option_id: string;
}>): Promise<{ success: boolean }> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return { success: true };
  }
  const response = await sdk.post(
    `${BOOKING_SERVICE_BASE}/sessions/${sessionId}/ancillary-selections`,
    { selections },
    { timeout: TIMEOUT }
  );
  return unwrap<{ success: boolean }>(response);
}

export async function submitSeatSelections(sessionId: string, selections: Array<{
  passenger_index: number;
  seat_id: string;
}>): Promise<{ success: boolean }> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return { success: true };
  }
  const response = await sdk.post(
    `${BOOKING_SERVICE_BASE}/sessions/${sessionId}/seat-selections`,
    { selections },
    { timeout: TIMEOUT }
  );
  return unwrap<{ success: boolean }>(response);
}

export async function fetchPaymentInquiryPayload(sessionId: string): Promise<PaymentInquiryPayload> {
  const sdk = getSdkHttp();
  if (!sdk) {
    return fixturePaymentPayload;
  }
  const response = await sdk.get(
    `${BOOKING_SERVICE_BASE}/sessions/${sessionId}/payment-inquiry-payload`,
    { timeout: TIMEOUT }
  );
  return unwrap<PaymentInquiryPayload>(response);
}
