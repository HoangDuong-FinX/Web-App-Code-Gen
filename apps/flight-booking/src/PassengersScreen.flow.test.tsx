import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function navigateToPassengers() {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByTestId('search-submit')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId('origin-field'));
  await waitFor(() => { expect(screen.getByText('Chon san bay')).toBeInTheDocument(); });
  fireEvent.click(screen.getByText('Tan Son Nhat'));

  await waitFor(() => { expect(screen.getByTestId('destination-field')).toBeInTheDocument(); });
  fireEvent.click(screen.getByTestId('destination-field'));
  await waitFor(() => { expect(screen.getByText('Chon san bay')).toBeInTheDocument(); });
  fireEvent.click(screen.getByText('Noi Bai'));

  await waitFor(() => { expect(screen.getByTestId('search-submit')).not.toBeDisabled(); });
  fireEvent.click(screen.getByTestId('search-submit'));

  await waitFor(() => { expect(screen.getByText('Chuyen bay di')).toBeInTheDocument(); });

  const fareButtons = screen.getAllByTestId('fare-class-option');
  const availableFare = fareButtons.find((btn) => !btn.hasAttribute('disabled'));
  if (availableFare) fireEvent.click(availableFare);

  fireEvent.click(screen.getByTestId('results-continue'));
  await waitFor(() => { expect(screen.getByText('Thong tin hanh khach')).toBeInTheDocument(); });
}

describe('PassengersScreen flow', () => {
  it('shows passenger form after navigating from results', async () => {
    await navigateToPassengers();
    expect(screen.getByText('Thong tin hanh khach')).toBeInTheDocument();
    expect(screen.getAllByTestId('passenger-form').length).toBeGreaterThan(0);
  });

  it('shows validation error when submitting empty form', async () => {
    await navigateToPassengers();
    fireEvent.click(screen.getByTestId('passengers-continue'));
    await waitFor(() => {
      expect(screen.getByTestId('validation-error-message')).toBeInTheDocument();
    });
  });
});
