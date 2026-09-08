import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
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
    await screen.findByText('Xe nổi bật');
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi tiết xe');
    fireEvent.click(screen.getByTestId('reserve-cta'));
    await screen.findByTestId('login-prompt-dialog');
    fireEvent.click(screen.getByTestId('go-to-login'));
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await screen.findByText('Đặt cọc giữ xe');
  }

  it('shows reservation terms after login', async () => {
    await goToReservationTerms();
    expect(await screen.findByText('50.000.000 ₫')).toBeTruthy();
  });

  it('navigates to payment after agreeing to terms', async () => {
    await goToReservationTerms();
    await screen.findByText('50.000.000 ₫');
    fireEvent.click(screen.getByTestId('terms-agree'));
    fireEvent.click(screen.getByTestId('confirm-pay'));
    await screen.findByText('Thanh toán đặt cọc');
  });

  it('completes full reservation flow', async () => {
    await goToReservationTerms();
    await screen.findByText('50.000.000 ₫');
    fireEvent.click(screen.getByTestId('terms-agree'));
    fireEvent.click(screen.getByTestId('confirm-pay'));
    await screen.findByText('Thanh toán đặt cọc');
    fireEvent.click(screen.getByTestId('payment-submit'));
    await waitFor(() => {
      expect(screen.getByText('Đặt cọc thành công')).toBeTruthy();
    });
  });

  it('shows error on declined payment', async () => {
    paymentFixture.setPaymentOutcome('declined');
    await goToReservationTerms();
    await screen.findByText('50.000.000 ₫');
    fireEvent.click(screen.getByTestId('terms-agree'));
    fireEvent.click(screen.getByTestId('confirm-pay'));
    await screen.findByText('Thanh toán đặt cọc');
    fireEvent.click(screen.getByTestId('payment-submit'));
    expect(await screen.findByTestId('payment-error')).toBeTruthy();
  });
});
