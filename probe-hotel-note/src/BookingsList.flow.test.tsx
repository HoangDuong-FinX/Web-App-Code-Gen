import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/saveNote';

describe('BookingsList Flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders bookings list on entry', async () => {
    render(<App />);
    vi.runAllTimers();
    expect(screen.getByText('My Bookings')).toBeDefined();
    expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
  });

  it('navigates to booking detail when booking is tapped', async () => {
    render(<App />);
    vi.runAllTimers();
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    // After navigation, detail screen should show
    expect(screen.getByText('Add a note')).toBeDefined();
  });

  it('allows user to type a note on booking detail', async () => {
    render(<App />);
    vi.runAllTimers();
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    expect(textarea.value).toBe('Great stay!');
  });

  it('saves note successfully and returns to detail screen', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    vi.runAllTimers();
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Advance timers to complete async save
    vi.runAllTimers();
    
    // Should remain on detail screen
    expect(screen.getByText('Add a note')).toBeDefined();
  });

  it('shows error screen when save fails', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    vi.runAllTimers();
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Advance timers to complete async save
    vi.runAllTimers();
    
    // Should show error message
    expect(screen.getByText('Failed to save note')).toBeDefined();
  });

  it('retries save from failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    vi.runAllTimers();
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Advance timers to complete async save
    vi.runAllTimers();
    
    // Change outcome to success
    setSaveNoteOutcome('success');
    
    // Click retry
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    
    // Advance timers to complete async retry
    vi.runAllTimers();
    
    // Should return to detail screen
    expect(screen.getByText('Add a note')).toBeDefined();
  });

  it('navigates back to bookings list from detail', async () => {
    render(<App />);
    vi.runAllTimers();
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const backButton = screen.getByRole('button', { name: /Back/ });
    fireEvent.click(backButton);
    
    // Should return to list
    expect(screen.getByText('My Bookings')).toBeDefined();
  });
});
