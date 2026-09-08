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
  paymentFixture.setTestDriveSubmitOutcome('success');
});

describe('Test drive flow', () => {
  async function goToShowroomSelection() {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi tiết xe');
    // Guest user taps test drive
    fireEvent.click(screen.getByTestId('test-drive-cta'));
    await screen.findByTestId('login-prompt-dialog');
    fireEvent.click(screen.getByTestId('go-to-login'));
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await screen.findByText('Chọn showroom');
  }

  it('shows showroom list after login', async () => {
    await goToShowroomSelection();
    expect(await screen.findAllByTestId('showroom-card')).toBeTruthy();
  });

  it('navigates through full test drive flow', async () => {
    await goToShowroomSelection();
    const showrooms = await screen.findAllByTestId('showroom-card');
    fireEvent.click(showrooms[0]);
    await screen.findByText('Chọn ngày giờ');
    // Select date
    const dateInput = screen.getByTestId('date-picker');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    // Wait for time slots
    const slots = await screen.findAllByTestId('time-slot');
    // Click first available slot
    const availableSlot = slots.find(s => !s.hasAttribute('disabled'));
    if (availableSlot) fireEvent.click(availableSlot);
    fireEvent.click(screen.getByTestId('datetime-continue'));
    await screen.findByText('Xác nhận lái thử');
    fireEvent.click(screen.getByTestId('td-confirm-submit'));
    await waitFor(() => {
      expect(screen.getByText('Đặt lịch thành công')).toBeTruthy();
    });
  });

  it('shows error on network failure during test drive booking', async () => {
    paymentFixture.setTestDriveSubmitOutcome('networkError');
    await goToShowroomSelection();
    const showrooms = await screen.findAllByTestId('showroom-card');
    fireEvent.click(showrooms[0]);
    await screen.findByText('Chọn ngày giờ');
    const dateInput = screen.getByTestId('date-picker');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    const slots = await screen.findAllByTestId('time-slot');
    const availableSlot = slots.find(s => !s.hasAttribute('disabled'));
    if (availableSlot) fireEvent.click(availableSlot);
    fireEvent.click(screen.getByTestId('datetime-continue'));
    await screen.findByText('Xác nhận lái thử');
    fireEvent.click(screen.getByTestId('td-confirm-submit'));
    expect(await screen.findByTestId('td-confirm-error')).toBeTruthy();
  });
});
