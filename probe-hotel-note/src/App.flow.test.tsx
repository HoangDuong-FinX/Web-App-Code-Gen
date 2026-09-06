import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSaveNoteOutcome(null);
});

describe('Hotel Note App Flow Tests', () => {
  it('should render bookings list on app start', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
  });

  it('should navigate to booking detail when clicking a booking', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
  });

  it('should update note text when typing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const textarea = screen.getByRole('textbox', { name: /booking note/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    expect(textarea).toHaveValue('Test note');
  });

  it('should save note successfully and show success message', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const textarea = screen.getByRole('textbox', { name: /booking note/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('Note saved successfully')).toBeInTheDocument();
    });
  });

  it('should navigate to save-failed screen on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const textarea = screen.getByRole('textbox', { name: /booking note/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
  });

  it('should retain note text on save-failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const textarea = screen.getByRole('textbox', { name: /booking note/i });
    fireEvent.change(textarea, { target: { value: 'Unsaved note' } });
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    const retainedTextarea = screen.getByRole('textbox', { name: /booking note/i });
    expect(retainedTextarea).toHaveValue('Unsaved note');
  });

  it('should retry save and succeed', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const textarea = screen.getByRole('textbox', { name: /booking note/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    setSaveNoteOutcome('success');
    const retryButton = screen.getByRole('button', { name: /retry saving/i });
    fireEvent.click(retryButton);
    await waitFor(() => {
      expect(screen.getByText('Note saved successfully')).toBeInTheDocument();
    });
  });

  it('should navigate back from booking detail to list', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const backButton = screen.getByRole('button', { name: /back to bookings/i });
    fireEvent.click(backButton);
    await waitFor(() => {
      expect(screen.getByText('My Hotel Bookings')).toBeInTheDocument();
    });
  });

  it('should allow continue editing from save-failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Grand Plaza Hotel'));
    await waitFor(() => {
      expect(screen.getByText('Booking Details')).toBeInTheDocument();
    });
    const textarea = screen.getByRole('textbox', { name: /booking note/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    const saveButton = screen.getByRole('button', { name: /save booking note/i });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(screen.getByText('Failed to save note. Please try again.')).toBeInTheDocument();
    });
    const allButtons = screen.getAllByRole('button');
    const continueButton = allButtons.find((btn) => btn.textContent?.includes('Continue Editing'));
    expect(continueButton).toBeDefined();
    fireEvent.click(continueButton!);
    await waitFor(() => {
      const textareas = screen.getAllByRole('textbox', { name: /booking note/i });
      expect(textareas[0]).toHaveValue('Test note');
    });
  });
});