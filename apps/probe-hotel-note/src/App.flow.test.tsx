import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import App from './App';
import { setLoginOutcome } from './fixtures/auth';
import { setInquiryOutcome, setTestDriveOutcome, setPaymentOutcome } from './fixtures/reservation';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setLoginOutcome('success');
  setInquiryOutcome('success');
  setTestDriveOutcome('success');
  setPaymentOutcome('success');
});

describe('Navigation: Home screen', () => {
  test('renders home screen with featured cars and promotions', async () => {
    render(<App />);
    expect(await screen.findByText('Xe n\u1ed5i b\u1eadt')).toBeTruthy();
  });

  test('home -> catalog via quick filter', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('quick-filter-sedan'));
    expect(screen.getByText('Danh s\u00e1ch xe')).toBeTruthy();
  });

  test('home -> search via search button', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('search-trigger'));
    expect(screen.getByTestId('search-input')).toBeTruthy();
  });

  test('home -> promotions via view all promos', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('view-all-promos'));
    expect(await screen.findByText('Khuy\u1ebfn m\u00e3i')).toBeTruthy();
  });

  test('home -> car-detail via featured car card', async () => {
    render(<App />);
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    expect(await screen.findByText('Chi ti\u1ebft xe')).toBeTruthy();
  });
});

describe('Navigation: Car detail -> Login prompt for guests', () => {
  test('guest tapping inquiry shows login prompt', async () => {
    render(<App />);
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi ti\u1ebft xe');
    fireEvent.click(screen.getByTestId('inquiry-cta'));
    expect(screen.getByTestId('login-prompt-dialog')).toBeTruthy();
  });

  test('login prompt dismiss closes modal', async () => {
    render(<App />);
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi ti\u1ebft xe');
    fireEvent.click(screen.getByTestId('inquiry-cta'));
    fireEvent.click(screen.getByTestId('dismiss-login-prompt'));
    expect(screen.queryByTestId('login-prompt-dialog')).toBeNull();
  });
});

describe('Login flow', () => {
  test('successful login navigates to return screen', async () => {
    setLoginOutcome('success');
    render(<App />);
    const cards = await screen.findAllByTestId('featured-car-card');
    fireEvent.click(cards[0]);
    await screen.findByText('Chi ti\u1ebft xe');
    fireEvent.click(screen.getByTestId('inquiry-cta'));
    fireEvent.click(screen.getByTestId('go-to-login'));
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await waitFor(() => {
      expect(screen.getByText('Li\u00ean h\u1ec7 t\u01b0 v\u1ea5n')).toBeTruthy();
    });
  });

  test('failed login shows error', async () => {
    setLoginOutcome('fail');
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('profile-trigger'));
    await screen.findByTestId('login-identity');
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await waitFor(() => {
      expect(screen.getByTestId('login-error')).toBeTruthy();
    });
  });

  test('login -> register link', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('profile-trigger'));
    await screen.findByTestId('login-identity');
    fireEvent.click(screen.getByTestId('register-link'));
    expect(screen.getByTestId('register-name')).toBeTruthy();
  });
});

describe('Bottom navigation', () => {
  test('nav-catalog navigates to catalog', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('nav-catalog'));
    expect(screen.getByText('Danh s\u00e1ch xe')).toBeTruthy();
  });

  test('nav-promotions navigates to promotions', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('nav-promotions'));
    expect(await screen.findByText('Khuy\u1ebfn m\u00e3i')).toBeTruthy();
  });

  test('nav-activity navigates to my-activity', async () => {
    render(<App />);
    await screen.findByText('Xe n\u1ed5i b\u1eadt');
    fireEvent.click(screen.getByTestId('nav-activity'));
    expect(await screen.findByText('Ho\u1ea1t \u0111\u1ed9ng c\u1ee7a t\u00f4i')).toBeTruthy();
  });
});
