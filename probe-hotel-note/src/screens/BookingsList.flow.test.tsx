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

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(screen.getByText('Grand Hotel Hanoi')).toBeInTheDocument();
    });

    expect(screen.getByText('Beachfront Resort')).toBeInTheDocument();
    expect(screen.getByText('City Center Inn')).toBeInTheDocument();
  });

  it('navigates to booking detail when a booking is selected', async () => {
    const onSelectBooking = vi.fn();
    render(<BookingsList onSelectBooking={onSelectBooking} />);

    await vi.waitFor(() => {
      expect(screen.getByText('Grand Hotel Hanoi')).toBeInTheDocument();
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
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No bookings yet')).toBeInTheDocument();
  });
});
