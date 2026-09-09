import type { FlightOffer } from './types';
import { fixtureAirports } from './fixtures/airports';
import { fixtureCityPairs } from './fixtures/cityPairs';
import { generateFlightOffers, getSearchOutcome } from './fixtures/flights';
import { fixtureAncillaryMeals, fixtureAncillaryBaggage, getAncillaryOutcome } from './fixtures/ancillary';
import { generateSeatMap, getSeatOutcome } from './fixtures/seats';

interface SdkHttpResponse<T> {
  isSuccess: boolean;
  data?: T;
  error?: { status: number; code: string; message: string };
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export const sdk = {
  http: {
    async get<T>(endpoint: string): Promise<SdkHttpResponse<T>> {
      await delay(300);
      if (endpoint === '/airports') {
        return { isSuccess: true, data: fixtureAirports as unknown as T };
      }
      if (endpoint === '/city-pairs') {
        return { isSuccess: true, data: fixtureCityPairs as unknown as T };
      }
      if (endpoint.includes('/ancillary-options')) {
        if (getAncillaryOutcome() === 'fail') {
          return { isSuccess: false, error: { status: 500, code: 'INTERNAL', message: 'Service error' } };
        }
        const combined = [...fixtureAncillaryMeals, ...fixtureAncillaryBaggage];
        return { isSuccess: true, data: combined as unknown as T };
      }
      if (endpoint.includes('/seat-options')) {
        if (getSeatOutcome() === 'fail') {
          return { isSuccess: false, error: { status: 500, code: 'INTERNAL', message: 'Seat load error' } };
        }
        return { isSuccess: true, data: generateSeatMap() as unknown as T };
      }
      if (endpoint.includes('/payment-inquiry-payload')) {
        return { isSuccess: true, data: { bookingKey: 'BK-' + Date.now(), amount: 0 } as unknown as T };
      }
      return { isSuccess: false, error: { status: 404, code: 'NOT_FOUND', message: 'Unknown endpoint' } };
    },
    async post<T>(endpoint: string, body: unknown): Promise<SdkHttpResponse<T>> {
      await delay(400);
      if (endpoint === '/search') {
        if (getSearchOutcome() === 'fail') {
          return { isSuccess: false, error: { status: 500, code: 'SEARCH_ERROR', message: 'Search failed' } };
        }
        const b = body as { origin: string; destination: string };
        const offers: FlightOffer[] = generateFlightOffers(b.origin, b.destination);
        const result = {
          session_id: 'sess-' + Date.now(),
          expires_at: Date.now() + 15 * 60 * 1000,
          offers,
        };
        return { isSuccess: true, data: result as unknown as T };
      }
      if (endpoint.includes('/passengers')) {
        const b = body as { passengers: Array<{ lastName: string }> };
        const passengers = b.passengers.map((_p: { lastName: string }, i: number) => ({ passenger_id: `pax_${i + 1}` }));
        return { isSuccess: true, data: { passengers } as unknown as T };
      }
      if (endpoint.includes('/ancillary-selections')) {
        if (getAncillaryOutcome() === 'fail') {
          return { isSuccess: false, error: { status: 500, code: 'SAVE_ERROR', message: 'Save failed' } };
        }
        return { isSuccess: true, data: {} as unknown as T };
      }
      if (endpoint.includes('/seat-selections')) {
        if (getSeatOutcome() === 'fail') {
          return { isSuccess: false, error: { status: 500, code: 'SAVE_ERROR', message: 'Save failed' } };
        }
        return { isSuccess: true, data: {} as unknown as T };
      }
      return { isSuccess: false, error: { status: 404, code: 'NOT_FOUND', message: 'Unknown endpoint' } };
    },
  },
  payment: {
    available: true,
    async startPayment(_params: {
      transactionType: string;
      provider: string;
      sessionId: string;
      offerId: string;
    }): Promise<{ paymentSessionId: string; status: 'success' | 'cancelled' | 'rejected' }> {
      await delay(500);
      if (!sdk.payment.available) {
        throw new Error('CAPABILITY_NOT_AVAILABLE');
      }
      return { paymentSessionId: 'pay-' + Date.now(), status: getPaymentOutcome() };
    },
    async polling(_paymentSessionId: string): Promise<{ transactionId: string | null }> {
      await delay(200);
      return { transactionId: 'TXN-' + Date.now() };
    },
  },
};

let paymentOutcome: 'success' | 'cancelled' | 'rejected' = 'success';
export function setPaymentOutcome(outcome: 'success' | 'cancelled' | 'rejected'): void {
  paymentOutcome = outcome;
}
export function getPaymentOutcome(): 'success' | 'cancelled' | 'rejected' {
  return paymentOutcome;
}
