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
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    const bookingTitle = await screen.findByText('Booking Details');
    expect(bookingTitle).toBeTruthy();
  });

  it('should navigate from booking-detail back to bookings-list', async () => {
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const backButton = await screen.findByRole('button', { name: /^Back$/ });
    fireEvent.click(backButton);
    const listTitle = await screen.findByText('My Hotel Bookings');
    expect(listTitle).toBeTruthy();
  });

  it('should show error state when save fails', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const saveButton = await screen.findByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    const errorMsg = await screen.findByText(
      'Failed to save note. Please try again.'
    );
    expect(errorMsg).toBeTruthy();
  });

  it('should show success message when save succeeds', async () => {
    setSaveOutcome('success');
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const saveButton = await screen.findByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    const successMsg = await screen.findByText('Note saved successfully');
    expect(successMsg).toBeTruthy();
  });
});