import type {
  Airport,
  CityPair,
  SearchResult,
  DayPrice,
  PassengerForm,
  AncillaryOption,
  AncillarySelection,
  SeatRow,
  SeatSelection,
  PaymentPayload,
  PaymentResult,
} from './types';

export interface SdkHttpResponse<T> {
  isSuccess: boolean;
  data: T | null;
  status: number;
  errorMessage: string | null;
}

interface SdkHttp {
  get<T>(url: string): Promise<SdkHttpResponse<T>>;
  post<T>(url: string, body: unknown): Promise<SdkHttpResponse<T>>;
  put<T>(url: string, body: unknown): Promise<SdkHttpResponse<T>>;
}

interface SdkPayment {
  startPayment(payload: { bookingKey: string; amount: number; currency: string }): Promise<PaymentResult>;
  polling(bookingKey: string): Promise<{ transactionId: string | null }>;
}

interface Sdk {
  http: SdkHttp;
  payment: SdkPayment;
}

let _sdk: Sdk | null = null;

export function setSdk(sdk: Sdk): void {
  _sdk = sdk;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

let _searchOutcome: 'success' | 'fail' = 'success';
export function setSearchOutcome(v: 'success' | 'fail'): void {
  _searchOutcome = v;
}

let _submitPassengersOutcome: 'success' | 'fail' = 'success';
export function setSubmitPassengersOutcome(v: 'success' | 'fail'): void {
  _submitPassengersOutcome = v;
}

let _saveServicesOutcome: 'success' | 'fail' = 'success';
export function setSaveServicesOutcome(v: 'success' | 'fail'): void {
  _saveServicesOutcome = v;
}

let _fetchPayloadOutcome: 'success' | 'fail' = 'success';
export function setFetchPayloadOutcome(v: 'success' | 'fail'): void {
  _fetchPayloadOutcome = v;
}

let _paymentOutcome: 'success' | 'failed' | 'cancelled' = 'success';
export function setPaymentOutcome(v: 'success' | 'failed' | 'cancelled'): void {
  _paymentOutcome = v;
}

let _viaHost = false;
export function setViaHost(v: boolean): void {
  _viaHost = v;
}
export function getViaHost(): boolean {
  return _viaHost;
}

function createFixtureSdk(): Sdk {
  let fixtureCache: {
    airports: typeof import('./fixtures/airports');
    flights: typeof import('./fixtures/flights');
    services: typeof import('./fixtures/services');
    seats: typeof import('./fixtures/seats');
  } | null = null;

  const ensureFixtures = async () => {
    if (!fixtureCache) {
      const [airports, flights, services, seats] = await Promise.all([
        import('./fixtures/airports'),
        import('./fixtures/flights'),
        import('./fixtures/services'),
        import('./fixtures/seats'),
      ]);
      fixtureCache = { airports, flights, services, seats };
    }
    return fixtureCache;
  };

  return {
    http: {
      async get<T>(url: string): Promise<SdkHttpResponse<T>> {
        await delay(300);
        const f = await ensureFixtures();
        if (url.includes('/airports')) {
          return { isSuccess: true, data: f.airports.fixtureAirports as unknown as T, status: 200, errorMessage: null };
        }
        if (url.includes('/city-pairs')) {
          return { isSuccess: true, data: f.airports.fixtureCityPairs as unknown as T, status: 200, errorMessage: null };
        }
        if (url.includes('/day-prices')) {
          return { isSuccess: true, data: f.flights.fixtureDayPrices as unknown as T, status: 200, errorMessage: null };
        }
        if (url.includes('/ancillary-options')) {
          return { isSuccess: true, data: f.services.fixtureAncillaryOptions as unknown as T, status: 200, errorMessage: null };
        }
        if (url.includes('/seat-options')) {
          return { isSuccess: true, data: f.seats.fixtureSeatRows as unknown as T, status: 200, errorMessage: null };
        }
        if (url.includes('/payment-inquiry-payload')) {
          if (_fetchPayloadOutcome === 'fail') {
            return { isSuccess: false, data: null, status: 500, errorMessage: 'Server error' };
          }
          const payload: PaymentPayload = {
            bookingKey: 'bk-' + Date.now(),
            amount: 1250000,
            currency: 'VND',
            merchantName: 'Vikki Flights',
            merchantDescription: 'Mua ve may bay',
          };
          return { isSuccess: true, data: payload as unknown as T, status: 200, errorMessage: null };
        }
        return { isSuccess: false, data: null, status: 404, errorMessage: 'Not found' };
      },
      async post<T>(url: string, _body: unknown): Promise<SdkHttpResponse<T>> {
        await delay(500);
        if (url.includes('/search')) {
          if (_searchOutcome === 'fail') {
            return { isSuccess: false, data: null, status: 500, errorMessage: 'Search failed' };
          }
          const f = await ensureFixtures();
          return { isSuccess: true, data: f.flights.fixtureSearchResult as unknown as T, status: 200, errorMessage: null };
        }
        if (url.includes('/passengers')) {
          if (_submitPassengersOutcome === 'fail') {
            return { isSuccess: false, data: null, status: 500, errorMessage: 'Submit failed' };
          }
          return { isSuccess: true, data: { passengerIds: ['p1', 'p2'] } as unknown as T, status: 200, errorMessage: null };
        }
        return { isSuccess: false, data: null, status: 404, errorMessage: 'Not found' };
      },
      async put<T>(url: string, _body: unknown): Promise<SdkHttpResponse<T>> {
        await delay(400);
        if (url.includes('/ancillary-selections') || url.includes('/seat-selections')) {
          if (_saveServicesOutcome === 'fail') {
            return { isSuccess: false, data: null, status: 500, errorMessage: 'Save failed' };
          }
          return { isSuccess: true, data: { ok: true } as unknown as T, status: 200, errorMessage: null };
        }
        return { isSuccess: false, data: null, status: 404, errorMessage: 'Not found' };
      },
    },
    payment: {
      async startPayment(payload): Promise<PaymentResult> {
        await delay(1000);
        if (_paymentOutcome === 'cancelled') {
          return { outcome: 'cancelled', transactionId: null, amount: payload.amount, bookingCode: '' };
        }
        if (_paymentOutcome === 'failed') {
          return { outcome: 'failed', transactionId: null, amount: payload.amount, bookingCode: 'BK-FAIL', failureReason: 'Insufficient funds' };
        }
        return {
          outcome: 'success',
          transactionId: _viaHost ? 'TXN-' + Date.now() : null,
          amount: payload.amount,
          bookingCode: 'BK-' + Date.now(),
        };
      },
      async polling(_bookingKey): Promise<{ transactionId: string | null }> {
        await delay(500);
        return { transactionId: _viaHost ? 'TXN-' + Date.now() : null };
      },
    },
  };
}

function getSdk(): Sdk {
  if (!_sdk) return createFixtureSdk();
  return _sdk;
}

const WRAPPER_BASE = 'https://api.example.com/finx-data-wrapper';
const BOOKING_BASE = 'https://api.example.com/fsap-booking-service/internal/vja';

export async function loadAirports(): Promise<SdkHttpResponse<Airport[]>> {
  return getSdk().http.get<Airport[]>(`${WRAPPER_BASE}/airports`);
}

export async function loadCityPairs(): Promise<SdkHttpResponse<CityPair[]>> {
  return getSdk().http.get<CityPair[]>(`${WRAPPER_BASE}/city-pairs`);
}

export async function searchFlights(
  origin: string, destination: string, departureDate: string,
  returnDate: string | null, adultCount: number, childCount: number, infantCount: number,
): Promise<SdkHttpResponse<SearchResult>> {
  return getSdk().http.post<SearchResult>(`${BOOKING_BASE}/search`, {
    origin, destination, departureDate, returnDate, adultCount, childCount, infantCount,
  });
}

export async function fetchDayPrices(sessionId: string): Promise<SdkHttpResponse<DayPrice[]>> {
  return getSdk().http.get<DayPrice[]>(`${BOOKING_BASE}/sessions/${sessionId}/day-prices`);
}

export async function submitPassengers(
  sessionId: string, passengers: PassengerForm[],
): Promise<SdkHttpResponse<{ passengerIds: string[] }>> {
  return getSdk().http.post<{ passengerIds: string[] }>(
    `${BOOKING_BASE}/sessions/${sessionId}/passengers`, { passengers },
  );
}

export async function loadAncillaryOptions(sessionId: string): Promise<SdkHttpResponse<AncillaryOption[]>> {
  return getSdk().http.get<AncillaryOption[]>(`${BOOKING_BASE}/sessions/${sessionId}/ancillary-options`);
}

export async function writeAncillarySelections(
  sessionId: string, selections: AncillarySelection[],
): Promise<SdkHttpResponse<{ ok: boolean }>> {
  return getSdk().http.put<{ ok: boolean }>(`${BOOKING_BASE}/sessions/${sessionId}/ancillary-selections`, { selections });
}

export async function loadSeatOptions(sessionId: string): Promise<SdkHttpResponse<SeatRow[]>> {
  return getSdk().http.get<SeatRow[]>(`${BOOKING_BASE}/sessions/${sessionId}/seat-options`);
}

export async function writeSeatSelections(
  sessionId: string, selections: SeatSelection[],
): Promise<SdkHttpResponse<{ ok: boolean }>> {
  return getSdk().http.put<{ ok: boolean }>(`${BOOKING_BASE}/sessions/${sessionId}/seat-selections`, { selections });
}

export async function fetchPaymentPayload(sessionId: string): Promise<SdkHttpResponse<PaymentPayload>> {
  return getSdk().http.get<PaymentPayload>(`${BOOKING_BASE}/sessions/${sessionId}/payment-inquiry-payload`);
}

export async function startPayment(bookingKey: string, amount: number, currency: string): Promise<PaymentResult> {
  return getSdk().payment.startPayment({ bookingKey, amount, currency });
}

export async function pollTransaction(bookingKey: string): Promise<{ transactionId: string | null }> {
  return getSdk().payment.polling(bookingKey);
}
