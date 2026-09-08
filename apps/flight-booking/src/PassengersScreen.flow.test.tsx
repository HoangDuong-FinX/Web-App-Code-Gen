import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

async function navigateToPassengers() {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByTestId('origin-selector')).toBeInTheDocument();
  });

  fireEvent.click(screen.getByTestId('origin-selector'));
  await waitFor(() => {
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
  fireEvent.click(screen.getAllByLabelText(/SGN/)[0]);

  await waitFor(() => {
    expect(screen.getByTestId('destination-selector')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('destination-selector'));
  await waitFor(() => {
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });
  fireEvent.click(screen.getAllByLabelText(/HAN/)[0]);

  await waitFor(() => {
    expect(screen.getByTestId('search-submit-action')).not.toBeDisabled();
  });
  fireEvent.click(screen.getByTestId('search-submit-action'));

  await waitFor(() => {
    expect(screen.getByTestId('results-screen-title')).toBeInTheDocument();
  });

  fireEvent.click(screen.getAllByTestId('fare-class-name')[0].closest('button') as HTMLElement);
  await waitFor(() => {
    expect(screen.getByTestId('continue-action')).not.toBeDisabled();
  });
  fireEvent.click(screen.getByTestId('continue-action'));

  await waitFor(() => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Th\u00f4ng tin h\u00e0nh kh\u00e1ch');
  });
}

describe('PassengersScreen flow', () => {
  it('shows passenger cards', async () => {
    await navigateToPassengers();
    expect(screen.getAllByTestId('traveller-label').length).toBeGreaterThan(0);
  });

  it('opens traveller detail sheet on edit', async () => {
    await navigateToPassengers();
    const editButtons = screen.getAllByTestId('traveller-edit-action');
    fireEvent.click(editButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId('last-name-input')).toBeInTheDocument();
    });
  });

  it('validates required fields and opens sheet on invalid submit', async () => {
    await navigateToPassengers();
    fireEvent.click(screen.getByTestId('continue-action'));
    await waitFor(() => {
      expect(screen.getByTestId('last-name-input')).toBeInTheDocument();
    });
  });
});