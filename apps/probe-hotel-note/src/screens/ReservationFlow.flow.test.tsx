import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from '../App';
import * as authFixture from '../fixtures/auth';
import * as paymentFixture from '../fixtures/payment';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  authFixture.setLoginOutcome('success');
  paymentFixture.setPaymentOutcome('success');
});

describe('Reservation flow', () => {
  async function goToReservationTerms() {
    render(<App />);
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi ti\u1ebft xe');
    fireEvent.click(screen.getByTestId('reserve-cta'));
    await screen.findByTestId('login-prompt-dialog');
    fireEvent.click(screen.getByTestId('go-to-login'));
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await screen.findByText('\u0110\u1eb7t c\u1ecdc gi\u1eef xe');
  }

  it('shows reservation terms after login', async () => {
    await goToReservationTerms();
    expect(await screen.findByText('50.000.000 \u20ab')).toBeTruthy();
  });

  it('navigates to payment after agreeing to terms', async () => {
    await goToReservationTerms();
    await screen.findByText('50.000.000 \u20ab');
    fireEvent.click(screen.getByTestId('terms-agree'));
    fireEvent.click(screen.getByTestId('confirm-pay'));
    await screen.findByText('Thanh to\u00e1n \u0111\u1eb7t c\u1ecdc');
  });

  it('completes full reservation flow', async () => {
    await goToReservationTerms();
    await screen.findByText('50.000.000 \u20ab');
    fireEvent.click(screen.getByTestId('terms-agree'));
    fireEvent.click(screen.getByTestId('confirm-pay'));
    await screen.findByText('Thanh to\u00e1n \u0111\u1eb7t c\u1ecdc');
    fireEvent.click(screen.getByTestId('payment-submit'));
    await waitFor(() => {
      expect(screen.getByText('\u0110\u1eb7t c\u1ecdc th\u00e0nh c\u00f4ng')).toBeTruthy();
    });
  });

  it('shows error on declined payment', async () => {
    paymentFixture.setPaymentOutcome('declined');
    await goToReservationTerms();
    await screen.findByText('50.000.000 \u20ab');
    fireEvent.click(screen.getByTestId('terms-agree'));
    fireEvent.click(screen.getByTestId('confirm-pay'));
    await screen.findByText('Thanh to\u00e1n \u0111\u1eb7t c\u1ecdc');
    fireEvent.click(screen.getByTestId('payment-submit'));
    expect(await screen.findByTestId('payment-error')).toBeTruthy();
  });
});
