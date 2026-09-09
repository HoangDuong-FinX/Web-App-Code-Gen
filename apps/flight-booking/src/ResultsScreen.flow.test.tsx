import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function navigateToResults() {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('search-submit')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId('origin-field'));
  await waitFor(() => {
    expect(screen.getByText('Chon san bay')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('Tan Son Nhat'));

  await waitFor(() => {
    expect(screen.getByTestId('destination-field')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('destination-field'));
  await waitFor(() => {
    expect(screen.getByText('Chon san bay')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText('Noi Bai'));

  await waitFor(() => {
    expect(screen.getByTestId('search-submit')).not.toBeDisabled();
  });
  fireEvent.click(screen.getByTestId('search-submit'));

  await waitFor(() => {
    expect(screen.getByText('Chuyen bay di')).toBeInTheDocument();
  });
}

describe('ResultsScreen flow', () => {
  it('shows outbound flights after search', async () => {
    await navigateToResults();
    expect(screen.getByText('Chuyen bay di')).toBeInTheDocument();
    expect(screen.getAllByTestId('flight-card').length).toBeGreaterThan(0);
  });

  it('continue button is disabled until a fare is selected', async () => {
    await navigateToResults();
    const continueBtn = screen.getByTestId('results-continue');
    expect(continueBtn).toBeDisabled();
  });

  it('selecting a fare enables the continue button', async () => {
    await navigateToResults();
    const fareButtons = screen.getAllByTestId('fare-class-option');
    const availableFare = fareButtons.find((btn) => !btn.hasAttribute('disabled'));
    if (availableFare) {
      fireEvent.click(availableFare);
      const continueBtn = screen.getByTestId('results-continue');
      expect(continueBtn).not.toBeDisabled();
    }
  });
});
