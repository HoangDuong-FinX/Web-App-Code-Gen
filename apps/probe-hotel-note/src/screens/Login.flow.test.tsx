import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { vi, afterEach, describe, it, expect } from 'vitest';
import App from '../App';
import * as authFixture from '../fixtures/auth';

afterEach(() => { cleanup(); vi.restoreAllMocks(); authFixture.setLoginOutcome('success'); authFixture.setRegisterOutcome('success'); });

describe('Login flow', () => {
  async function goToLogin() {
    render(<App />);
    await screen.findByText('Xe nổi bật');
    fireEvent.click(screen.getByTestId('profile-trigger'));
    await screen.findByText('Đăng nhập');
  }

  it('shows login screen from home profile trigger', async () => {
    await goToLogin();
    expect(screen.getByTestId('login-identity')).toBeTruthy();
    expect(screen.getByTestId('login-password')).toBeTruthy();
  });

  it('shows error on failed login', async () => {
    authFixture.setLoginOutcome('fail');
    await goToLogin();
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    expect(await screen.findByTestId('login-error')).toBeTruthy();
  });

  it('shows locked message on locked account', async () => {
    authFixture.setLoginOutcome('locked');
    await goToLogin();
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    const errorEl = await screen.findByTestId('login-error');
    expect(errorEl.textContent).toContain('15 phút');
  });

  it('navigates to home on successful login', async () => {
    authFixture.setLoginOutcome('success');
    await goToLogin();
    fireEvent.change(screen.getByTestId('login-identity'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'correct' } });
    fireEvent.click(screen.getByTestId('login-submit'));
    await waitFor(() => {
      expect(screen.getByText('Xe nổi bật')).toBeTruthy();
    });
  });

  it('navigates to register from login', async () => {
    await goToLogin();
    fireEvent.click(screen.getByTestId('register-link'));
    expect(screen.getByTestId('register-name')).toBeTruthy();
  });
});
