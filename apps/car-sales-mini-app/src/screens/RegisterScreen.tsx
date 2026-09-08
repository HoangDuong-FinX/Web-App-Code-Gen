import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getRegisterOutcome } from '../fixtures/auth';

interface RegisterScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onRegisterSuccess: (phone: string) => void;
}

export default function RegisterScreen({ onNavigate, onRegisterSuccess }: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): string => {
    if (!fullName || !phone || !email || !password) return t('addCar.validationError');
    if (password !== confirmPassword) return t('register.error.passwordMismatch');
    if (password.length < 6) return t('register.error.weakPassword');
    if (!termsAccepted) return t('register.error.termsRequired');
    return '';
  };

  const handleSubmit = () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getRegisterOutcome();
      if (outcome === 'success') {
        onRegisterSuccess(phone);
      } else {
        setError(t('register.error.duplicate'));
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('login')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('register.title')}</h1>
      </header>

      <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
        <div>
          <label htmlFor="reg-name" className="text-sm font-medium text-gray-700 block mb-1">{t('register.fullName')}</label>
          <input id="reg-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.fullName')} />
        </div>
        <div>
          <label htmlFor="reg-phone" className="text-sm font-medium text-gray-700 block mb-1">{t('register.phone')}</label>
          <input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.phone')} />
        </div>
        <div>
          <label htmlFor="reg-email" className="text-sm font-medium text-gray-700 block mb-1">{t('register.email')}</label>
          <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.email')} />
        </div>
        <div>
          <label htmlFor="reg-pass" className="text-sm font-medium text-gray-700 block mb-1">{t('register.password')}</label>
          <input id="reg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.password')} />
        </div>
        <div>
          <label htmlFor="reg-confirm" className="text-sm font-medium text-gray-700 block mb-1">{t('register.confirmPassword')}</label>
          <input id="reg-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm" aria-label={t('register.confirmPassword')} />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} aria-label={t('register.terms')} />
          {t('register.terms')}
        </label>

        {error && <p className="text-sm text-red-500" data-testid="register-error">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          aria-label={t('register.submit')}
          data-testid="register-submit"
        >
          {isSubmitting ? t('common.loading') : t('register.submit')}
        </button>

        <button onClick={() => onNavigate('login')} className="w-full text-sm text-gray-600 py-2" aria-label={t('register.loginLink')}>
          {t('register.loginLink')}
        </button>
      </div>
    </div>
  );
}
