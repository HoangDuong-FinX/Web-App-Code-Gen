import { render, screen, cleanup } from '@testing-library/react';
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
    await new Promise((resolve) => setTimeout(resolve, 400));
    const heading = screen.getByRole('heading', { name: /my hotel bookings/i });
    expect(heading).toBeDefined();
  });

  it('should display booking items after loading', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const hotelName = screen.queryByText(/Grand Hotel Hanoi/i);
    expect(hotelName).toBeDefined();
  });

  it('should show error when bookings fail to load', async () => {
    setBookingsOutcome('fail');
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const errorMsg = screen.queryByRole('alert');
    expect(errorMsg).toBeDefined();
  });
});
