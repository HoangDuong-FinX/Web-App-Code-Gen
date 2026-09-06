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
    fireEvent.click(grandPlazaButton);
    const bookingTitle = await screen.findByText('Booking Details');
    expect(bookingTitle).toBeTruthy();
  });

  it('should display booking information on detail screen', async () => {
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    expect(screen.getByText('Grand Plaza Hotel')).toBeTruthy();
    expect(screen.getByText(/2025-03-15/)).toBeTruthy();
  });

  it('should have note input field on detail screen', async () => {
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    expect(noteInput).toBeTruthy();
  });

  it('should have save and back buttons on detail screen', async () => {
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    const backButton = screen.getByRole('button', { name: /^Back$/ });
    expect(saveButton).toBeTruthy();
    expect(backButton).toBeTruthy();
  });
});