import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { setBookingsOutcome, setBookingDetailOutcome } from '../fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('BookingsList flow', () => {
  beforeEach(() => {
    setBookingsOutcome('success');
    setBookingDetailOutcome('success');
  });

  it('should render bookings list on app load', async () => {
    render(<App />);
    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));
    const heading = screen.getByRole('heading', { name: /my hotel bookings/i });
    expect(heading).toBeInTheDocument();
  });

  it('should navigate to booking detail when a booking is selected', async () => {
    render(<App />);
    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    // Wait for detail to load
    await new Promise((resolve) => setTimeout(resolve, 400));
    const hotelName = screen.getByText(/Grand Hotel Hanoi/i);
    expect(hotelName).toBeInTheDocument();
  });

  it('should show error when bookings fail to load', async () => {
    setBookingsOutcome('fail');
    render(<App />);
    // Wait for load attempt
    await new Promise((resolve) => setTimeout(resolve, 400));
    const errorMsg = screen.getByRole('alert');
    expect(errorMsg).toHaveTextContent(/unable to load bookings/i);
  });
});
