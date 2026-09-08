import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { submitLogin } from '../fixtures/auth';

export default function LoginScreen(): React.JSX.Element {
  const { navigate, returnTo, returnAction, currentCarId, selectedCar } = useApp();
  const { login } = useAuth();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(): Promise<void> {
    if (!identity.trim() || !password.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const buyer = await submitLogin(identity, password);
      login(buyer);
      if (returnTo === 'car-detail' && returnAction) {
        if (returnAction === 'inquiry') navigate('inquiry-form', { currentCarId, selectedCar });
        else if (returnAction === 'test-drive') navigate('td-select-showroom', { currentCarId, selectedCar });
        else if (returnAction === 'reserve') navigate('reservation-terms', { currentCarId, selectedCar });
        else navigate(returnTo);
      } else if (returnTo) {
        navigate(returnTo);
      } else {
        navigate('home');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'ACCOUNT_LOCKED') {
        setError(t('login.errorLocked'));
      } else {
        setError(t('login.errorWrong'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate(returnTo ?? 'home')} aria-label={t('login.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('login.title')}</h1>
      </header>

      <div className="flex flex-col items-center gap-6 p-6 flex-1">
        <span className="text-2xl font-bold text-blue-600">{t('app.title')}</span>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="login-identity" className="text-sm font-medium">{t('login.identityLabel')}</label>
          <input
            id="login-identity"
            type="text"
            value={identity}
            onChange={e => setIdentity(e.target.value)}
            placeholder={t('login.identityPlaceholder')}
            aria-label={t('login.identityLabel')}
            data-testid="login-identity"
            className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="login-password" className="text-sm font-medium">{t('login.passwordLabel')}</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('login.passwordPlaceholder')}
            aria-label={t('login.passwordLabel')}
            data-testid="login-password"
            className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="w-full text-sm text-red-600 bg-red-50 p-3 rounded-lg" aria-live="polite" data-testid="login-error">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          aria-label={t('login.submit')}
          data-testid="login-submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? '...' : t('login.submit')}
        </button>

        <button type="button" aria-label={t('login.forgotPassword')} data-testid="forgot-password" className="text-sm text-blue-600">
          {t('login.forgotPassword')}
        </button>

        <div className="flex gap-1">
          <span className="text-sm">{t('login.noAccount')}</span>
          <button type="button" onClick={() => navigate('register')} aria-label={t('login.registerAria')} data-testid="register-link" className="text-sm text-blue-600 font-medium">
            {t('login.register')}
          </button>
        </div>
      </div>
    </div>
  );
}
