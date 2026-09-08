import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from '../App';
import * as authFixture from '../fixtures/auth';
import * as paymentFixture from '../fixtures/payment';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  authFixture.setLoginOutcome('success');
  paymentFixture.setTestDriveSubmitOutcome('success');
});

describe('Test drive flow', () => {
  async function goToShowroomSelection() {
    render(<App />);
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi ti\u1ebft xe');
    fireEvent.click(screen.getByTestId('test-drive-cta'));
    await screen.findByTestId('login-prompt-dialog');
    fireEvent.click(screen.getByTestId('go-to-login'));
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await screen.findByText('Ch\u1ecdn showroom');
  }

  it('shows showroom list after login', async () => {
    await goToShowroomSelection();
    expect(await screen.findAllByTestId('showroom-card')).toBeTruthy();
  });

  it('navigates through full test drive flow', async () => {
    await goToShowroomSelection();
    const showrooms = await screen.findAllByTestId('showroom-card');
    fireEvent.click(showrooms[0]);
    await screen.findByText('Ch\u1ecdn ng\u00e0y gi\u1edd');
    const dateInput = screen.getByTestId('date-picker');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    const slots = await screen.findAllByTestId('time-slot');
    const availableSlot = slots.find(s => !s.hasAttribute('disabled'));
    if (availableSlot) fireEvent.click(availableSlot);
    fireEvent.click(screen.getByTestId('datetime-continue'));
    await screen.findByText('X\u00e1c nh\u1eadn l\u00e1i th\u1eed');
    fireEvent.click(screen.getByTestId('td-confirm-submit'));
    await waitFor(() => {
      expect(screen.getByText('\u0110\u1eb7t l\u1ecbch th\u00e0nh c\u00f4ng')).toBeTruthy();
    });
  });

  it('shows error on network failure during test drive booking', async () => {
    paymentFixture.setTestDriveSubmitOutcome('networkError');
    await goToShowroomSelection();
    const showrooms = await screen.findAllByTestId('showroom-card');
    fireEvent.click(showrooms[0]);
    await screen.findByText('Ch\u1ecdn ng\u00e0y gi\u1edd');
    const dateInput = screen.getByTestId('date-picker');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    const slots = await screen.findAllByTestId('time-slot');
    const availableSlot = slots.find(s => !s.hasAttribute('disabled'));
    if (availableSlot) fireEvent.click(availableSlot);
    fireEvent.click(screen.getByTestId('datetime-continue'));
    await screen.findByText('X\u00e1c nh\u1eadn l\u00e1i th\u1eed');
    fireEvent.click(screen.getByTestId('td-confirm-submit'));
    expect(await screen.findByTestId('td-confirm-error')).toBeTruthy();
  });
});
