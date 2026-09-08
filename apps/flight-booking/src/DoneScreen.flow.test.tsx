import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function navigateToCheckout() {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByTestId('origin-selector')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId('origin-selector'));
  await waitFor(() => { expect(screen.getByTestId('search-input')).toBeInTheDocument(); });
  fireEvent.click(screen.getAllByLabelText(/SGN/)[0]);

  await waitFor(() => { expect(screen.getByTestId('destination-selector')).toBeInTheDocument(); });
  fireEvent.click(screen.getByTestId('destination-selector'));
  await waitFor(() => { expect(screen.getByTestId('search-input')).toBeInTheDocument(); });
  fireEvent.click(screen.getAllByLabelText(/HAN/)[0]);

  await waitFor(() => { expect(screen.getByTestId('search-submit-action')).not.toBeDisabled(); });
  fireEvent.click(screen.getByTestId('search-submit-action'));
  await waitFor(() => { expect(screen.getByTestId('results-screen-title')).toBeInTheDocument(); });

  fireEvent.click(screen.getAllByTestId('fare-class-name')[0].closest('button') as HTMLElement);
  await waitFor(() => { expect(screen.getByTestId('continue-action')).not.toBeDisabled(); });
  fireEvent.click(screen.getByTestId('continue-action'));
  await waitFor(() => { expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Th\u00f4ng tin h\u00e0nh kh\u00e1ch'); });

  // Fill traveller
  fireEvent.click(screen.getAllByTestId('traveller-edit-action')[0]);
  await waitFor(() => { expect(screen.getByTestId('last-name-input')).toBeInTheDocument(); });
  fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Nguyen' } });
  fireEvent.change(screen.getByTestId('middle-first-name-input'), { target: { value: 'Van A' } });
  fireEvent.click(screen.getByTestId('confirm-action'));

  await waitFor(() => { expect(screen.getByTestId('continue-action')).toBeInTheDocument(); });
  fireEvent.click(screen.getByTestId('continue-action'));
  await waitFor(() => { expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('D\u1ecbch v\u1ee5 b\u1ed5 sung'); });

  fireEvent.click(screen.getByTestId('continue-action'));
  await waitFor(() => { expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('So\u00e1t l\u1ea1i chuy\u1ebfn bay'); });

  fireEvent.click(screen.getByTestId('continue-action'));
  await waitFor(() => { expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('X\u00e1c nh\u1eadn thanh to\u00e1n'); });
}

describe('Done screen flow', () => {
  it('navigates through full flow to checkout', async () => {
    await navigateToCheckout();
    expect(screen.getByTestId('pay-action')).toBeInTheDocument();
  });

  it('navigates to done after payment', async () => {
    await navigateToCheckout();
    await waitFor(() => {
      expect(screen.getByTestId('pay-action')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('pay-action'));
    await waitFor(() => {
      expect(screen.getByTestId('status-title')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('done screen has go home button that navigates to search', async () => {
    await navigateToCheckout();
    await waitFor(() => {
      expect(screen.getByTestId('pay-action')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('pay-action'));
    await waitFor(() => {
      expect(screen.getByTestId('go-home-action')).toBeInTheDocument();
    }, { timeout: 5000 });
    fireEvent.click(screen.getByTestId('go-home-action'));
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('T\u00ecm chuy\u1ebfn bay');
    });
  });
});