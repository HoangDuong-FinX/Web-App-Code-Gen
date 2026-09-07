import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import App from '../App';
import * as bookingService from '../fixtures/bookingService';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  bookingService.setSubmitSearchOutcome('success');
  bookingService.setLoadAirportsOutcome('success');
  bookingService.setLoadCityPairsOutcome('success');
  bookingService.setSubmitPassengersOutcome('success');
});

async function navigateToPassengers(app: ReturnType<typeof render>) {
  // Get to results
  await waitFor(() => {
    const btn = app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i });
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  }, { timeout: 2000 });
  await act(async () => { fireEvent.click(app.getByRole('button', { name: /T\u00ECm ki\u1EBFm chuy\u1EBFn bay/i })); });
  // Wait for results
  await waitFor(() => app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u \u0111i'), { timeout: 3000 });
  // Select outbound fare
  await waitFor(() => app.getAllByTestId('select-fare-button').length > 0);
  await act(async () => { fireEvent.click(app.getAllByTestId('select-fare-button')[0]); });
  // Now on results-return (round-trip) - select return fare
  await waitFor(() => app.getByText('Ch\u1ECDn v\u00E9 chi\u1EC1u v\u1EC1'), { timeout: 3000 });
  await waitFor(() => app.getAllByTestId('select-fare-button').length > 0);
  await act(async () => { fireEvent.click(app.getAllByTestId('select-fare-button')[0]); });
  // Now on passengers
  await waitFor(() => app.getByText('Th\u00F4ng tin h\u00E0nh kh\u00E1ch'), { timeout: 3000 });
}

describe('PassengersScreen flow', () => {
  it('shows passengers screen after selecting flights', async () => {
    const app = render(<App />);
    await navigateToPassengers(app);
    expect(app.getByText('Th\u00F4ng tin h\u00E0nh kh\u00E1ch')).toBeDefined();
  });

  it('shows validation error when required fields are empty', async () => {
    const app = render(<App />);
    await navigateToPassengers(app);
    const continueBtn = app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn b\u01B0\u1EDBc d\u1ECBch v\u1ee5/i });
    await act(async () => { fireEvent.click(continueBtn); });
    await waitFor(() => {
      const errors = app.getAllByTestId('passenger-validation-error');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it('navigates to services after valid passenger submission', async () => {
    const app = render(<App />);
    await navigateToPassengers(app);

    // Fill in required fields for all passengers
    const lastNameInputs = app.getAllByTestId('last-name-input');
    const firstNameInputs = app.getAllByTestId('first-name-input');
    for (let i = 0; i < lastNameInputs.length; i++) {
      fireEvent.change(lastNameInputs[i], { target: { value: 'Nguyen' } });
      fireEvent.change(firstNameInputs[i], { target: { value: 'Van A' } });
    }

    const continueBtn = app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn b\u01B0\u1EDBc d\u1ECBch v\u1ee5/i });
    await act(async () => { fireEvent.click(continueBtn); });

    await waitFor(() => {
      expect(app.getByText('D\u1ECBch v\u1ee5 & ch\u1ECDn gh\u1EBF')).toBeDefined();
    }, { timeout: 3000 });
  });

  it('shows submit error when passenger API fails', async () => {
    bookingService.setSubmitPassengersOutcome('fail');
    const app = render(<App />);
    await navigateToPassengers(app);

    const lastNameInputs = app.getAllByTestId('last-name-input');
    const firstNameInputs = app.getAllByTestId('first-name-input');
    for (let i = 0; i < lastNameInputs.length; i++) {
      fireEvent.change(lastNameInputs[i], { target: { value: 'Nguyen' } });
      fireEvent.change(firstNameInputs[i], { target: { value: 'Van A' } });
    }

    const continueBtn = app.getByRole('button', { name: /Ti\u1EBFp t\u1ee5c \u0111\u1EBFn b\u01B0\u1EDBc d\u1ECBch v\u1ee5/i });
    await act(async () => { fireEvent.click(continueBtn); });

    await waitFor(() => {
      expect(app.getByTestId('passenger-submit-error')).toBeDefined();
    }, { timeout: 3000 });
  });
});
