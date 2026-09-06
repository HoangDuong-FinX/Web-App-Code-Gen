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
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const hotelName = screen.getByText(/Grand Hotel Hanoi/i);
    expect(hotelName).toBeDefined();
  });

  it('should allow editing note text', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const textarea = screen.getByRole('textbox', { name: /personal note/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    expect((textarea as HTMLTextAreaElement).value).toBe('Test note');
  });

  it('should save note and remain on detail screen on success', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const textarea = screen.getByRole('textbox', { name: /personal note/i });
    fireEvent.change(textarea, { target: { value: 'New note' } });
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const hotelName = screen.getByText(/Grand Hotel Hanoi/i);
    expect(hotelName).toBeDefined();
  });

  it('should navigate to save-failed screen on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const textarea = screen.getByRole('textbox', { name: /personal note/i });
    fireEvent.change(textarea, { target: { value: 'New note' } });
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeDefined();
  });

  it('should preserve note text and allow retry on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const textarea = screen.getByRole('textbox', { name: /personal note/i });
    fireEvent.change(textarea, { target: { value: 'Failed note' } });
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const failedTextarea = screen.getByRole('textbox', { name: /personal note/i });
    expect((failedTextarea as HTMLTextAreaElement).value).toBe('Failed note');
  });

  it('should navigate back to bookings list', async () => {
    render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const bookingButton = screen.getByRole('button', { name: /select booking/i });
    fireEvent.click(bookingButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const backButton = screen.getByRole('button', { name: /back to bookings/i });
    fireEvent.click(backButton);
    const heading = screen.getByRole('heading', { name: /my hotel bookings/i });
    expect(heading).toBeDefined();
  });
});
