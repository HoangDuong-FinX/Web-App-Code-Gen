import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../App';
import { setSubmitReservationOutcome } from '../fixtures/cars';

afterEach(() => { cleanup(); vi.restoreAllMocks(); setSubmitReservationOutcome('success'); });

describe('Reservation flow', () => {
  function navigateToReservationForm(): void {
    render(<App />);
    const cards = screen.getAllByTestId('car-card');
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId('reserve-car-action'));
  }

  it('shows validation errors when submitting empty reservation form', () => {
    navigateToReservationForm();
    fireEvent.click(screen.getByTestId('review-action'));
    expect(screen.getByText('Vui l\u00f2ng nh\u1eadp h\u1ecd v\u00e0 t\u00ean')).toBeTruthy();
  });

  it('navigates to confirm screen after valid form', () => {
    navigateToReservationForm();
    fireEvent.change(screen.getByTestId('full-name-input'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '0912345678' } });
    fireEvent.change(screen.getByTestId('preferred-visit-date-input'), { target: { value: '2025-01-15' } });
    fireEvent.click(screen.getByTestId('review-action'));
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByTestId('confirm-action')).toBeTruthy();
    expect(screen.getByTestId('edit-action')).toBeTruthy();
  });

  it('navigates to success on confirmed reservation', () => {
    navigateToReservationForm();
    fireEvent.change(screen.getByTestId('full-name-input'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '0912345678' } });
    fireEvent.change(screen.getByTestId('preferred-visit-date-input'), { target: { value: '2025-01-15' } });
    fireEvent.click(screen.getByTestId('review-action'));
    fireEvent.click(screen.getByTestId('confirm-action'));
    expect(screen.getByText('\u0110\u1eb7t l\u1ecbch th\u00e0nh c\u00f4ng!')).toBeTruthy();
  });

  it('shows error on failed reservation', () => {
    setSubmitReservationOutcome('fail');
    navigateToReservationForm();
    fireEvent.change(screen.getByTestId('full-name-input'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '0912345678' } });
    fireEvent.change(screen.getByTestId('preferred-visit-date-input'), { target: { value: '2025-01-15' } });
    fireEvent.click(screen.getByTestId('review-action'));
    fireEvent.click(screen.getByTestId('confirm-action'));
    expect(screen.getByTestId('error-banner')).toBeTruthy();
  });
});
