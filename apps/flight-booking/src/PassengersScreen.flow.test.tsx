import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { PassengersScreen } from './screens/PassengersScreen';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const defaultCriteria = {
  origin: { code: 'SGN', name: 'T\u00E2n S\u01A1n Nh\u1EA5t', cityName: 'HCM', countryCode: 'VN' },
  destination: { code: 'HAN', name: 'N\u1ED9i B\u00E0i', cityName: 'HN', countryCode: 'VN' },
  tripType: 'one-way' as const,
  departureDate: '2026-01-15',
  returnDate: null,
  passengers: { adults: 1, children: 0, infants: 0 },
};

describe('PassengersScreen flow', () => {
  it('renders passenger form for one adult', () => {
    const onSubmitted = vi.fn();
    const onBack = vi.fn();
    const onHoldExpired = vi.fn();
    render(
      <PassengersScreen
        expiresAt={new Date(Date.now() + 600000).toISOString()}
        criteria={defaultCriteria}
        sessionId="sess-001"
        onSubmitted={onSubmitted}
        onBack={onBack}
        onHoldExpired={onHoldExpired}
      />,
    );
    expect(screen.getAllByTestId('last-name-input').length).toBe(1);
    expect(screen.getAllByTestId('first-middle-name-input').length).toBe(1);
  });

  it('shows validation error when submitting empty form', async () => {
    const onSubmitted = vi.fn();
    render(
      <PassengersScreen
        expiresAt={new Date(Date.now() + 600000).toISOString()}
        criteria={defaultCriteria}
        sessionId="sess-001"
        onSubmitted={onSubmitted}
        onBack={vi.fn()}
        onHoldExpired={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('continue-action'));
    await waitFor(() => {
      expect(screen.getByTestId('validation-error')).toBeTruthy();
    });
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it('back button calls onBack', () => {
    const onBack = vi.fn();
    render(
      <PassengersScreen
        expiresAt={new Date(Date.now() + 600000).toISOString()}
        criteria={defaultCriteria}
        sessionId="sess-001"
        onSubmitted={vi.fn()}
        onBack={onBack}
        onHoldExpired={vi.fn()}
      />,
    );
    const backBtn = screen.getAllByRole('button').find(b => b.getAttribute('aria-label') === 'Quay l\u1EA1i');
    expect(backBtn).toBeTruthy();
    if (backBtn) fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('submits successfully with filled form', async () => {
    const onSubmitted = vi.fn();
    render(
      <PassengersScreen
        expiresAt={new Date(Date.now() + 600000).toISOString()}
        criteria={defaultCriteria}
        sessionId="sess-001"
        onSubmitted={onSubmitted}
        onBack={vi.fn()}
        onHoldExpired={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByTestId('last-name-input'), { target: { value: 'Nguyen' } });
    fireEvent.change(screen.getByTestId('first-middle-name-input'), { target: { value: 'Van A' } });
    fireEvent.click(screen.getByTestId('continue-action'));
    await waitFor(() => {
      expect(onSubmitted).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });
});
