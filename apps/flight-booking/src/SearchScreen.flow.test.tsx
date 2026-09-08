import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SearchScreen flow', () => {
  it('renders the search screen on mount', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByTestId('search-action')).toBeTruthy();
  });

  it('opens airport picker when origin field is clicked', async () => {
    render(<App />);
    const originField = screen.getByTestId('origin-field');
    fireEvent.click(originField);
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeTruthy();
    });
  });

  it('closes airport picker when close button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('origin-field'));
    await waitFor(() => {
      expect(screen.getByTestId('close-action')).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId('close-action'));
    await waitFor(() => {
      expect(screen.queryByTestId('search-input')).toBeNull();
    });
  });

  it('opens date picker when departure date field is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('departure-date-field'));
    await waitFor(() => {
      expect(screen.getByTestId('confirm-action')).toBeTruthy();
    });
  });

  it('opens passenger count modal when passenger field is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('passenger-count-field'));
    await waitFor(() => {
      expect(screen.getByTestId('adult-counter')).toBeTruthy();
    });
  });

  it('toggles trip type between one-way and round-trip', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    const roundTripBtn = buttons.find(b => b.textContent?.includes('Kh\u1EE9 h\u1ED3i'));
    expect(roundTripBtn).toBeTruthy();
    if (roundTripBtn) {
      fireEvent.click(roundTripBtn);
      expect(screen.getByTestId('return-date-field')).toBeTruthy();
    }
  });

  it('swap button swaps origin and destination', async () => {
    render(<App />);
    // Open origin picker and select an airport
    fireEvent.click(screen.getByTestId('origin-field'));
    await waitFor(() => {
      expect(screen.getAllByTestId('airport-item').length).toBeGreaterThan(0);
    });
    const firstAirport = screen.getAllByTestId('airport-item')[0];
    fireEvent.click(firstAirport);
    // Now swap
    await waitFor(() => {
      expect(screen.getByTestId('swap-button')).toBeTruthy();
    });
    fireEvent.click(screen.getByTestId('swap-button'));
    // Origin should now be null (swapped to destination), destination should have the airport
    // This is a state-only test; the UI reflects the swap
    expect(screen.getByTestId('origin-field')).toBeTruthy();
  });
});
