import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';
import { setSaveNoteOutcome, resetSaveNoteOutcome } from './fixtures/bookings';

describe('BookingDetailSaveFailed flow', () => {
  beforeEach(() => {
    resetSaveNoteOutcome();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    resetSaveNoteOutcome();
  });

  it('shows error on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingButtons = screen.getAllByRole('button');
    const btn = bookingButtons.find((b) => b.textContent?.includes('Hanoi Grand Hotel'));
    if (btn) fireEvent.click(btn);
    const noteInput = screen.getByLabelText(/note for this booking/i) as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test' } });
    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(screen.getByText(/failed to save your note/i)).toBeInTheDocument();
  });
});
