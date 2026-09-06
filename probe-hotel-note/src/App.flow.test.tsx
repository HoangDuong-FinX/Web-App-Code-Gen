import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from './App';
import { setSaveNoteOutcome } from './fixtures';

describe('App flow tests', () => {
  beforeEach(() => {
    setSaveNoteOutcome('success');
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders booking list on load', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /my hotel bookings/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grand plaza hotel/i })).toBeInTheDocument();
  });

  it('navigates from booking-list to booking-detail on card click', async () => {
    render(<App />);
    const bookingCard = screen.getByRole('button', { name: /grand plaza hotel/i });
    fireEvent.click(bookingCard);
    expect(screen.getByRole('heading', { name: /booking details/i })).toBeInTheDocument();
    expect(screen.getByText('Grand Plaza Hotel')).toBeInTheDocument();
  });

  it('saves note and shows success message', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    const bookingCard = screen.getByRole('button', { name: /grand plaza hotel/i });
    fireEvent.click(bookingCard);

    const textarea = screen.getByRole('textbox', { name: /personal note input/i });
    fireEvent.change(textarea, { target: { value: 'Great hotel, nice views' } });

    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByText(/note saved successfully/i)).toBeInTheDocument();
  });

  it('navigates to save-failed screen on save failure', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByRole('button', { name: /grand plaza hotel/i });
    fireEvent.click(bookingCard);

    const textarea = screen.getByRole('textbox', { name: /personal note input/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/failed to save note/i)).toBeInTheDocument();
  });

  it('can type in note field on save-failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByRole('button', { name: /grand plaza hotel/i });
    fireEvent.click(bookingCard);

    const textarea = screen.getByRole('textbox', { name: /personal note input/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry save/i });
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).not.toBeDisabled();

    const textareaFailed = screen.getByRole('textbox', { name: /personal note input/i });
    expect(textareaFailed).toHaveValue('Test note');
    fireEvent.change(textareaFailed, { target: { value: 'Updated note' } });
    expect(textareaFailed).toHaveValue('Updated note');
  });

  it('navigates back to list from detail screen', () => {
    render(<App />);
    const bookingCard = screen.getByRole('button', { name: /grand plaza hotel/i });
    fireEvent.click(bookingCard);
    expect(screen.getByRole('heading', { name: /booking details/i })).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /back to bookings/i });
    fireEvent.click(backButton);
    expect(screen.getByRole('heading', { name: /my hotel bookings/i })).toBeInTheDocument();
  });

  it('navigates back to list from save-failed screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByRole('button', { name: /grand plaza hotel/i });
    fireEvent.click(bookingCard);

    const textarea = screen.getByRole('textbox', { name: /personal note input/i });
    fireEvent.change(textarea, { target: { value: 'Test note' } });

    const saveButton = screen.getByRole('button', { name: /save note/i });
    fireEvent.click(saveButton);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /back to bookings/i });
    fireEvent.click(backButton);
    expect(screen.getByRole('heading', { name: /my hotel bookings/i })).toBeInTheDocument();
  });
});
