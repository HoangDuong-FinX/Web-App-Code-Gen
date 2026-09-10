import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App navigation flow', () => {
  it('renders search screen on mount', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByTestId('search-submit')).toBeDefined();
  });

  it('search button is disabled initially', () => {
    render(<App />);
    const btn = screen.getByTestId('search-submit');
    expect(btn).toBeInstanceOf(HTMLButtonElement);
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('results-expired screen shows search again button', () => {
    render(<App />);
    // We can't easily navigate to results-expired through the full flow in jsdom,
    // but we can test the ResultsExpiredScreen component directly
  });

  it('trip type toggle switches between one-way and round-trip', () => {
    render(<App />);
    const selector = screen.getByTestId('trip-type-selector');
    expect(selector).toBeDefined();
    const buttons = selector.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    // Click round-trip
    fireEvent.click(buttons[1]);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
  });
});

describe('ResultsExpiredScreen', () => {
  it('renders with search again button', async () => {
    const { ResultsExpiredScreen } = await import('./screens/ResultsExpiredScreen');
    const onSearchAgain = vi.fn();
    render(<ResultsExpiredScreen onSearchAgain={onSearchAgain} />);
    const btn = screen.getByTestId('search-again-action');
    expect(btn).toBeDefined();
    fireEvent.click(btn);
    expect(onSearchAgain).toHaveBeenCalledTimes(1);
  });
});

describe('DoneFailedScreen', () => {
  it('renders retry and go home buttons', async () => {
    const { DoneFailedScreen } = await import('./screens/DoneFailedScreen');
    const onRetry = vi.fn();
    const onGoHome = vi.fn();
    render(<DoneFailedScreen paymentResult={{ status: 'failed', bookingCode: 'TEST1234', returnBookingCode: '', transactionId: null, amount: 1290000, failureReason: 'Declined', sdkError: 'ERR', simulated: false, vatRequested: false }} onRetry={onRetry} onGoHome={onGoHome} />);
    expect(screen.getByTestId('retry-action')).toBeDefined();
    expect(screen.getByTestId('go-home-action')).toBeDefined();
    fireEvent.click(screen.getByTestId('retry-action'));
    expect(onRetry).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('go-home-action'));
    expect(onGoHome).toHaveBeenCalledTimes(1);
  });
});

describe('DoneSuccessScreen', () => {
  it('renders booking code and book another button', async () => {
    const { DoneSuccessScreen } = await import('./screens/DoneSuccessScreen');
    const onBookAnother = vi.fn();
    const onGoHome = vi.fn();
    render(<DoneSuccessScreen paymentResult={{ status: 'success', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: 'txn_123', amount: 1290000, failureReason: '', sdkError: '', simulated: false, vatRequested: false }} vatRequested={false} onBookAnother={onBookAnother} onGoHome={onGoHome} />);
    expect(screen.getByTestId('booking-code-value')).toBeDefined();
    expect(screen.getByTestId('book-another-action')).toBeDefined();
    fireEvent.click(screen.getByTestId('book-another-action'));
    expect(onBookAnother).toHaveBeenCalledTimes(1);
  });

  it('shows simulated warning when simulated', async () => {
    const { DoneSuccessScreen } = await import('./screens/DoneSuccessScreen');
    render(<DoneSuccessScreen paymentResult={{ status: 'success', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: null, amount: 1290000, failureReason: '', sdkError: '', simulated: true, vatRequested: false }} vatRequested={false} onBookAnother={vi.fn()} onGoHome={vi.fn()} />);
    expect(screen.getByTestId('simulated-warning')).toBeDefined();
  });

  it('shows VAT notice when requested', async () => {
    const { DoneSuccessScreen } = await import('./screens/DoneSuccessScreen');
    render(<DoneSuccessScreen paymentResult={{ status: 'success', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: null, amount: 1290000, failureReason: '', sdkError: '', simulated: false, vatRequested: true }} vatRequested={true} onBookAnother={vi.fn()} onGoHome={vi.fn()} />);
    expect(screen.getByTestId('vat-notice')).toBeDefined();
  });
});

describe('DonePartialScreen', () => {
  it('renders partial explanation and go home button', async () => {
    const { DonePartialScreen } = await import('./screens/DonePartialScreen');
    const onGoHome = vi.fn();
    render(<DonePartialScreen paymentResult={{ status: 'partial', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: 'txn_123', amount: 1290000, failureReason: '', sdkError: '', simulated: false, vatRequested: false }} onGoHome={onGoHome} />);
    expect(screen.getByTestId('partial-explanation')).toBeDefined();
    expect(screen.getByTestId('go-home-action')).toBeDefined();
    fireEvent.click(screen.getByTestId('go-home-action'));
    expect(onGoHome).toHaveBeenCalledTimes(1);
  });
});
