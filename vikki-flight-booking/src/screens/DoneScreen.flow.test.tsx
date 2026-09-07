import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import App from '../App';
import * as bookingService from '../fixtures/bookingService';
import * as paymentHub from '../fixtures/paymentHub';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  bookingService.setSubmitSearchOutcome('success');
  bookingService.setLoadAirportsOutcome('success');
  bookingService.setLoadCityPairsOutcome('success');
  bookingService.setSubmitPassengersOutcome('success');
  bookingService.setSubmitAncillaryOutcome('success');
  bookingService.setSubmitSeatsOutcome('success');
  bookingService.setFetchPaymentPayloadOutcome('success');
  paymentHub.setPaymentOutcome('success');
});

async function navigateToDone(app: ReturnType<typeof render>) {
  await waitFor(() => {
    const btn = app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  }, { timeout: 2000 });
  await act(async () => { fireEvent.click(app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i })); });
  await waitFor(() => app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u \u0111i'), { timeout: 3000 });
  await waitFor(() => app.getAllByTestId('select-fare-button').length > 0);
  await act(async () => { fireEvent.click(app.getAllByTestId('select-fare-button')[0]); });
  await waitFor(() => app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u v\u1EC1'), { timeout: 3000 });
  await waitFor(() => app.getAllByTestId('select-fare-button').length > 0);
  await act(async () => { fireEvent.click(app.getAllByTestId('select-fare-button')[0]); });
  await waitFor(() => app.getByText('Th\u00F4ng tin h\u00E0nh kh\u00E1ch'), { timeout: 3000 });
  const lastNameInputs = app.getAllByTestId('last-name-input');
  const firstNameInputs = app.getAllByTestId('first-name-input');
  for (let i = 0; i < lastNameInputs.length; i++) {
    fireEvent.change(lastNameInputs[i], { target: { value: 'Nguyen' } });
    fireEvent.change(firstNameInputs[i], { target: { value: 'Van A' } });
  }
  await act(async () => { fireEvent.click(app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn b\u01B0\u1EDBc d\u1ECBch v\u1ee5/i })); });
  await waitFor(() => app.getByText('D\u1ECBch v\u1ee5 & ch\u1ECDn gh\u1EBF'), { timeout: 3000 });
  await act(async () => { fireEvent.click(app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn so\u00E1t l\u1EA1i/i })); });
  await waitFor(() => app.getByText('So\u00E1t l\u1EA1i chuy\u1EBFn bay'), { timeout: 3000 });
  await act(async () => { fireEvent.click(app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn thanh to\u00E1n/i })); });
  await waitFor(() => app.getByText('X\u00E1c nh\u1EADn tr\u1EA3 ti\u1EC1n'), { timeout: 3000 });
  await waitFor(() => {
    const payBtn = app.getByRole('button', { name: /Thanh to\u00E1n ngay/i });
    expect((payBtn as HTMLButtonElement).disabled).toBe(false);
  }, { timeout: 3000 });
  await act(async () => { fireEvent.click(app.getByRole('button', { name: /Thanh to\u00E1n ngay/i })); });
  await waitFor(() => app.getByTestId('result-title'), { timeout: 5000 });
}

describe('DoneScreen flow', () => {
  it('shows success state with booking code', async () => {
    const app = render(<App />);
    await navigateToDone(app);
    expect(app.getByText('Thanh to\u00E1n th\u00E0nh c\u00F4ng!')).toBeDefined();
    expect(app.getByTestId('result-amount')).toBeDefined();
    expect(app.getByTestId('result-status-icon')).toBeDefined();
  });

  it('shows book-another and go-home buttons on success', async () => {
    const app = render(<App />);
    await navigateToDone(app);
    expect(app.getByRole('button', { name: /\u0110\u1EB7t v\u00E9 m\u00E1y bay kh\u00E1c/i })).toBeDefined();
    expect(app.getByRole('button', { name: /V\u1EC1 trang ch\u1EE7/i })).toBeDefined();
  });

  it('resets to search screen when book-another is clicked', async () => {
    const app = render(<App />);
    await navigateToDone(app);
    await act(async () => { fireEvent.click(app.getByRole('button', { name: /\u0110\u1EB7t v\u00E9 m\u00E1y bay kh\u00E1c/i })); });
    await waitFor(() => {
      expect(app.getByText('T\u00ECm chuy\u1EBFn')).toBeDefined();
    });
  });

  it('shows retry button on failed state', async () => {
    paymentHub.setPaymentOutcome('failed');
    const app = render(<App />);
    // Navigate to checkout without going all the way through done helper
    await waitFor(() => {
      const btn = app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    }, { timeout: 2000 });
    await act(async () => { fireEvent.click(app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i })); });
    await waitFor(() => app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u \u0111i'), { timeout: 3000 });
    await waitFor(() => app.getAllByTestId('select-fare-button').length > 0);
    await act(async () => { fireEvent.click(app.getAllByTestId('select-fare-button')[0]); });
    await waitFor(() => app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u v\u1EC1'), { timeout: 3000 });
    await waitFor(() => app.getAllByTestId('select-fare-button').length > 0);
    await act(async () => { fireEvent.click(app.getAllByTestId('select-fare-button')[0]); });
    await waitFor(() => app.getByText('Th\u00F4ng tin h\u00E0nh kh\u00E1ch'), { timeout: 3000 });
    const lastNameInputs = app.getAllByTestId('last-name-input');
    const firstNameInputs = app.getAllByTestId('first-name-input');
    for (let i = 0; i < lastNameInputs.length; i++) {
      fireEvent.change(lastNameInputs[i], { target: { value: 'Nguyen' } });
      fireEvent.change(firstNameInputs[i], { target: { value: 'Van A' } });
    }
    await act(async () => { fireEvent.click(app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn b\u01B0\u1EDBc d\u1ECBch v\u1ee5/i })); });
    await waitFor(() => app.getByText('D\u1ECBch v\u1ee5 & ch\u1ECDn gh\u1EBF'), { timeout: 3000 });
    await act(async () => { fireEvent.click(app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn so\u00E1t l\u1EA1i/i })); });
    await waitFor(() => app.getByText('So\u00E1t l\u1EA1i chuy\u1EBFn bay'), { timeout: 3000 });
    await act(async () => { fireEvent.click(app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn thanh to\u00E1n/i })); });
    await waitFor(() => app.getByText('X\u00E1c nh\u1EADn tr\u1EA3 ti\u1EC1n'), { timeout: 3000 });
    await waitFor(() => {
      const payBtn = app.getByRole('button', { name: /Thanh to\u00E1n ngay/i });
      expect((payBtn as HTMLButtonElement).disabled).toBe(false);
    }, { timeout: 3000 });
    await act(async () => { fireEvent.click(app.getByRole('button', { name: /Thanh to\u00E1n ngay/i })); });
    await waitFor(() => app.getByText('Thanh to\u00E1n th\u1EA5t b\u1EA1i'), { timeout: 5000 });
    expect(app.getByRole('button', { name: /Th\u1EED l\u1EA1i thanh to\u00E1n/i })).toBeDefined();
  });
});
