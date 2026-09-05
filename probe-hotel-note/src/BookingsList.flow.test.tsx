import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/saveNote';

describe('BookingsList Flow', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders bookings list on entry', () => {
    render(<App />);
    expect(screen.getByText('My Bookings')).toBeDefined();
    expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
  });

  it('navigates to booking detail when booking is tapped', async () => {
    render(<App />);
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    // After navigation, detail screen should show
    expect(screen.getByText('Add a note')).toBeDefined();
  });

  it('allows user to type a note on booking detail', async () => {
    render(<App />);
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ });
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    expect(textarea).toHaveValue('Great stay!');
  });

  it('saves note successfully and returns to detail screen', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ });
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Wait for async save to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Should remain on detail screen
    expect(screen.getByText('Add a note')).toBeDefined();
  });

  it('shows error screen when save fails', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ });
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Wait for async save to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Should show error message
    expect(screen.getByText('Failed to save note')).toBeDefined();
  });

  it('retries save from failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ });
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Wait for async save to fail
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Change outcome to success
    setSaveNoteOutcome('success');
    
    // Click retry
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    
    // Wait for async retry to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Should return to detail screen
    expect(screen.getByText('Add a note')).toBeDefined();
  });

  it('navigates back to bookings list from detail', async () => {
    render(<App />);
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    const backButton = screen.getByRole('button', { name: /Back/ });
    fireEvent.click(backButton);
    
    // Should return to list
    expect(screen.getByText('My Bookings')).toBeDefined();
  });
});
