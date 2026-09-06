import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { matchers } from '@testing-library/jest-dom';
import App from './App';
import { setSaveOutcome } from './fixtures/bookings';

expect.extend(matchers);

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
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    expect(await screen.findByText('Booking Details')).toBeInTheDocument();
    expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
  });

  it('should navigate from booking-detail back to bookings-list', async () => {
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    const backButton = await screen.findByRole('button', { name: /^Back$/ });
    fireEvent.click(backButton);
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
  });

  it('should navigate from booking-detail to booking-detail-save-failed on save failure', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    expect(
      await screen.findByText('Failed to save note. Please try again.')
    ).toBeInTheDocument();
  });

  it('should navigate from booking-detail-save-failed back to booking-detail on retry success', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    await screen.findByText('Failed to save note. Please try again.');
    setSaveOutcome('success');
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    expect(screen.getByText('Booking Details')).toBeInTheDocument();
    expect(
      screen.queryByText('Failed to save note. Please try again.')
    ).not.toBeInTheDocument();
  });

  it('should navigate from booking-detail-save-failed to bookings-list on discard', async () => {
    setSaveOutcome('fail');
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    await screen.findByText('Failed to save note. Please try again.');
    const discardButton = screen.getByRole('button', {
      name: /Discard Changes/,
    });
    fireEvent.click(discardButton);
    expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
  });

  it('should successfully save note and show confirmation', async () => {
    setSaveOutcome('success');
    render(<App />);
    const grandPlazaButton = await screen.findByRole('button', {
      name: /Grand Plaza Hotel/i,
    });
    fireEvent.click(grandPlazaButton);
    await screen.findByText('Booking Details');
    const noteInput = screen.getByPlaceholderText('Add a personal note...');
    fireEvent.change(noteInput, { target: { value: 'Great hotel!' } });
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    expect(
      await screen.findByText('Note saved successfully')
    ).toBeInTheDocument();
  });
});