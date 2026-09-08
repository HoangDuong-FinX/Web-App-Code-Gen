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
  paymentFixture.setInquirySubmitOutcome('success');
});

describe('Inquiry flow', () => {
  async function goToCarDetailLoggedIn() {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    // Navigate to car detail
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi tiết xe');
    // Tap inquiry CTA - should show login prompt since not logged in
    fireEvent.click(screen.getByTestId('inquiry-cta'));
    // Login prompt appears
    await screen.findByTestId('login-prompt-dialog');
    fireEvent.click(screen.getByTestId('go-to-login'));
    // Login
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    // Should navigate to inquiry form
    await screen.findByText('Liên hệ tư vấn');
  }

  it('shows inquiry form after login from car detail', async () => {
    await goToCarDetailLoggedIn();
    expect(screen.getByTestId('inquiry-continue')).toBeTruthy();
  });

  it('navigates to inquiry confirm then success', async () => {
    await goToCarDetailLoggedIn();
    fireEvent.click(screen.getByTestId('inquiry-continue'));
    await screen.findByText('Xác nhận yêu cầu');
    fireEvent.click(screen.getByTestId('inquiry-submit'));
    await waitFor(() => {
      expect(screen.getByText('Yêu cầu đã được gửi')).toBeTruthy();
    });
  });

  it('shows error on failed inquiry submit', async () => {
    paymentFixture.setInquirySubmitOutcome('fail');
    await goToCarDetailLoggedIn();
    fireEvent.click(screen.getByTestId('inquiry-continue'));
    await screen.findByText('Xác nhận yêu cầu');
    fireEvent.click(screen.getByTestId('inquiry-submit'));
    expect(await screen.findByTestId('inquiry-submit-error')).toBeTruthy();
  });
});
