import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';
import { setSaveOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSaveOutcome('success');
});

describe('App Navigation Flow', () => {
  it('should mount and render bookings list', () => {
    render(<App />);
    expect(screen.getByText('My Hotel Bookings')).toBeTruthy();
  });

  it('should navigate from bookings-list to booking-detail on booking select', async () => {
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    expect(grandPlazaButton).toBeTruthy();
    fireEvent.click(grandPlazaButton);
    const bookingTitle = await screen.findByText('Booking Details');
    expect(bookingTitle).toBeTruthy();
  });
});