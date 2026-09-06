import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
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
    const grandPlazaButton = await waitFor(() =>
      screen.getByRole('button', {
        name: /Grand Plaza Hotel/i,
      })
    );
    fireEvent.click(grandPlazaButton);
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeTruthy();
    });
    expect(screen.getByText('Grand Plaza Hotel')).toBeTruthy();
  });

  it('should navigate from booking-detail back to bookings-list', async () => {
    render(<App />);
    const grandPlazaButton = await waitFor(() =>
      screen.getByRole('button', {
        name: /Grand Plaza Hotel/i,
      })
    );
    fireEvent.click(grandPlazaButton);
    const backButton = await waitFor(() =>
      screen.getByRole('button', { name: /^Back$/ })
    );
    fireEvent.click(backButton);
    expect(screen.getByText('My Hotel Bookings')).toBeTruthy();
  });

  it('should navigate from booking-detail to booking-detail-save-failed on save failure', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await waitFor(() =>
      screen.getByRole('button', {
        name: /Grand Plaza Hotel/i,
      })
    );
    fireEvent.click(grandPlazaButton);
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeTruthy();
    });
    const noteInput = await waitFor(() =>
      screen.getByPlaceholderText('Add a personal note...')
    );
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByText('Failed to save note. Please try again.')
      ).toBeTruthy();
    });
  });

  it('should navigate from booking-detail-save-failed back to booking-detail on retry success', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await waitFor(() =>
      screen.getByRole('button', {
        name: /Grand Plaza Hotel/i,
      })
    );
    fireEvent.click(grandPlazaButton);
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeTruthy();
    });
    const noteInput = await waitFor(() =>
      screen.getByPlaceholderText('Add a personal note...')
    );
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByText('Failed to save note. Please try again.')
      ).toBeTruthy();
    });
    setSaveOutcome('success');
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeTruthy();
      expect(
        screen.queryByText('Failed to save note. Please try again.')
      ).toBeNull();
    });
  });

  it('should navigate from booking-detail-save-failed to bookings-list on discard', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await waitFor(() =>
      screen.getByRole('button', {
        name: /Grand Plaza Hotel/i,
      })
    );
    fireEvent.click(grandPlazaButton);
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeTruthy();
    });
    const noteInput = await waitFor(() =>
      screen.getByPlaceholderText('Add a personal note...')
    );
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(
        screen.getByText('Failed to save note. Please try again.')
      ).toBeTruthy();
    });
    const discardButton = screen.getByRole('button', {
      name: /Discard Changes/,
    });
    fireEvent.click(discardButton);
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeTruthy();
    });
  });

  it('should successfully save note and show confirmation', async () => {
    setSaveOutcome('success');
    render(<App />);
    const grandPlazaButton = await waitFor(() =>
      screen.getByRole('button', {
        name: /Grand Plaza Hotel/i,
      })
    );
    fireEvent.click(grandPlazaButton);
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeTruthy();
    });
    const noteInput = await waitFor(() =>
      screen.getByPlaceholderText('Add a personal note...')
    );
    fireEvent.change(noteInput, { target: { value: 'Great hotel!' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('Note saved successfully')).toBeTruthy();
    });
  });
});