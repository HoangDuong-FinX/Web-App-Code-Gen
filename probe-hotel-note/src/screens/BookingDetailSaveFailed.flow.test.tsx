import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { BookingDetailSaveFailed } from './BookingDetailSaveFailed';
import * as saveNoteFixture from '../fixtures/saveNote';
import type { Booking } from '../types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  saveNoteFixture.resetSaveNoteOutcome();
});

const mockBooking: Booking = {
  bookingId: 'BK001',
  hotelName: 'Grand Hotel Hanoi',
  checkInDate: '2025-09-15',
  checkOutDate: '2025-09-18',
  status: 'confirmed',
  note: '',
};

describe('BookingDetailSaveFailed Flow', () => {
  it('renders error alert and retry button', () => {
    const onRetrySuccess = vi.fn();
    const onRetryFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetailSaveFailed
        booking={mockBooking}
        noteText="Failed note"
        onNoteChange={onNoteChange}
        onRetrySuccess={onRetrySuccess}
        onRetryFailure={onRetryFailure}
        onBack={onBack}
      />
    );

    expect(screen.getByText('Failed to save note. Please try again.')).toBeDefined();
    expect(screen.getByRole('button', { name: /Retry Save/i })).toBeDefined();
  });

  it('retains note text from failed attempt', () => {
    const onRetrySuccess = vi.fn();
    const onRetryFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetailSaveFailed
        booking={mockBooking}
        noteText="My failed note"
        onNoteChange={onNoteChange}
        onRetrySuccess={onRetrySuccess}
        onRetryFailure={onRetryFailure}
        onBack={onBack}
      />
    );

    const textarea = screen.getByDisplayValue('My failed note');
    expect(textarea).toBeDefined();
  });

  it('navigates to bookings list on successful retry', async () => {
    saveNoteFixture.setSaveNoteOutcome('success');
    const onRetrySuccess = vi.fn();
    const onRetryFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetailSaveFailed
        booking={mockBooking}
        noteText="Retry note"
        onNoteChange={onNoteChange}
        onRetrySuccess={onRetrySuccess}
        onRetryFailure={onRetryFailure}
        onBack={onBack}
      />
    );

    const retryButton = screen.getByRole('button', { name: /Retry Save/i });
    fireEvent.click(retryButton);

    await vi.waitFor(() => {
      expect(onRetrySuccess).toHaveBeenCalled();
    });
  });

  it('remains on save-failed screen on failed retry', async () => {
    saveNoteFixture.setSaveNoteOutcome('failure');
    const onRetrySuccess = vi.fn();
    const onRetryFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetailSaveFailed
        booking={mockBooking}
        noteText="Another retry"
        onNoteChange={onNoteChange}
        onRetrySuccess={onRetrySuccess}
        onRetryFailure={onRetryFailure}
        onBack={onBack}
      />
    );

    const retryButton = screen.getByRole('button', { name: /Retry Save/i });
    fireEvent.click(retryButton);

    await vi.waitFor(() => {
      expect(onRetryFailure).toHaveBeenCalled();
    });
  });

  it('updates note text when input changes', () => {
    const onNoteChange = vi.fn();
    const onRetrySuccess = vi.fn();
    const onRetryFailure = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetailSaveFailed
        booking={mockBooking}
        noteText=""
        onNoteChange={onNoteChange}
        onRetrySuccess={onRetrySuccess}
        onRetryFailure={onRetryFailure}
        onBack={onBack}
      />
    );

    const textarea = screen.getByPlaceholderText('Add a note about this booking');
    fireEvent.change(textarea, { target: { value: 'Edited note' } });

    expect(onNoteChange).toHaveBeenCalledWith('Edited note');
  });

  it('navigates back to bookings list when back button is clicked', () => {
    const onBack = vi.fn();
    const onRetrySuccess = vi.fn();
    const onRetryFailure = vi.fn();
    const onNoteChange = vi.fn();

    render(
      <BookingDetailSaveFailed
        booking={mockBooking}
        noteText=""
        onNoteChange={onNoteChange}
        onRetrySuccess={onRetrySuccess}
        onRetryFailure={onRetryFailure}
        onBack={onBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /Back to bookings/i });
    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalled();
  });
});
