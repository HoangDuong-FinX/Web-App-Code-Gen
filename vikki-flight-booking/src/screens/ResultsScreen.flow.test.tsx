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

async function navigateToResults(app: ReturnType<typeof render>) {
  await waitFor(() => {
    const btn = app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  }, { timeout: 2000 });
  const searchBtn = app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
  await act(async () => { fireEvent.click(searchBtn); });
  await waitFor(() => {
    expect(app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u \u0111i')).toBeDefined();
  }, { timeout: 3000 });
}

describe('ResultsScreen flow', () => {
  it('shows results screen with flight cards', async () => {
    const app = render(<App />);
    await navigateToResults(app);
    await waitFor(() => {
      expect(app.getByTestId('flight-card-list')).toBeDefined();
    });
  });

  it('navigates to results-return when selecting outbound for round-trip', async () => {
    const app = render(<App />);
    await navigateToResults(app);
    await waitFor(() => {
      const selectBtns = app.getAllByTestId('select-fare-button');
      expect(selectBtns.length).toBeGreaterThan(0);
    });
    const selectBtns = app.getAllByTestId('select-fare-button');
    await act(async () => { fireEvent.click(selectBtns[0]); });
    await waitFor(() => {
      expect(app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u v\u1EC1')).toBeDefined();
    }, { timeout: 3000 });
  });

  it('shows date strip', async () => {
    const app = render(<App />);
    await navigateToResults(app);
    await waitFor(() => {
      expect(app.getByTestId('date-strip-header')).toBeDefined();
    });
  });
});
