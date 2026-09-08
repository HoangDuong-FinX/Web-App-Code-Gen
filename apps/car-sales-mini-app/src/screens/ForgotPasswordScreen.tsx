import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getForgotPasswordOutcome } from '../fixtures/auth';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export default function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getForgotPasswordOutcome();
      if (outcome === 'success') {
        setSent(true);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('login')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('forgotPassword.title')}</h1>
      </header>

      <div className="px-4 py-8 max-w-sm mx-auto space-y-6">
        <p className="text-sm text-gray-600">{t('forgotPassword.instruction')}</p>

        <div>
          <label htmlFor="fp-input" className="text-sm font-medium text-gray-700 block mb-1">{t('login.emailOrPhone')}</label>
          <input
            id="fp-input"
            type="text"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
            aria-label={t('login.emailOrPhone')}
          />
        </div>

        {sent && <p className="text-sm text-green-600" data-testid="fp-success">{t('forgotPassword.success')}</p>}

        <button
          onClick={handleSubmit}
          disabled={!emailOrPhone || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          aria-label={t('forgotPassword.submit')}
          data-testid="fp-submit"
        >
          {isSubmitting ? t('common.loading') : t('forgotPassword.submit')}
        </button>

        <button
          onClick={() => onNavigate('login')}
          className="w-full text-sm text-blue-600 py-2"
          aria-label={t('forgotPassword.backToLogin')}
        >
          {t('forgotPassword.backToLogin')}
        </button>
      </div>
    </div>
  );
}
