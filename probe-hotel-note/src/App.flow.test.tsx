import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import * as bookingsFixture from './fixtures/bookings';
import * as bookingDetailFixture from './fixtures/bookingDetail';
import * as saveNoteFixture from './fixtures/saveNote';

describe('App Flow Tests', () => {
  beforeEach(() => {
    bookingsFixture.resetBookingsLoadOutcome();
    bookingDetailFixture.resetBookingDetailLoadOutcome();
    saveNoteFixture.resetSaveNoteOutcome();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders bookings list on app entry', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
  });

  it('transitions from bookings-list to booking-detail on booking selection', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Downtown')).toBeInTheDocument();
    });
    
    const bookingButtons = screen.getAllByRole('button');
    const bookingButton = bookingButtons.find((btn) =>
      btn.textContent?.includes('Grand Hotel Downtown')
    );
    expect(bookingButton).toBeDefined();
    fireEvent.click(bookingButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
      expect(screen.getByText('Grand Hotel Downtown')).toBeInTheDocument();
    });
  });

  it('transitions from booking-detail back to bookings-list on back button', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
    
    const bookingButtons = screen.getAllByRole('button');
    const bookingButton = bookingButtons.find((btn) =>
      btn.textContent?.includes('Grand Hotel Downtown')
    );
    expect(bookingButton).toBeDefined();
    fireEvent.click(bookingButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
  });

  it('saves note successfully and remains on booking-detail', async () => {
    saveNoteFixture.setSaveNoteOutcome('success');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
    
    const bookingButtons = screen.getAllByRole('button');
    const bookingButton = bookingButtons.find((btn) =>
      btn.textContent?.includes('Grand Hotel Downtown')
    );
    expect(bookingButton).toBeDefined();
    fireEvent.click(bookingButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const textareas = screen.getAllByRole('textbox');
    const noteInput = textareas[0] as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButtons = screen.getAllByRole('button');
    const saveButton = saveButtons.find((btn) => btn.textContent?.includes('Save Note'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Note saved')).toBeInTheDocument();
    });
  });

  it('transitions to booking-detail-save-failed on save failure', async () => {
    saveNoteFixture.setSaveNoteOutcome('fail');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
    
    const bookingButtons = screen.getAllByRole('button');
    const bookingButton = bookingButtons.find((btn) =>
      btn.textContent?.includes('Grand Hotel Downtown')
    );
    expect(bookingButton).toBeDefined();
    fireEvent.click(bookingButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const textareas = screen.getAllByRole('textbox');
    const noteInput = textareas[0] as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButtons = screen.getAllByRole('button');
    const saveButton = saveButtons.find((btn) => btn.textContent?.includes('Save Note'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
      const retryButtons = screen.getAllByRole('button');
      const retryButton = retryButtons.find((btn) => btn.textContent?.includes('Retry'));
      expect(retryButton).toBeDefined();
    });
  });

  it('retries save and succeeds, transitioning back to booking-detail', async () => {
    saveNoteFixture.setSaveNoteOutcome('fail');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
    
    const bookingButtons = screen.getAllByRole('button');
    const bookingButton = bookingButtons.find((btn) =>
      btn.textContent?.includes('Grand Hotel Downtown')
    );
    expect(bookingButton).toBeDefined();
    fireEvent.click(bookingButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const textareas = screen.getAllByRole('textbox');
    const noteInput = textareas[0] as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButtons = screen.getAllByRole('button');
    const saveButton = saveButtons.find((btn) => btn.textContent?.includes('Save Note'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    
    // Change fixture to succeed
    saveNoteFixture.setSaveNoteOutcome('success');
    
    const retryButtons = screen.getAllByRole('button');
    const retryButton = retryButtons.find((btn) => btn.textContent?.includes('Retry'));
    expect(retryButton).toBeDefined();
    fireEvent.click(retryButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Note saved')).toBeInTheDocument();
    });
  });

  it('discards changes from booking-detail-save-failed and returns to bookings-list', async () => {
    saveNoteFixture.setSaveNoteOutcome('fail');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
    
    const bookingButtons = screen.getAllByRole('button');
    const bookingButton = bookingButtons.find((btn) =>
      btn.textContent?.includes('Grand Hotel Downtown')
    );
    expect(bookingButton).toBeDefined();
    fireEvent.click(bookingButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const textareas = screen.getAllByRole('textbox');
    const noteInput = textareas[0] as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButtons = screen.getAllByRole('button');
    const saveButton = saveButtons.find((btn) => btn.textContent?.includes('Save Note'));
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    
    const discardButtons = screen.getAllByRole('button');
    const discardButton = discardButtons.find((btn) =>
      btn.textContent?.includes('Discard')
    );
    expect(discardButton).toBeDefined();
    fireEvent.click(discardButton!);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
  });
});
