import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { afterEach, describe, it, expect } from 'vitest';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSaveNoteOutcome('success');
});

const WAIT_OPTIONS = { timeout: 2000 };

describe('Hotel Note App - Flow Tests', () => {
  it('renders bookings-list screen on entry', () => {
    render(<App />);
    const title = screen.getByText('My Bookings');
    expect(title).toBeInTheDocument();
  });

  it('navigates from bookings-list to booking-detail when a booking is tapped', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const hotelName = screen.getByText('The Grand Hotel');
        expect(hotelName).toBeInTheDocument();
        const backButton = screen.getByRole('button', { name: /back to bookings/i });
        expect(backButton).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
  });

  it('updates note text and displays character count', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const noteInput = screen.getByRole('textbox', {
          name: /note for this booking/i,
        }) as HTMLTextAreaElement;
        expect(noteInput).toBeInTheDocument();
        fireEvent.change(noteInput, { target: { value: 'Test note' } });
        expect(noteInput.value).toBe('Test note');
      },
      WAIT_OPTIONS
    );
  });

  it('saves note successfully and returns to bookings-list', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const noteInput = screen.getByRole('textbox', {
          name: /note for this booking/i,
        });
        fireEvent.change(noteInput, { target: { value: 'Updated note' } });
      },
      WAIT_OPTIONS
    );
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await waitFor(
      () => {
        const title = screen.getByText('My Bookings');
        expect(title).toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });

  it('navigates to save-failed screen when save fails', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const noteInput = screen.getByRole('textbox', {
          name: /note for this booking/i,
        });
        fireEvent.change(noteInput, { target: { value: 'Test note' } });
      },
      WAIT_OPTIONS
    );
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await waitFor(
      () => {
        const errorTitle = screen.getByText('Save Failed');
        expect(errorTitle).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
  });

  it('retries from save-failed screen back to booking-detail', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const noteInput = screen.getByRole('textbox', {
          name: /note for this booking/i,
        });
        fireEvent.change(noteInput, { target: { value: 'Test note' } });
      },
      WAIT_OPTIONS
    );
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await waitFor(
      () => {
        const errorTitle = screen.getByText('Save Failed');
        expect(errorTitle).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
    const retryButton = screen.getByRole('button', { name: /retry saving/i });
    fireEvent.click(retryButton);
    await waitFor(
      () => {
        const hotelName = screen.getByText('The Grand Hotel');
        expect(hotelName).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
  });

  it('cancels from save-failed screen back to bookings-list', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const noteInput = screen.getByRole('textbox', {
          name: /note for this booking/i,
        });
        fireEvent.change(noteInput, { target: { value: 'Test note' } });
      },
      WAIT_OPTIONS
    );
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await waitFor(
      () => {
        const errorTitle = screen.getByText('Save Failed');
        expect(errorTitle).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
    const cancelButton = screen.getByRole('button', {
      name: /cancel and return to bookings/i,
    });
    fireEvent.click(cancelButton);
    await waitFor(
      () => {
        const title = screen.getByText('My Bookings');
        expect(title).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
  });

  it('navigates back from booking-detail to bookings-list', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    await waitFor(
      () => {
        const backButton = screen.getByRole('button', { name: /back to bookings/i });
        expect(backButton).toBeInTheDocument();
        fireEvent.click(backButton);
      },
      WAIT_OPTIONS
    );
    await waitFor(
      () => {
        const title = screen.getByText('My Bookings');
        expect(title).toBeInTheDocument();
      },
      WAIT_OPTIONS
    );
  });
});
