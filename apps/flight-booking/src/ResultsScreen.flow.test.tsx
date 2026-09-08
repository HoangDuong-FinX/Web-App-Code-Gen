import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function navigateToResults() {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByTestId('origin-selector')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId('origin-selector'));
  await waitFor(() => {
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
  const sgnButtons = screen.getAllByLabelText(/SGN/);
  fireEvent.click(sgnButtons[0]);

  await waitFor(() => {
    expect(screen.getByTestId('destination-selector')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('destination-selector'));
  await waitFor(() => {
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
  const hanButtons = screen.getAllByLabelText(/HAN/);
  fireEvent.click(hanButtons[0]);

  await waitFor(() => {
    expect(screen.getByTestId('search-submit-action')).not.toBeDisabled();
  });
  fireEvent.click(screen.getByTestId('search-submit-action'));

  await waitFor(() => {
    expect(screen.getByTestId('results-screen-title')).toBeInTheDocument();
  });
}

describe('ResultsScreen flow', () => {
  it('shows flight offers after search', async () => {
    await navigateToResults();
    expect(screen.getByTestId('results-screen-title')).toHaveTextContent('Ch\u1ecdn chuy\u1ebfn bay');
    expect(screen.getByTestId('hold-timer-display')).toBeInTheDocument();
  });

  it('enables continue after selecting a fare', async () => {
    await navigateToResults();
    const continueBtn = screen.getByTestId('continue-action');
    expect(continueBtn).toBeDisabled();

    const fareButtons = screen.getAllByTestId('fare-class-name');
    fireEvent.click(fareButtons[0].closest('button') as HTMLElement);

    await waitFor(() => {
      expect(screen.getByTestId('continue-action')).not.toBeDisabled();
    });
  });

  it('navigates to passengers after continue', async () => {
    await navigateToResults();
    const fareButtons = screen.getAllByTestId('fare-class-name');
    fireEvent.click(fareButtons[0].closest('button') as HTMLElement);

    await waitFor(() => {
      expect(screen.getByTestId('continue-action')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('continue-action'));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Th\u00f4ng tin h\u00e0nh kh\u00e1ch');
    });
  });
});