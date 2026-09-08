import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DoneSuccessScreen } from './screens/DoneSuccessScreen';
import { DoneFailedScreen } from './screens/DoneFailedScreen';
import { DonePartialScreen } from './screens/DonePartialScreen';
import type { BookingState } from './types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const baseBooking: BookingState = {
  searchCriteria: {
    origin: { code: 'SGN', name: 'TSN', cityName: 'HCM', countryCode: 'VN' },
    destination: { code: 'HAN', name: 'NB', cityName: 'HN', countryCode: 'VN' },
    tripType: 'one-way',
    departureDate: '2026-01-15',
    returnDate: null,
    passengers: { adults: 1, children: 0, infants: 0 },
  },
  searchResult: null,
  selectedOutboundFlight: null,
  selectedOutboundFare: null,
  selectedInboundFlight: null,
  selectedInboundFare: null,
  passengerForms: [],
  ancillaryOptions: [],
  ancillarySelections: [],
  seatSelections: [],
  inboundSeatSelections: [],
  paymentPayload: null,
  inboundPaymentPayload: null,
  paymentResult: {
    outcome: 'success',
    transactionId: null,
    amount: 1250000,
    bookingCode: 'BK-123',
  },
  inboundPaymentResult: null,
  vatRequested: false,
};

describe('DoneSuccessScreen flow', () => {
  it('renders success state with booking code', () => {
    render(<DoneSuccessScreen booking={baseBooking} onBookAnother={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getByTestId('booking-code-row').textContent).toBe('BK-123');
    expect(screen.getByTestId('status-icon')).toBeTruthy();
  });

  it('shows simulated warning when not via host', () => {
    render(<DoneSuccessScreen booking={baseBooking} onBookAnother={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getByTestId('simulated-warning')).toBeTruthy();
  });

  it('book another calls onBookAnother', () => {
    const onBookAnother = vi.fn();
    render(<DoneSuccessScreen booking={baseBooking} onBookAnother={onBookAnother} onHome={vi.fn()} />);
    fireEvent.click(screen.getByTestId('book-another-action'));
    expect(onBookAnother).toHaveBeenCalledTimes(1);
  });

  it('home button calls onHome', () => {
    const onHome = vi.fn();
    render(<DoneSuccessScreen booking={baseBooking} onBookAnother={vi.fn()} onHome={onHome} />);
    fireEvent.click(screen.getByTestId('home-action'));
    expect(onHome).toHaveBeenCalledTimes(1);
  });
});

describe('DoneFailedScreen flow', () => {
  const failedBooking = {
    ...baseBooking,
    paymentResult: {
      outcome: 'failed' as const,
      transactionId: null,
      amount: 1250000,
      bookingCode: 'BK-FAIL',
      failureReason: 'Insufficient funds',
    },
  };

  it('renders failed state with failure reason', () => {
    render(<DoneFailedScreen booking={failedBooking} onRetry={vi.fn()} onHome={vi.fn()} />);
    expect(screen.getByTestId('failure-reason').textContent).toBe('Insufficient funds');
  });

  it('retry button calls onRetry', () => {
    const onRetry = vi.fn();
    render(<DoneFailedScreen booking={failedBooking} onRetry={onRetry} onHome={vi.fn()} />);
    fireEvent.click(screen.getByTestId('retry-action'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('home button calls onHome', () => {
    const onHome = vi.fn();
    render(<DoneFailedScreen booking={failedBooking} onRetry={vi.fn()} onHome={onHome} />);
    fireEvent.click(screen.getByTestId('home-action'));
    expect(onHome).toHaveBeenCalledTimes(1);
  });
});

describe('DonePartialScreen flow', () => {
  it('renders partial state with explanation', () => {
    render(<DonePartialScreen booking={baseBooking} onHome={vi.fn()} />);
    expect(screen.getByTestId('partial-explanation')).toBeTruthy();
  });

  it('home button calls onHome', () => {
    const onHome = vi.fn();
    render(<DonePartialScreen booking={baseBooking} onHome={onHome} />);
    fireEvent.click(screen.getByTestId('home-action'));
    expect(onHome).toHaveBeenCalledTimes(1);
  });
});
