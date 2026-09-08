import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../App';
import { setSubmitInquiryOutcome } from '../fixtures/cars';

afterEach(() => { cleanup(); vi.restoreAllMocks(); setSubmitInquiryOutcome('success'); });

describe('Inquiry form flow', () => {
  function navigateToInquiryForm(): void {
    render(<App />);
    const cards = screen.getAllByTestId('car-card');
    fireEvent.click(cards[0]);
    fireEvent.click(screen.getByTestId('contact-seller-action'));
  }

  it('shows validation errors when submitting empty form', () => {
    navigateToInquiryForm();
    fireEvent.click(screen.getByTestId('submit-action'));
    expect(screen.getByText('Vui l\u00f2ng nh\u1eadp h\u1ecd v\u00e0 t\u00ean')).toBeTruthy();
    expect(screen.getByText('Vui l\u00f2ng nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i')).toBeTruthy();
  });

  it('shows phone validation error for invalid phone', () => {
    navigateToInquiryForm();
    fireEvent.change(screen.getByTestId('full-name-input'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '123' } });
    fireEvent.click(screen.getByTestId('submit-action'));
    expect(screen.getByText('S\u1ed1 \u0111i\u1ec7n tho\u1ea1i ph\u1ea3i c\u00f3 10 ch\u1eef s\u1ed1, b\u1eaft \u0111\u1ea7u b\u1eb1ng 0')).toBeTruthy();
  });

  it('navigates to success on valid submission', () => {
    navigateToInquiryForm();
    fireEvent.change(screen.getByTestId('full-name-input'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '0912345678' } });
    fireEvent.click(screen.getByTestId('submit-action'));
    expect(screen.getByText('Y\u00eau c\u1ea7u \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eedi!')).toBeTruthy();
  });

  it('shows error on failed submission', () => {
    setSubmitInquiryOutcome('fail');
    navigateToInquiryForm();
    fireEvent.change(screen.getByTestId('full-name-input'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('phone-input'), { target: { value: '0912345678' } });
    fireEvent.click(screen.getByTestId('submit-action'));
    expect(screen.getByTestId('error-banner')).toBeTruthy();
  });
});
