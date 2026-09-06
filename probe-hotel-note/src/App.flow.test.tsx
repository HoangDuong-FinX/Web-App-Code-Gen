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
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
  });

  it('should navigate from bookings-list to booking-detail on booking select', async () => {
    render(<App />);

    // Wait for bookings to load
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });

    // Click to navigate to detail
    fireEvent.click(grandPlazaButton);

    // Verify we are on the detail screen
    expect(await screen.findByText('Booking Details')).toBeInTheDocument();
    expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
  });

  it('should navigate from booking-detail back to bookings-list', async () => {
    render(<App />);

    // Navigate to detail
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);

    // Wait for detail to load and click Back
    const backButton = await screen.findByRole('button', { name: /^Back$/ });
    fireEvent.click(backButton);

    // Verify we are back on bookings list
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
  });

  it('should navigate from booking-detail to booking-detail-save-failed on save failure', async () => {
    setSaveOutcome('fail');
    render(<App />);

    // Navigate to detail
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);

    // Wait for detail to load
    await screen.findByText('Booking Details');

    // Enter note text
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Test note' } });

    // Click Save Note
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);

    // Verify we navigate to failed screen
    expect(
      await screen.findByText('Failed to save note. Please try again.')
    ).toBeInTheDocument();
  });

  it('should navigate from booking-detail-save-failed back to booking-detail on retry success', async () => {
    setSaveOutcome('fail');
    render(<App />);

    // Navigate to detail
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);

    // Wait for detail to load
    await screen.findByText('Booking Details');

    // Enter note and trigger save
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);

    // Wait for failed screen
    await screen.findByText('Failed to save note. Please try again.');

    // Now switch to success and retry
    setSaveOutcome('success');
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);

    // Verify we are back on detail screen (success state)
    expect(screen.getByText('Booking Details')).toBeInTheDocument();
    expect(
      screen.queryByText('Failed to save note. Please try again.')
    ).not.toBeInTheDocument();
  });

  it('should navigate from booking-detail-save-failed to bookings-list on discard', async () => {
    setSaveOutcome('fail');
    render(<App />);

    // Navigate to detail
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);

    // Wait for detail to load
    await screen.findByText('Booking Details');

    // Enter note and trigger save
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);

    // Wait for failed screen
    await screen.findByText('Failed to save note. Please try again.');

    // Click Discard Changes
    const discardButton = screen.getByRole('button', {
      name: /Discard Changes/,
    });
    fireEvent.click(discardButton);

    // Verify we are back on bookings list
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
  });

  it('should successfully save note and show confirmation', async () => {
    setSaveOutcome('success');
    render(<App />);

    // Navigate to detail
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);

    // Wait for detail to load
    await screen.findByText('Booking Details');

    // Enter note and save
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Great hotel!' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);

    // Verify success message appears
    expect(
      await screen.findByText('Note saved successfully')
    ).toBeInTheDocument();
  });
});
