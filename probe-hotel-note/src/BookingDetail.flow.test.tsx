import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';
import { resetSaveNoteOutcome } from './fixtures/bookings';

describe('BookingDetail flow', () => {
  beforeEach(() => {
    resetSaveNoteOutcome();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    resetSaveNoteOutcome();
  });

  it('loads and displays booking detail', () => {
    render(<App />);
    const bookingButtons = screen.getAllByRole('button');
    const btn = bookingButtons.find((b) => b.textContent?.includes('Hanoi Grand Hotel'));
    if (btn) fireEvent.click(btn);
    expect(screen.getByText('Booking Details')).toBeInTheDocument();
  });

  it('updates character count on note input', () => {
    render(<App />);
    const bookingButtons = screen.getAllByRole('button');
    const btn = bookingButtons.find((b) => b.textContent?.includes('Hanoi Grand Hotel'));
    if (btn) fireEvent.click(btn);
    const noteInput = screen.getByLabelText(/note for this booking/i) as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    expect(screen.getByText(/9 \/ 200/)).toBeInTheDocument();
  });
});
