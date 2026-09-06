// App.flow.test.tsx
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';
import { setLoadBookingsOutcome, setSaveNoteOutcome } from './fixtures';

describe('Hotel Note App - Flow Tests', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    setLoadBookingsOutcome('success');
    setSaveNoteOutcome('success');
  });

  it('should render bookings list on entry', async () => {
    render(<App />);
    expect(screen.getByText('Hotel Bookings')).toBeInTheDocument();
  });

  it('should navigate to booking detail when booking is selected', async () => {
    render(<App />);
    // Wait for bookings to load
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    expect(screen.getByText('Booking Detail')).toBeInTheDocument();
    expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
  });

  it('should navigate back to bookings list from booking detail', async () => {
    render(<App />);
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    const backButton = screen.getByRole('button', { name: /Back to bookings list/ });
    fireEvent.click(backButton);
    expect(screen.getByText('Hotel Bookings')).toBeInTheDocument();
  });

  it('should save note and show success message', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    await new Promise((r) => setTimeout(r, 400));
    expect(screen.getByText('Note saved')).toBeInTheDocument();
  });

  it('should navigate to save-failed screen on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    await new Promise((r) => setTimeout(r, 400));
    expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/ })).toBeInTheDocument();
  });

  it('should retry save from failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    await new Promise((r) => setTimeout(r, 400));
    expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    
    // Change outcome to success for retry
    setSaveNoteOutcome('success');
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    
    await new Promise((r) => setTimeout(r, 400));
    expect(screen.getByText('Note saved')).toBeInTheDocument();
  });

  it('should discard note and return to bookings list from failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    await new Promise((r) => setTimeout(r, 400));
    const discardButton = screen.getByRole('button', { name: /Discard/ });
    fireEvent.click(discardButton);
    
    expect(screen.getByText('Hotel Bookings')).toBeInTheDocument();
  });

  it('should disable save button when note is empty or unchanged', async () => {
    render(<App />);
    await new Promise((r) => setTimeout(r, 400));
    const bookingCard = screen.getByRole('button', { name: /Grand Plaza Hotel/ });
    fireEvent.click(bookingCard);
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    expect(saveButton).toBeDisabled();
  });
});
