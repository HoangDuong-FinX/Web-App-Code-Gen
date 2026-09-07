import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';
import { setSearchOutcome } from './fixtures/flights';
import { setPaymentHubOutcome } from './fixtures/paymentHub';
import { setPaymentInquiryOutcome } from './fixtures/paymentInquiry';
import { setAncillaryOutcome } from './fixtures/ancillary';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setSearchOutcome('success');
  setPaymentHubOutcome('simulated');
  setPaymentInquiryOutcome('success');
  setAncillaryOutcome('success');
});

// Wait for master data (airports + city pairs) to finish loading (300ms + 200ms fixture delays)
async function renderApp() {
  let container: ReturnType<typeof render>;
  await act(async () => {
    container = render(<App />);
    // Wait for both fixtures: airports (300ms) + city pairs (200ms) + margin
    await new Promise(r => setTimeout(r, 700));
  });
  return container!;
}

// Helper: open airport picker, wait for list to render, pick by index
async function pickAirport(testId: string, index: number) {
  fireEvent.click(screen.getByTestId(testId));
  await act(async () => { await new Promise(r => setTimeout(r, 100)); });
  const btns = screen.getAllByTestId('airport-item-button');
  fireEvent.click(btns[index]);
  await act(async () => { await new Promise(r => setTimeout(r, 100)); });
}

describe('App mount', () => {
  it('renders without crashing and shows search screen', async () => {
    await renderApp();
    expect(screen.getByTestId('app-root')).toBeTruthy();
    expect(screen.getByTestId('search-button')).toBeTruthy();
  });
});

describe('Search => Results transition', () => {
  it('navigates to results screen after successful search', async () => {
    await renderApp();

    // Pick SGN as origin (index 0), DLI as destination (index 2)
    await pickAirport('origin-airport-button', 0); // SGN
    await pickAirport('destination-airport-button', 2); // DLI

    // Now click search
    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    expect(screen.getByTestId('results-title')).toBeTruthy();
  });
});

describe('Search failure path', () => {
  it('shows search error when fixture fails', async () => {
    setSearchOutcome('fail');
    await renderApp();

    await pickAirport('origin-airport-button', 0); // SGN
    await pickAirport('destination-airport-button', 2); // DLI

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1200));
    });

    expect(screen.getByTestId('search-error')).toBeTruthy();
  });
});

describe('Trip type toggle', () => {
  it('switches between round-trip and one-way', async () => {
    await renderApp();
    const oneWayBtn = screen.getByRole('button', { name: /m\u1ed9t chi\u1ec1u/i });
    fireEvent.click(oneWayBtn);
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    // Return date button should be gone
    expect(screen.queryByTestId('return-date-button')).toBeNull();
  });
});

describe('Passenger count modal', () => {
  it('opens and confirms passenger count', async () => {
    await renderApp();
    fireEvent.click(screen.getByTestId('passenger-count-button'));
    await act(async () => { await new Promise(r => setTimeout(r, 100)); });
    expect(screen.getByTestId('passenger-count-modal')).toBeTruthy();
    fireEvent.click(screen.getByTestId('confirm-button'));
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    expect(screen.queryByTestId('passenger-count-modal')).toBeNull();
  });
});

describe('Airport picker modal', () => {
  it('opens airport picker and filters airports', async () => {
    await renderApp();
    fireEvent.click(screen.getByTestId('origin-airport-button'));
    await act(async () => { await new Promise(r => setTimeout(r, 100)); });
    expect(screen.getByTestId('airport-picker-modal')).toBeTruthy();

    const searchInput = screen.getByTestId('airport-search-input');
    fireEvent.change(searchInput, { target: { value: 'SGN' } });
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });
    const airportBtns = screen.getAllByTestId('airport-item-button');
    expect(airportBtns.length).toBeGreaterThan(0);
  });
});

describe('Swap airports', () => {
  it('swaps origin and destination airports', async () => {
    await renderApp();

    await pickAirport('origin-airport-button', 0); // SGN
    await pickAirport('destination-airport-button', 2); // DLI

    fireEvent.click(screen.getByTestId('swap-airports-button'));
    await act(async () => { await new Promise(r => setTimeout(r, 50)); });

    const originBtn = screen.getByTestId('origin-airport-button');
    expect(originBtn.textContent).toContain('DLI');
  });
});

describe('App renders without session guard redirect', () => {
  it('stays on search when no session and screen guard triggers', async () => {
    await renderApp();
    expect(screen.getByTestId('search-button')).toBeTruthy();
  });
});
