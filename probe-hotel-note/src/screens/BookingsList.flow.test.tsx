import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { BookingsList } from './BookingsList';
import * as bookingsFixture from '../fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  bookingsFixture.resetBookingsFixture();
});

describe('BookingsList Flow', () => {
  it('loads and displays bookings on mount', async () => {
    const onSelectBooking = vi.fn();
    render(<BookingsList onSelectBooking={onSelectBooking} />);

    expect(screen.getByText('Loading...')).toBeDefined();

    await vi.waitFor(() => {
      expect(screen.getByText('Grand Hotel Hanoi')).toBeDefined();
    });

    expect(screen.getByText('Beachfront Resort')).toBeDefined();
    expect(screen.getByText('City Center Inn')).toBeDefined();
  });

  it('navigates to booking detail when a booking is selected', async () => {
    const onSelectBooking = vi.fn();
    render(<BookingsList onSelectBooking={onSelectBooking} />);

    await vi.waitFor(() => {
      expect(screen.getByText('Grand Hotel Hanoi')).toBeDefined();
    });

    const bookingButton = screen.getAllByRole('button')[0];
    fireEvent.click(bookingButton);

    expect(onSelectBooking).toHaveBeenCalled();
  });

  it('shows empty state when no bookings exist', async () => {
    bookingsFixture.setBookingsFixture([]);
    const onSelectBooking = vi.fn();
    render(<BookingsList onSelectBooking={onSelectBooking} />);

    await vi.waitFor(() => {
      const loading = screen.queryByText('Loading...');
      expect(!loading).toBe(true);
    });

    expect(screen.getByText('No bookings yet')).toBeDefined();
  });
});
