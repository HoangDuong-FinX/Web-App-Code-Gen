import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface EmailVerificationFailedProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function EmailVerificationFailed({ dispatch, state }: EmailVerificationFailedProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4 text-red-600">✕</div>
        <h1 className="text-2xl font-bold mb-4">{t('email_verify.link_expired')}</h1>
        <p className="text-gray-600 mb-6">{t('email_verify.link_invalid')}</p>
        <button onClick={() => dispatch({ type: 'NAVIGATE_EMAIL_VERIFICATION' })} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mb-3">
          {t('email_verify.send_new_link')}
        </button>
        <button onClick={() => dispatch({ type: 'NAVIGATE_LOGIN' })} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
          {t('email_verify.back_to_login')}
        </button>
      </div>
    </div>
  );
}