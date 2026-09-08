import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { sampleUser, getLoginOutcome } from '../fixtures/auth';
import type { UserProfile } from '../types';

interface LoginScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function LoginScreen({ onNavigate, onLoginSuccess }: LoginScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getLoginOutcome();
      if (outcome === 'success') {
        onLoginSuccess(sampleUser);
      } else {
        setError(t('login.error'));
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-4 py-3 border-b border-gray-200">
        <button onClick={() => onNavigate('home')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-white text-2xl font-bold">A</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('login.title')}</h1>

        <div className="w-full max-w-sm space-y-4">
          <div>
            <label htmlFor="login-email" className="text-sm font-medium text-gray-700 block mb-1">{t('login.emailOrPhone')}</label>
            <input
              id="login-email"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
              aria-label={t('login.emailOrPhone')}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="text-sm font-medium text-gray-700 block mb-1">{t('login.password')}</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
              aria-label={t('login.password')}
            />
          </div>

          {error && <p className="text-sm text-red-500" data-testid="login-error">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!emailOrPhone || !password || isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            aria-label={t('login.submit')}
            data-testid="login-submit"
          >
            {isSubmitting ? t('common.loading') : t('login.submit')}
          </button>

          <button
            onClick={() => onNavigate('forgot-password')}
            className="w-full text-sm text-blue-600 py-2"
            aria-label={t('login.forgotPassword')}
          >
            {t('login.forgotPassword')}
          </button>

          <button
            onClick={() => onNavigate('register')}
            className="w-full text-sm text-gray-600 py-2"
            aria-label={t('login.registerLink')}
          >
            {t('login.registerLink')}
          </button>
        </div>
      </div>
    </div>
  );
}
