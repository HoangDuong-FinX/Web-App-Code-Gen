import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  setSaveNoteOutcome('success');
});

describe('App Flow Tests', () => {
  it('navigates from bookings list to booking detail on card click', async () => {
    render(<App />);

    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Find and click first booking card
    const bookingCards = screen.getAllByRole('button', { name: /View booking details/i });
    expect(bookingCards.length).toBeGreaterThan(0);

    fireEvent.click(bookingCards[0]);

    // Wait for detail screen to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify we're on detail screen
    const saveButton = screen.queryByRole('button', { name: /Save the personal note/i });
    expect(saveButton).toBeTruthy();
  });

  it('navigates back to list from booking detail', async () => {
    render(<App />);

    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Click first booking
    const bookingCards = screen.getAllByRole('button', { name: /View booking details/i });
    fireEvent.click(bookingCards[0]);

    // Wait for detail screen
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Click back button
    const backButton = screen.getByRole('button', { name: /Back to bookings list/i });
    fireEvent.click(backButton);

    // Wait for list to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify we're back on list
    const title = screen.getByText('My Hotel Bookings', { selector: '*' });
    expect(title).toBeTruthy();
  });

  it('saves note successfully', async () => {
    setSaveNoteOutcome('success');
    render(<App />);

    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Click first booking
    const bookingCards = screen.getAllByRole('button', { name: /View booking details/i });
    fireEvent.click(bookingCards[0]);

    // Wait for detail screen
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find and update note textarea
    const textarea = screen.getByRole('textbox', {
      name: /Personal note for this booking/i,
    }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /Save the personal note/i });
    fireEvent.click(saveButton);

    // Wait for save to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify we're back on list (save success navigates back)
    const title = screen.getByText('My Hotel Bookings', { selector: '*' });
    expect(title).toBeTruthy();
  });

  it('shows error and allows retry on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);

    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Click first booking
    const bookingCards = screen.getAllByRole('button', { name: /View booking details/i });
    fireEvent.click(bookingCards[0]);

    // Wait for detail screen
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Update note
    const textarea = screen.getByRole('textbox', {
      name: /Personal note for this booking/i,
    }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /Save the personal note/i });
    fireEvent.click(saveButton);

    // Wait for save to fail
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify error screen is shown
    const retryButton = screen.queryByRole('button', { name: /Retry saving the personal note/i });
    expect(retryButton).toBeTruthy();

    // Verify error message is displayed
    const errorText = screen.queryByText(/Network error|Failed to save/i);
    expect(errorText).toBeTruthy();
  });

  it('retries save from error screen', async () => {
    // First save fails
    setSaveNoteOutcome('fail');
    render(<App />);

    // Wait for bookings to load
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Click first booking
    const bookingCards = screen.getAllByRole('button', { name: /View booking details/i });
    fireEvent.click(bookingCards[0]);

    // Wait for detail screen
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Update note
    const textarea = screen.getByRole('textbox', {
      name: /Personal note for this booking/i,
    }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /Save the personal note/i });
    fireEvent.click(saveButton);

    // Wait for save to fail
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Now allow retry to succeed
    setSaveNoteOutcome('success');

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /Retry saving the personal note/i });
    fireEvent.click(retryButton);

    // Wait for retry to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify we're back on list (retry success navigates back)
    const title = screen.getByText('My Hotel Bookings', { selector: '*' });
    expect(title).toBeTruthy();
  });
});
