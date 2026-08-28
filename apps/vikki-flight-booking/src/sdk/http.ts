import { FlightApiError, type SdkResponse } from '../types';

const WRAPPER_API_BASE = 'https://api.finx.com/data-wrapper';
const BOOKING_SERVICE_BASE = 'https://api.finx.com/fsap-booking';

interface SdkHttp {
  get<T>(url: string): Promise<SdkResponse<T>>;
  post<T>(url: string, body: unknown): Promise<SdkResponse<T>>;
}

function getSdkHttp(): SdkHttp | null {
  const w = window as unknown as { sdk?: { http?: SdkHttp } };
  return w.sdk?.http ?? null;
}

async function fallbackFetch<T>(url: string, options?: RequestInit): Promise<SdkResponse<T>> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return { isSuccess: false, error: { status: res.status, code: 'HTTP_ERROR', message: res.statusText } };
    }
    const data = await res.json() as T;
    return { isSuccess: true, data };
  } catch (e) {
    return { isSuccess: false, error: { status: 0, code: 'NETWORK_ERROR', message: (e as Error).message } };
  }
}

export async function httpGet<T>(path: string, surface: 'wrapper' | 'booking'): Promise<SdkResponse<T>> {
  const base = surface === 'wrapper' ? WRAPPER_API_BASE : BOOKING_SERVICE_BASE;
  const url = `${base}${path}`;
  const sdk = getSdkHttp();
  if (sdk) {
    return sdk.get<T>(url);
  }
  return fallbackFetch<T>(url);
}

export async function httpPost<T>(path: string, body: unknown, surface: 'wrapper' | 'booking'): Promise<SdkResponse<T>> {
  const base = surface === 'wrapper' ? WRAPPER_API_BASE : BOOKING_SERVICE_BASE;
  const url = `${base}${path}`;
  const sdk = getSdkHttp();
  if (sdk) {
    return sdk.post<T>(url, body);
  }
  return fallbackFetch<T>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function unwrap<T>(response: SdkResponse<T>): T {
  if (response.isSuccess && response.data !== undefined) {
    return response.data;
  }
  const err = response.error ?? { status: 0, code: 'UNKNOWN', message: 'Unknown error' };
  throw new FlightApiError(err.status, err.code, err.message);
}
