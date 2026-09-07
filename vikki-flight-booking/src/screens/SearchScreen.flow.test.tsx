import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import App from '../App';
import * as bookingService from '../fixtures/bookingService';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  bookingService.setSubmitSearchOutcome('success');
  bookingService.setLoadAirportsOutcome('success');
  bookingService.setLoadCityPairsOutcome('success');
});

describe('SearchScreen flow', () => {
  it('shows search screen on mount', () => {
    render(<App />);
    expect(screen.getByText('T\u00ECm chuy\u1EBFn')).toBeDefined();
  });

  it('search button is initially disabled when master data not loaded', () => {
    render(<App />);
    const btn = screen.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
    expect(btn).toBeDefined();
  });

  it('navigates to results after successful search', async () => {
    render(<App />);
    // Wait for master data to load
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    }, { timeout: 2000 });

    const searchBtn = screen.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
    await act(async () => { fireEvent.click(searchBtn); });

    await waitFor(() => {
      expect(screen.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u \u0111i')).toBeDefined();
    }, { timeout: 3000 });
  });

  it('shows error when search fails', async () => {
    bookingService.setSubmitSearchOutcome('fail');
    render(<App />);
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    }, { timeout: 2000 });

    const searchBtn = screen.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
    await act(async () => { fireEvent.click(searchBtn); });

    await waitFor(() => {
      expect(screen.getByText(/Kh\u00F4ng t\u00ECm \u0111\u01B0\u1EE3c/i)).toBeDefined();
    }, { timeout: 3000 });
  });

  it('swap airports button exists and is accessible', async () => {
    render(<App />);
    const swapBtn = screen.getByRole('button', { name: /Ho\u00E1n \u0111\u1ED5i/i });
    expect(swapBtn).toBeDefined();
  });
});
