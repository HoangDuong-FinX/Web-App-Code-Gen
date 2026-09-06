import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSaveNoteOutcome('success');
});

describe('Hotel Note App - Flow Tests', () => {
  it('should mount and render bookings list', () => {
    render(<App />);
    expect(screen.getByText(/My Hotel Bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/Grand Hotel Downtown/i)).toBeInTheDocument();
  });

  it('should navigate from bookings-list to booking-detail on booking select', async () => {
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    expect(screen.getByText(/Booking Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Grand Hotel Downtown/i)).toBeInTheDocument();
  });

  it('should navigate back from booking-detail to bookings-list', async () => {
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    expect(screen.getByText(/Booking Details/i)).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /^Back$/ });
    fireEvent.click(backButton);
    expect(screen.getByText(/My Hotel Bookings/i)).toBeInTheDocument();
  });

  it('should allow editing and saving note successfully', async () => {
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Great location!' } });
    expect(textarea).toHaveValue('Great location!');

    const saveButton = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveButton);

    // After successful save, should show confirmation and remain on detail screen
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByText(/Note saved/i)).toBeInTheDocument();
  });

  it('should navigate to save-failed screen on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByText(/Failed to save note/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Discard Changes/i })).toBeInTheDocument();
  });

  it('should retry save from failed screen and succeed', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();

    // Now switch to success and retry
    setSaveNoteOutcome('success');
    const retryButton = screen.getByRole('button', { name: /Retry/i });
    fireEvent.click(retryButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    // Should be back on booking-detail (success state)
    expect(screen.getByText(/Booking Details/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Retry/i })).not.toBeInTheDocument();
  });

  it('should discard changes from failed screen and return to list', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    const discardButton = screen.getByRole('button', {
      name: /Discard Changes/i,
    });
    fireEvent.click(discardButton);

    expect(screen.getByText(/My Hotel Bookings/i)).toBeInTheDocument();
  });

  it('should enforce 200 character limit on note input', async () => {
    render(<App />);
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);

    const textarea = screen.getByRole('textbox');
    const longText = 'a'.repeat(250);
    fireEvent.change(textarea, { target: { value: longText } });

    // Should be truncated to 200
    expect(textarea).toHaveValue('a'.repeat(200));
  });
});
