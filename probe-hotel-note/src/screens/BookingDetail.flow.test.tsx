import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { BookingDetail } from './BookingDetail';
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
  note: 'High floor preferred',
};

describe('BookingDetail Flow', () => {
  it('renders booking details and note input', () => {
    const onSaveSuccess = vi.fn();
    const onSaveFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetail
        booking={mockBooking}
        noteText={mockBooking.note || ''}
        onNoteChange={onNoteChange}
        onSaveSuccess={onSaveSuccess}
        onSaveFailure={onSaveFailure}
        onBack={onBack}
      />
    );

    expect(screen.getByText('Grand Hotel Hanoi')).toBeDefined();
    expect(screen.getByDisplayValue('High floor preferred')).toBeDefined();
  });

  it('navigates to bookings list on successful save', async () => {
    saveNoteFixture.setSaveNoteOutcome('success');
    const onSaveSuccess = vi.fn();
    const onSaveFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetail
        booking={mockBooking}
        noteText="Updated note"
        onNoteChange={onNoteChange}
        onSaveSuccess={onSaveSuccess}
        onSaveFailure={onSaveFailure}
        onBack={onBack}
      />
    );

    const saveButton = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveButton);

    await vi.waitFor(() => {
      expect(onSaveSuccess).toHaveBeenCalled();
    });
  });

  it('navigates to save-failed on failed save', async () => {
    saveNoteFixture.setSaveNoteOutcome('failure');
    const onSaveSuccess = vi.fn();
    const onSaveFailure = vi.fn();
    const onNoteChange = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetail
        booking={mockBooking}
        noteText="Test note"
        onNoteChange={onNoteChange}
        onSaveSuccess={onSaveSuccess}
        onSaveFailure={onSaveFailure}
        onBack={onBack}
      />
    );

    const saveButton = screen.getByRole('button', { name: /Save Note/i });
    fireEvent.click(saveButton);

    await vi.waitFor(() => {
      expect(onSaveFailure).toHaveBeenCalled();
    });
  });

  it('updates note text when input changes', () => {
    const onNoteChange = vi.fn();
    const onSaveSuccess = vi.fn();
    const onSaveFailure = vi.fn();
    const onBack = vi.fn();

    render(
      <BookingDetail
        booking={mockBooking}
        noteText=""
        onNoteChange={onNoteChange}
        onSaveSuccess={onSaveSuccess}
        onSaveFailure={onSaveFailure}
        onBack={onBack}
      />
    );

    const textarea = screen.getByPlaceholderText('Add a note about this booking');
    fireEvent.change(textarea, { target: { value: 'New note' } });

    expect(onNoteChange).toHaveBeenCalledWith('New note');
  });

  it('navigates back to bookings list when back button is clicked', () => {
    const onBack = vi.fn();
    const onSaveSuccess = vi.fn();
    const onSaveFailure = vi.fn();
    const onNoteChange = vi.fn();

    render(
      <BookingDetail
        booking={mockBooking}
        noteText=""
        onNoteChange={onNoteChange}
        onSaveSuccess={onSaveSuccess}
        onSaveFailure={onSaveFailure}
        onBack={onBack}
      />
    );

    const backButton = screen.getByRole('button', { name: /Back to bookings/i });
    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalled();
  });
});
