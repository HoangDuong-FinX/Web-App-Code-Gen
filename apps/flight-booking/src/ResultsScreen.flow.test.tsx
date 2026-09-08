import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Helper to navigate to results screen
async function navigateToResults() {
  render(<App />);

  // Select origin
  fireEvent.click(screen.getByTestId('origin-field'));
  await waitFor(() => {
    expect(screen.getAllByTestId('airport-item').length).toBeGreaterThan(0);
  });
  fireEvent.click(screen.getAllByTestId('airport-item')[0]);

  // Select destination
  await waitFor(() => {
    expect(screen.getByTestId('destination-field')).toBeTruthy();
  });
  fireEvent.click(screen.getByTestId('destination-field'));
  await waitFor(() => {
    expect(screen.getAllByTestId('airport-item').length).toBeGreaterThan(0);
  });
  // Pick a different airport
  const airports = screen.getAllByTestId('airport-item');
  const enabledAirport = airports.find(a => !(a as HTMLButtonElement).disabled);
  if (enabledAirport) fireEvent.click(enabledAirport);

  // Select departure date
  await waitFor(() => {
    expect(screen.getByTestId('departure-date-field')).toBeTruthy();
  });
  fireEvent.click(screen.getByTestId('departure-date-field'));
  await waitFor(() => {
    const cells = screen.getAllByTestId('day-cell');
    expect(cells.length).toBeGreaterThan(0);
  });
  const enabledCell = screen.getAllByTestId('day-cell').find(c => !(c as HTMLButtonElement).disabled);
  if (enabledCell) fireEvent.click(enabledCell);
  fireEvent.click(screen.getByTestId('confirm-action'));

  // Wait for search button to be enabled then click
  await waitFor(() => {
    const searchBtn = screen.getByTestId('search-action');
    expect((searchBtn as HTMLButtonElement).disabled).toBe(false);
  }, { timeout: 3000 });
  fireEvent.click(screen.getByTestId('search-action'));

  // Wait for results screen
  await waitFor(() => {
    expect(screen.getByTestId('hold-timer')).toBeTruthy();
  }, { timeout: 3000 });
}

describe('ResultsScreen flow', () => {
  it('navigates from search to results after successful search', async () => {
    await navigateToResults();
    expect(screen.getByTestId('hold-timer')).toBeTruthy();
  });

  it('back button returns to search from results', async () => {
    await navigateToResults();
    // Find back button (arrow left)
    const backBtn = screen.getAllByRole('button').find(b => b.getAttribute('aria-label') === 'Quay l\u1EA1i');
    expect(backBtn).toBeTruthy();
    if (backBtn) fireEvent.click(backBtn);
    await waitFor(() => {
      expect(screen.getByTestId('search-action')).toBeTruthy();
    });
  });
});
