import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SearchScreen flow', () => {
  it('renders search screen on mount', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('T\u00ecm chuy\u1ebfn bay');
    });
  });

  it('shows trip type toggle', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByLabelText('M\u1ed9t chi\u1ec1u')).toBeInTheDocument();
      expect(screen.getByLabelText('Kh\u1ee9 h\u1ed3i')).toBeInTheDocument();
    });
  });

  it('opens airport picker when origin is tapped', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('origin-selector')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('origin-selector'));
    await waitFor(() => {
      expect(screen.getByText('Ch\u1ecdn s\u00e2n bay')).toBeInTheDocument();
    });
  });

  it('navigates to results after search', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('origin-selector')).toBeInTheDocument();
    });

    // Select origin
    fireEvent.click(screen.getByTestId('origin-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
    const sgnButtons = screen.getAllByLabelText(/SGN/);
    fireEvent.click(sgnButtons[0]);

    // Select destination
    await waitFor(() => {
      expect(screen.getByTestId('destination-selector')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('destination-selector'));
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
    const hanButtons = screen.getAllByLabelText(/HAN/);
    fireEvent.click(hanButtons[0]);

    // Search
    await waitFor(() => {
      expect(screen.getByTestId('search-submit-action')).not.toBeDisabled();
    });
    fireEvent.click(screen.getByTestId('search-submit-action'));

    await waitFor(() => {
      expect(screen.getByTestId('results-screen-title')).toHaveTextContent('Ch\u1ecdn chuy\u1ebfn bay');
    });
  });
});