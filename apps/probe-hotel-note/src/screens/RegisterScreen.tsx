import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { submitRegister } from '../fixtures/auth';

export default function RegisterScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(): Promise<void> {
    if (!name.trim() || !phone.trim() || !password.trim()) return;
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const buyer = await submitRegister(name, phone, email, password);
      login(buyer);
      navigate('home');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'DUPLICATE') {
        setError(t('register.errorDuplicate'));
      } else {
        setError(t('modal.networkError.body'));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('login')} aria-label={t('register.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('register.title')}</h1>
      </header>

      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="reg-name" className="text-sm font-medium">{t('register.nameLabel')}</label>
          <input id="reg-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('register.namePlaceholder')} aria-label={t('register.nameLabel')} data-testid="register-name" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="reg-phone" className="text-sm font-medium">{t('register.phoneLabel')}</label>
          <input id="reg-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('register.phonePlaceholder')} aria-label={t('register.phoneLabel')} data-testid="register-phone" inputMode="tel" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <span className="text-xs text-gray-500">{t('register.phoneHelper')}</span>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="reg-email" className="text-sm font-medium">{t('register.emailLabel')}</label>
          <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('register.emailPlaceholder')} aria-label={t('register.emailLabel')} data-testid="register-email" inputMode="email" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="reg-password" className="text-sm font-medium">{t('register.passwordLabel')}</label>
          <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('register.passwordPlaceholder')} aria-label={t('register.passwordLabel')} data-testid="register-password" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="reg-confirm" className="text-sm font-medium">{t('register.confirmPasswordLabel')}</label>
          <input id="reg-confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={t('register.confirmPasswordPlaceholder')} aria-label={t('register.confirmPasswordLabel')} data-testid="register-confirm-password" className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {error && (
          <p className="w-full text-sm text-red-600 bg-red-50 p-3 rounded-lg" aria-live="polite" data-testid="register-error">{error}</p>
        )}

        <button type="button" onClick={handleSubmit} disabled={submitting} aria-label={t('register.submitAria')} data-testid="register-submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          {submitting ? '...' : t('register.submit')}
        </button>

        <div className="flex gap-1 justify-center">
          <span className="text-sm">{t('register.hasAccount')}</span>
          <button type="button" onClick={() => navigate('login')} aria-label={t('register.loginAria')} data-testid="login-link" className="text-sm text-blue-600 font-medium">
            {t('register.login')}
          </button>
        </div>
      </div>
    </div>
  );
}
