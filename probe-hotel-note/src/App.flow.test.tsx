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
    
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    
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
    
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const backButton = screen.getByRole('button', { name: /Back to bookings list/i });
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
    
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const noteInput = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save booking note/i });
    fireEvent.click(saveButton);
    
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
    
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const noteInput = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save booking note/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Retry saving booking note/i })).toBeInTheDocument();
    });
  });

  it('retries save and succeeds, transitioning back to booking-detail', async () => {
    saveNoteFixture.setSaveNoteOutcome('fail');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
    
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const noteInput = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save booking note/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    
    // Change fixture to succeed
    saveNoteFixture.setSaveNoteOutcome('success');
    
    const retryButton = screen.getByRole('button', { name: /Retry saving booking note/i });
    fireEvent.click(retryButton);
    
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
    
    const bookingButton = screen.getByRole('button', {
      name: /Grand Hotel Downtown/i,
    });
    fireEvent.click(bookingButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    
    const noteInput = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(noteInput, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save booking note/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    
    const discardButton = screen.getByRole('button', {
      name: /Discard changes and return to bookings list/i,
    });
    fireEvent.click(discardButton);
    
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
  });
});
