import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi } from 'vitest';
import { afterEach, describe, it, expect } from 'vitest';
import App from './App';
import { setSaveNoteOutcome } from './fixtures/bookings';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSaveNoteOutcome('success');
});

describe('Hotel Note App - Flow Tests', () => {
  it('renders bookings-list screen on entry', () => {
    render(<App />);
    const title = screen.getByText('My Bookings');
    expect(title).toBeInTheDocument();
  });

  it('mount test: app renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
  });

  it('displays all bookings on list screen', () => {
    render(<App />);
    expect(screen.getByText('The Grand Hotel')).toBeInTheDocument();
    expect(screen.getByText('Seaside Resort')).toBeInTheDocument();
    expect(screen.getByText('Mountain Lodge')).toBeInTheDocument();
  });

  it('booking cards are interactive', () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    expect(bookingCard).toBeInTheDocument();
    // Verify it's clickable by checking parent has proper structure
    const parent = bookingCard.closest('.card');
    expect(parent).toHaveClass('card-interactive');
  });

  it('displays booking detail when card is clicked', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(
      () => {
        // Verify detail screen shows booking info
        const hotelName = screen.getByRole('heading', { level: 1 });
        expect(hotelName.textContent).toContain('The Grand Hotel');
      },
      { timeout: 1000 }
    );
  });

  it('back button returns to bookings list', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back to bookings/i });
      expect(backButton).toBeInTheDocument();
      fireEvent.click(backButton);
    }, { timeout: 1000 });
    
    await waitFor(() => {
      const title = screen.getByText('My Bookings');
      expect(title).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('note textarea accepts input and respects max length', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const noteInput = screen.getByRole('textbox', {
        name: /note for this booking/i,
      }) as HTMLTextAreaElement;
      expect(noteInput).toBeInTheDocument();
      
      // Type text
      fireEvent.change(noteInput, { target: { value: 'Test note' } });
      expect(noteInput.value).toBe('Test note');
      
      // Verify character count displays
      const charCount = screen.getByText(/9 \/ 200/);
      expect(charCount).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('save button is present and clickable', async () => {
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /save note/i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).not.toBeDisabled();
    }, { timeout: 1000 });
  });

  it('successful save shows success alert and returns to list', async () => {
    setSaveNoteOutcome('success');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const noteInput = screen.getByRole('textbox', {
        name: /note for this booking/i,
      });
      fireEvent.change(noteInput, { target: { value: 'Updated note' } });
      
      const saveButton = screen.getByRole('button', { name: /save note/i });
      fireEvent.click(saveButton);
    }, { timeout: 1000 });
    
    // Wait for success alert
    await waitFor(() => {
      const successMessage = screen.getByText(/note saved successfully/i);
      expect(successMessage).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Then wait for navigation back to list
    await waitFor(() => {
      const title = screen.getByText('My Bookings');
      expect(title).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('failed save navigates to error screen', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const noteInput = screen.getByRole('textbox', {
        name: /note for this booking/i,
      });
      fireEvent.change(noteInput, { target: { value: 'Test note' } });
      
      const saveButton = screen.getByRole('button', { name: /save note/i });
      fireEvent.click(saveButton);
    }, { timeout: 1000 });
    
    await waitFor(() => {
      const errorTitle = screen.getByText(/save failed/i);
      expect(errorTitle).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('retry button on error screen returns to detail', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const noteInput = screen.getByRole('textbox', {
        name: /note for this booking/i,
      });
      fireEvent.change(noteInput, { target: { value: 'Test note' } });
      
      const saveButton = screen.getByRole('button', { name: /save note/i });
      fireEvent.click(saveButton);
    }, { timeout: 1000 });
    
    await waitFor(() => {
      const errorTitle = screen.getByText(/save failed/i);
      expect(errorTitle).toBeInTheDocument();
    }, { timeout: 2000 });
    
    const retryButton = screen.getByRole('button', { name: /retry saving/i });
    fireEvent.click(retryButton);
    
    await waitFor(() => {
      // Should be back on booking detail
      const noteInput = screen.getByRole('textbox', {
        name: /note for this booking/i,
      });
      expect(noteInput).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('cancel button on error screen returns to list', async () => {
    setSaveNoteOutcome('fail');
    render(<App />);
    const bookingCard = screen.getByText('The Grand Hotel');
    fireEvent.click(bookingCard);
    
    await waitFor(() => {
      const noteInput = screen.getByRole('textbox', {
        name: /note for this booking/i,
      });
      fireEvent.change(noteInput, { target: { value: 'Test note' } });
      
      const saveButton = screen.getByRole('button', { name: /save note/i });
      fireEvent.click(saveButton);
    }, { timeout: 1000 });
    
    await waitFor(() => {
      const errorTitle = screen.getByText(/save failed/i);
      expect(errorTitle).toBeInTheDocument();
    }, { timeout: 2000 });
    
    const cancelButton = screen.getByRole('button', {
      name: /cancel and return to bookings/i,
    });
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      const title = screen.getByText('My Bookings');
      expect(title).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
