import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';

describe('BookingsList flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders bookings list on entry', () => {
    render(<App />);
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    const bookingButtons = screen.getAllByRole('button');
    expect(bookingButtons.length).toBeGreaterThan(0);
  });

  it('navigates to booking detail on select', () => {
    render(<App />);
    const bookingButtons = screen.getAllByRole('button');
    const btn = bookingButtons.find((b) => b.textContent?.includes('Hanoi Grand Hotel'));
    if (btn) {
      fireEvent.click(btn);
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    }
  });

  it('navigates back from booking detail', () => {
    render(<App />);
    const bookingButtons = screen.getAllByRole('button');
    const btn = bookingButtons.find((b) => b.textContent?.includes('Hanoi Grand Hotel'));
    if (btn) fireEvent.click(btn);
    const backButton = screen.getByRole('button', { name: /back to bookings/i });
    fireEvent.click(backButton);
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
  });
});
