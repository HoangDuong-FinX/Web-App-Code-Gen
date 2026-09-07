import React, { useState } from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface EmailVerificationProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function EmailVerification({ dispatch, state }: EmailVerificationProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const [verified, setVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);

  const handleResend = () => {
    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 60000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {verified ? (
          <>
            <div className="text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-4 text-green-600">{t('email_verify.verified')}</h1>
            <button onClick={() => dispatch({ type: 'NAVIGATE_PROFILE' })} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              {t('email_verify.continue')}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{t('email_verify.title')}</h1>
            <p className="text-gray-600 mb-6">{t('email_verify.message').replace('{{email}}', 'user@example.com')}</p>
            <button onClick={() => setVerified(true)} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mb-3">
              {t('email_verify.continue')}
            </button>
            <button onClick={handleResend} disabled={resendDisabled} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50">
              {resendDisabled ? t('email_verify.resend_link') + ' (60s)' : t('email_verify.resend_link')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}