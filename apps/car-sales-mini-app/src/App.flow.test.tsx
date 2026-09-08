import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Home screen', () => {
  it('renders the home screen with featured cars', () => {
    render(<App />);
    expect(screen.getByText('AutoMart')).toBeTruthy();
    expect(screen.getByText('Toyota Camry 2024')).toBeTruthy();
  });

  it('navigates to search-results when search is triggered', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText('T\u00ecm xe theo t\u00ean, h\u00e3ng, m\u1eabu...');
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    // search-results has the title in the header section
    expect(screen.getByText(/xe \u0111\u01b0\u1ee3c t\u00ecm th\u1ea5y/)).toBeTruthy();
  });

  it('navigates to car-detail when a featured car is tapped', () => {
    render(<App />);
    const carButton = screen.getByRole('button', { name: 'Toyota Camry 2024' });
    fireEvent.click(carButton);
    expect(screen.getByText('Th\u00f4ng s\u1ed1 k\u1ef9 thu\u1eadt')).toBeTruthy();
  });
});

describe('Car detail screen', () => {
  function goToCarDetail() {
    render(<App />);
    const carButton = screen.getByRole('button', { name: 'Toyota Camry 2024' });
    fireEvent.click(carButton);
  }

  it('shows car specifications', () => {
    goToCarDetail();
    expect(screen.getByText('2.5L 4 xi-lanh')).toBeTruthy();
    expect(screen.getByText('Tr\u1eafng ng\u1ecdc trai')).toBeTruthy();
  });

  it('navigates to financing calculator', () => {
    goToCarDetail();
    const financingBtn = screen.getByRole('button', { name: 'T\u00e0i ch\u00ednh' });
    fireEvent.click(financingBtn);
    expect(screen.getByText('\u01af\u1edbc t\u00ednh t\u00e0i ch\u00ednh')).toBeTruthy();
  });

  it('buy button redirects guest to login', () => {
    goToCarDetail();
    const buyBtn = screen.getByTestId('buy-button');
    fireEvent.click(buyBtn);
    // Login screen has the login-submit button
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });

  it('test drive button redirects guest to login', () => {
    goToCarDetail();
    const tdBtn = screen.getByTestId('test-drive-button');
    fireEvent.click(tdBtn);
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });
});

describe('Login flow', () => {
  it('shows login screen and navigates to register', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Toyota Camry 2024' }));
    fireEvent.click(screen.getByTestId('buy-button'));
    expect(screen.getByTestId('login-submit')).toBeTruthy();
    // Navigate to register
    fireEvent.click(screen.getByRole('button', { name: /Ch\u01b0a c\u00f3 t\u00e0i kho\u1ea3n/ }));
    expect(screen.getByTestId('register-submit')).toBeTruthy();
  });

  it('navigates to forgot password', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Toyota Camry 2024' }));
    fireEvent.click(screen.getByTestId('buy-button'));
    fireEvent.click(screen.getByRole('button', { name: /Qu\u00ean m\u1eadt kh\u1ea9u/ }));
    expect(screen.getByTestId('fp-submit')).toBeTruthy();
  });
});

describe('Compare flow', () => {
  it('adds cars to compare and navigates to compare screen', () => {
    render(<App />);
    // Find compare toggle buttons by data-testid
    const compareBtn = screen.getByTestId('compare-toggle-car-001');
    fireEvent.click(compareBtn);
    // Compare bar should appear with "So s\u00e1nh ngay" button
    const compareNowBtn = screen.getByRole('button', { name: /So s\u00e1nh ngay/ });
    expect(compareNowBtn).toBeTruthy();
    fireEvent.click(compareNowBtn);
    expect(screen.getByText('So s\u00e1nh xe')).toBeTruthy();
  });
});

describe('Navigation', () => {
  it('bottom nav navigates to search results', () => {
    render(<App />);
    expect(screen.getByText('AutoMart')).toBeTruthy();
    fireEvent.click(screen.getByTestId('nav-search-results'));
    expect(screen.getByText(/xe \u0111\u01b0\u1ee3c t\u00ecm th\u1ea5y/)).toBeTruthy();
  });

  it('guest tapping profile redirects to login', () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-profile'));
    // Should show login form
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });
});

describe('Financing calculator', () => {
  it('shows disclaimer BR-10', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Toyota Camry 2024' }));
    fireEvent.click(screen.getByRole('button', { name: 'T\u00e0i ch\u00ednh' }));
    expect(screen.getByTestId('financing-disclaimer')).toBeTruthy();
  });
});
