import { render, screen, fireEvent, act, waitFor, cleanup } from '@testing-library/react';
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

// Render App and wait for master data to load (airports + city pairs fixtures)
async function renderApp() {
  const result = render(<App />);
  // Wait for master data: airports (300ms) + city pairs (200ms) + buffer
  await act(async () => {
    await new Promise(r => setTimeout(r, 800));
  });
  return result;
}

// Open airport picker, wait for items, pick by index
async function pickAirport(buttonTestId: string, itemIndex: number) {
  await act(async () => {
    fireEvent.click(screen.getByTestId(buttonTestId));
  });
  // Wait for modal + airport items to render
  await waitFor(() => {
    const items = screen.queryAllByTestId('airport-item-button');
    if (items.length === 0) throw new Error('airport items not yet rendered');
  }, { timeout: 2000 });
  const items = screen.getAllByTestId('airport-item-button');
  await act(async () => {
    fireEvent.click(items[itemIndex]);
  });
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

    // Pick SGN (index 0) as origin, DLI (index 2) as destination
    await pickAirport('origin-airport-button', 0);
    await pickAirport('destination-airport-button', 2);

    // Trigger search and wait for navigation
    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1500));
    });

    expect(screen.getByTestId('results-title')).toBeTruthy();
  });
});

describe('Search failure path', () => {
  it('shows search error when fixture fails', async () => {
    setSearchOutcome('fail');
    await renderApp();

    await pickAirport('origin-airport-button', 0);
    await pickAirport('destination-airport-button', 2);

    await act(async () => {
      fireEvent.click(screen.getByTestId('search-button'));
      await new Promise(r => setTimeout(r, 1500));
    });

    expect(screen.getByTestId('search-error')).toBeTruthy();
  });
});

describe('Trip type toggle', () => {
  it('switches between round-trip and one-way', async () => {
    await renderApp();
    const oneWayBtn = screen.getByRole('button', { name: /m\u1ed9t chi\u1ec1u/i });
    await act(async () => { fireEvent.click(oneWayBtn); });
    // Return date button should be gone after switching to one-way
    expect(screen.queryByTestId('return-date-button')).toBeNull();
  });
});

describe('Passenger count modal', () => {
  it('opens and confirms passenger count', async () => {
    await renderApp();
    await act(async () => {
      fireEvent.click(screen.getByTestId('passenger-count-button'));
    });
    expect(screen.getByTestId('passenger-count-modal')).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByTestId('confirm-button'));
    });
    expect(screen.queryByTestId('passenger-count-modal')).toBeNull();
  });
});

describe('Airport picker modal', () => {
  it('opens airport picker and filters airports', async () => {
    await renderApp();
    await act(async () => {
      fireEvent.click(screen.getByTestId('origin-airport-button'));
    });
    expect(screen.getByTestId('airport-picker-modal')).toBeTruthy();

    // Wait for airport items to appear
    await waitFor(() => {
      expect(screen.getAllByTestId('airport-item-button').length).toBeGreaterThan(0);
    }, { timeout: 2000 });

    const searchInput = screen.getByTestId('airport-search-input');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'SGN' } });
    });
    const airportBtns = screen.getAllByTestId('airport-item-button');
    expect(airportBtns.length).toBeGreaterThan(0);
  });
});

describe('Swap airports', () => {
  it('swaps origin and destination airports', async () => {
    await renderApp();

    await pickAirport('origin-airport-button', 0); // SGN
    await pickAirport('destination-airport-button', 2); // DLI

    await act(async () => {
      fireEvent.click(screen.getByTestId('swap-airports-button'));
    });

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
