import React, { useState, useEffect } from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface AccountLockedProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function AccountLocked({ dispatch, state }: AccountLockedProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const [secondsLeft, setSecondsLeft] = useState(1800);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4 text-yellow-600">🔒</div>
        <h1 className="text-2xl font-bold mb-4">{t('login.account_locked')}</h1>
        <p className="text-gray-600 mb-6">{t('login.too_many_attempts')}</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">{t('login.remaining_time')}</p>
          <p className="text-3xl font-bold text-blue-600">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
        <button onClick={() => dispatch({ type: 'NAVIGATE_LOGIN' })} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mb-3">
          {t('login.unlock_via_email')}
        </button>
        <button onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
          {t('nav.home')}
        </button>
      </div>
    </div>
  );
}