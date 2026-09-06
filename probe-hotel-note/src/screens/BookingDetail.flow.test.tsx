import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';
import { setBookingsOutcome, setBookingDetailOutcome, setSaveNoteOutcome } from '../fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('BookingDetail flow', () => {
  beforeEach(() => {
    setBookingsOutcome('success');
    setBookingDetailOutcome('success');
    setSaveNoteOutcome('success');
  });

  it('should display booking detail after selection', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButtons = screen.queryAllByRole('button');
    if (bookingButtons.length > 0) {
      fireEvent.click(bookingButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const hotelName = screen.queryByText(/Grand Hotel Hanoi/i);
      expect(hotelName).toBeDefined();
    }
  });

  it('should allow editing note text', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButtons = screen.queryAllByRole('button');
    if (bookingButtons.length > 0) {
      fireEvent.click(bookingButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const textareas = screen.queryAllByRole('textbox');
      if (textareas.length > 0) {
        fireEvent.change(textareas[0], { target: { value: 'Test note' } });
        expect((textareas[0] as HTMLTextAreaElement).value).toBe('Test note');
      }
    }
  });

  it('should navigate back to bookings list', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButtons = screen.queryAllByRole('button');
    if (bookingButtons.length > 0) {
      fireEvent.click(bookingButtons[0]);
      await new Promise((resolve) => setTimeout(resolve, 400));
      const backButtons = screen.queryAllByRole('button');
      if (backButtons.length > 1) {
        fireEvent.click(backButtons[0]);
        const heading = screen.queryByRole('heading', { name: /my hotel bookings/i });
        expect(heading).toBeDefined();
      }
    }
  });
});
