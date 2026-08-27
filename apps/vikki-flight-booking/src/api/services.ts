// This file extends src/api/index.ts from batch 1.

import type { ServiceSelection, SeatSelection } from '../types';

const BOOKING_SERVICE_BASE = import.meta.env.VITE_BOOKING_SERVICE_BASE ?? '/api/booking';

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

// --- Ancillary Options ---

export interface AncillaryOption {
  option_id: string;
  title: string;
  description: string;
  unit_price: number;
  category: string; // 'meal' | 'baggage' | 'insurance' | 'seat'
  icon: string;
}

export interface AncillaryOptionsResponse {
  options: AncillaryOption[];
}

export async function fetchAncillaryOptions(sessionId: string): Promise<AncillaryOptionsResponse> {
  return request<AncillaryOptionsResponse>(
    `${BOOKING_SERVICE_BASE}/sessions/${encodeURIComponent(sessionId)}/ancillary-options`
  );
}

// --- Seat Options ---

export interface SeatOption {
  seat_id: string;
  row: number;
  column: string;
  zone: string;
  price_amount: number | null; // null = not selectable per BR-08
}

export interface SeatOptionsResponse {
  seats: SeatOption[];
}

export async function fetchSeatOptions(sessionId: string): Promise<SeatOptionsResponse> {
  return request<SeatOptionsResponse>(
    `${BOOKING_SERVICE_BASE}/sessions/${encodeURIComponent(sessionId)}/seat-options`
  );
}

// --- Submit Ancillary Selections ---

export interface AncillarySelectionPayload {
  passenger_id: string;
  option_id: string;
}

export async function submitAncillarySelections(
  sessionId: string,
  selections: AncillarySelectionPayload[]
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(
    `${BOOKING_SERVICE_BASE}/sessions/${encodeURIComponent(sessionId)}/ancillary-selections`,
    {
      method: 'POST',
      body: JSON.stringify({ selections }),
    }
  );
}

// --- Submit Seat Selections ---

export interface SeatSelectionPayload {
  passenger_index: number;
  seat_id: string;
}

export async function submitSeatSelections(
  sessionId: string,
  seats: SeatSelectionPayload[]
): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(
    `${BOOKING_SERVICE_BASE}/sessions/${encodeURIComponent(sessionId)}/seat-selections`,
    {
      method: 'POST',
      body: JSON.stringify({ seats }),
    }
  );
}

// --- Payment Inquiry ---

export interface PaymentInquiryResponse {
  bookingKey: string;
  amount: number;
}

export async function fetchPaymentInquiry(sessionId: string): Promise<PaymentInquiryResponse> {
  return request<PaymentInquiryResponse>(
    `${BOOKING_SERVICE_BASE}/sessions/${encodeURIComponent(sessionId)}/payment-inquiry-payload`
  );
}
