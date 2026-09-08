import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId, UserProfile } from '../types';
import { getVerifyOtpOutcome, sampleUser } from '../fixtures/auth';

interface OtpVerifyScreenProps {
  phone: string | null;
  onNavigate: (screen: ScreenId) => void;
  onVerified: (user: UserProfile) => void;
}

export default function OtpVerifyScreen({ phone, onNavigate, onVerified }: OtpVerifyScreenProps) {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = () => {
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getVerifyOtpOutcome();
      if (outcome === 'verified') {
        onVerified(sampleUser);
      } else if (outcome === 'wrong') {
        const remaining = attemptsRemaining - 1;
        setAttemptsRemaining(remaining);
        if (remaining <= 0) {
          onNavigate('register');
        } else {
          setError(t('otp.error'));
        }
      } else {
        onNavigate('register');
      }
    }, 500);
  };

  const handleResend = () => {
    setResent(true);
    setAttemptsRemaining(3);
    setError('');
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('register')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('otp.title')}</h1>
      </header>

      <div className="px-4 py-8 max-w-sm mx-auto space-y-6">
        <p className="text-sm text-gray-600 text-center">
          {t('otp.instruction', { target: phone ?? '' })}
        </p>

        <div>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder={t('otp.placeholder')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg tracking-widest"
            maxLength={6}
            aria-label={t('otp.placeholder')}
          />
        </div>

        <p className="text-xs text-gray-500 text-center">
          {t('otp.attemptsRemaining', { count: attemptsRemaining })}
        </p>

        {error && <p className="text-sm text-red-500 text-center" data-testid="otp-error">{error}</p>}
        {resent && <p className="text-sm text-green-600 text-center">{t('otp.resent')}</p>}

        <button
          onClick={handleVerify}
          disabled={!otpCode || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          aria-label={t('otp.verify')}
          data-testid="otp-verify"
        >
          {isSubmitting ? t('common.loading') : t('otp.verify')}
        </button>

        <button
          onClick={handleResend}
          className="w-full text-sm text-blue-600 py-2"
          aria-label={t('otp.resend')}
        >
          {t('otp.resend')}
        </button>
      </div>
    </div>
  );
}
