import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Hotel Note App - Navigation Flow', () => {
  it('renders bookings list on app load', () => {
    render(<App />);
    expect(screen.getByText('My Hotel Bookings')).toBeTruthy();
    expect(screen.getByText('Grand Plaza Hotel')).toBeTruthy();
    expect(screen.getByText('Seaside Resort')).toBeTruthy();
    expect(screen.getByText('Mountain Lodge')).toBeTruthy();
  });

  it('navigates to booking detail when a booking card is clicked', () => {
    render(<App />);
    const grandPlazaCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (grandPlazaCard) {
      fireEvent.click(grandPlazaCard);
    }
    expect(screen.getByText('Booking Details')).toBeTruthy();
    expect(screen.getByText('Grand Plaza Hotel')).toBeTruthy();
    expect(screen.getByText('Suite 2501 (2 beds, 1 bath)')).toBeTruthy();
  });

  it('allows entering note text with 200 character limit', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const noteInput = screen.getByRole('textbox', { name: /Add or edit booking note/i }) as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'This is a test note' } });
    expect(noteInput.value).toBe('This is a test note');
    expect(screen.getByText('19 / 200')).toBeTruthy();
  });

  it('enforces 200 character limit on note input', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const noteInput = screen.getByRole('textbox', { name: /Add or edit booking note/i }) as HTMLTextAreaElement;
    const longText = 'a'.repeat(250);
    fireEvent.change(noteInput, { target: { value: longText } });
    expect(noteInput.value).toBe('a'.repeat(200));
  });

  it('navigates to save-failed screen when save note button is clicked', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const noteInput = screen.getByRole('textbox', { name: /Add or edit booking note/i }) as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'My test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save note for this booking/i });
    fireEvent.click(saveButton);
    
    expect(screen.getByRole('alert', { name: /Save failed/i })).toBeTruthy();
    expect(screen.getByText(/Failed to save note/)).toBeTruthy();
  });

  it('shows retry button on save-failed screen', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const saveButton = screen.getByRole('button', { name: /Save note for this booking/i });
    fireEvent.click(saveButton);
    
    const retryButton = screen.getByRole('button', { name: /Retry saving the note/i });
    expect(retryButton).toBeTruthy();
  });

  it('navigates back to booking detail when retry button is clicked', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const saveButton = screen.getByRole('button', { name: /Save note for this booking/i });
    fireEvent.click(saveButton);
    
    const retryButton = screen.getByRole('button', { name: /Retry saving the note/i });
    fireEvent.click(retryButton);
    
    expect(screen.getByRole('button', { name: /Save note for this booking/i })).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeFalsy();
  });

  it('retains note text when navigating to save-failed screen', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const noteInput = screen.getByRole('textbox', { name: /Add or edit booking note/i }) as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Important note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save note for this booking/i });
    fireEvent.click(saveButton);
    
    const failedNoteInput = screen.getByRole('textbox', { name: /Edit booking note/i }) as HTMLTextAreaElement;
    expect(failedNoteInput.value).toBe('Important note');
  });

  it('allows editing note text on save-failed screen', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const noteInput = screen.getByRole('textbox', { name: /Add or edit booking note/i }) as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Original note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save note for this booking/i });
    fireEvent.click(saveButton);
    
    const failedNoteInput = screen.getByRole('textbox', { name: /Edit booking note/i }) as HTMLTextAreaElement;
    fireEvent.change(failedNoteInput, { target: { value: 'Edited note' } });
    expect(failedNoteInput.value).toBe('Edited note');
  });

  it('displays all booking details on detail screen', () => {
    render(<App />);
    const bookingCard = screen.getByText('Seaside Resort').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    expect(screen.getByText('Seaside Resort')).toBeTruthy();
    expect(screen.getByText('2025-04-10 – 2025-04-14')).toBeTruthy();
    expect(screen.getByText('Miami Beach, FL')).toBeTruthy();
    expect(screen.getByText('Ocean View Room (1 bed, 1 bath)')).toBeTruthy();
    expect(screen.getByText(/SSR-2025-54321/)).toBeTruthy();
  });

  it('keyboard navigates to save button', () => {
    render(<App />);
    const bookingCard = screen.getByText('Grand Plaza Hotel').closest('div')?.parentElement;
    if (bookingCard) {
      fireEvent.click(bookingCard);
    }
    
    const saveButton = screen.getByRole('button', { name: /Save note for this booking/i });
    saveButton.focus();
    expect(document.activeElement).toBe(saveButton);
  });
});
