import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/saveNote';

describe('BookingsList Flow', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders bookings list on entry', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    expect(screen.getByText('My Bookings')).toBeDefined();
  });

  it('navigates to booking detail when booking is tapped', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    // After navigation, detail screen should show
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
  });

  it('allows user to type a note on booking detail', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    expect(textarea.value).toBe('Great stay!');
  });

  it('saves note successfully and returns to detail screen', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Wait for async save to complete
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
  });

  it('shows error screen when save fails', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Wait for async save to fail and show error
    await waitFor(() => {
      expect(screen.getByText('Failed to save note')).toBeDefined();
    });
  });

  it('retries save from failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
    
    const textarea = screen.getByRole('textbox', { name: /Note input/ }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Great stay!' } });
    
    const saveButton = screen.getByRole('button', { name: /Save Note/ });
    fireEvent.click(saveButton);
    
    // Wait for async save to fail
    await waitFor(() => {
      expect(screen.getByText('Failed to save note')).toBeDefined();
    });
    
    // Change outcome to success
    setSaveNoteOutcome('success');
    
    // Click retry
    const retryButton = screen.getByRole('button', { name: /Retry/ });
    fireEvent.click(retryButton);
    
    // Wait for async retry to complete and return to detail
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
  });

  it('navigates back to bookings list from detail', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Hotel Vienna')).toBeDefined();
    });
    const bookingItem = screen.getByRole('button', { name: /Grand Hotel Vienna/i });
    fireEvent.click(bookingItem);
    
    await waitFor(() => {
      expect(screen.getByText('Add a note')).toBeDefined();
    });
    
    const backButton = screen.getByRole('button', { name: /Back/ });
    fireEvent.click(backButton);
    
    // Should return to list
    await waitFor(() => {
      expect(screen.getByText('My Bookings')).toBeDefined();
    });
  });
});
