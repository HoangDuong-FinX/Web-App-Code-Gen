import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SearchScreen flow', () => {
  it('renders the search heading', () => {
    render(<App />);
    expect(screen.getByText('Tim chuyen bay')).toBeInTheDocument();
  });

  it('toggles trip type between one-way and round-trip', () => {
    render(<App />);
    const roundTripBtn = screen.getByRole('button', { name: /Khu hoi/i });
    fireEvent.click(roundTripBtn);
    expect(roundTripBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('opens airport picker when clicking departure field', () => {
    render(<App />);
    const originField = screen.getByTestId('origin-field');
    fireEvent.click(originField);
    expect(screen.getByText('Chon san bay')).toBeInTheDocument();
  });

  it('opens date picker when clicking departure date field', () => {
    render(<App />);
    const dateField = screen.getByTestId('departure-date-field');
    fireEvent.click(dateField);
    expect(screen.getByText('Chon ngay')).toBeInTheDocument();
  });

  it('opens passenger count when clicking passenger summary', () => {
    render(<App />);
    const paxField = screen.getByTestId('passenger-summary-field');
    fireEvent.click(paxField);
    expect(screen.getByText('Hanh khach')).toBeInTheDocument();
  });

  it('search button is disabled when no airports selected', () => {
    render(<App />);
    const searchBtn = screen.getByTestId('search-submit');
    expect(searchBtn).toBeDisabled();
  });
});
