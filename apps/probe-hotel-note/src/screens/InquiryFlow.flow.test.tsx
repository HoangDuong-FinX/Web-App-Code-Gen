import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
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
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi ti\u1ebft xe');
    fireEvent.click(screen.getByTestId('inquiry-cta'));
    await screen.findByTestId('login-prompt-dialog');
    fireEvent.click(screen.getByTestId('go-to-login'));
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await screen.findByText('Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n');
  }

  it('shows inquiry form after login from car detail', async () => {
    await goToCarDetailLoggedIn();
    expect(screen.getByTestId('inquiry-continue')).toBeTruthy();
  });

  it('navigates to inquiry confirm then success', async () => {
    await goToCarDetailLoggedIn();
    fireEvent.click(screen.getByTestId('inquiry-continue'));
    await screen.findByText('X\u00e1c nh\u1eadn y\u00eau c\u1ea7u');
    fireEvent.click(screen.getByTestId('inquiry-submit'));
    await waitFor(() => {
      expect(screen.getByText('Y\u00eau c\u1ea7u \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi')).toBeTruthy();
    });
  });

  it('shows error on failed inquiry submit', async () => {
    paymentFixture.setInquirySubmitOutcome('fail');
    await goToCarDetailLoggedIn();
    fireEvent.click(screen.getByTestId('inquiry-continue'));
    await screen.findByText('X\u00e1c nh\u1eadn y\u00eau c\u1ea7u');
    fireEvent.click(screen.getByTestId('inquiry-submit'));
    expect(await screen.findByTestId('inquiry-submit-error')).toBeTruthy();
  });
});
