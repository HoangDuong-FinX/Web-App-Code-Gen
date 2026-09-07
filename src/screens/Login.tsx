import React, { useState } from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface LoginProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Login({ dispatch, state }: LoginProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t('login.invalid_credentials'));
      return;
    }
    dispatch({ type: 'SET_USER_ROLE', payload: { role: 'registered-customer' } });
    dispatch({ type: 'SET_SESSION_TOKEN', payload: { token: 'fake-token-' + Date.now() } });
    dispatch({ type: 'NAVIGATE_PROFILE' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">{t('login.title')}</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('login.email')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('login.email')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('login.password')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('login.password')}
            />
          </div>

          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {t('login.login_btn')}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <button onClick={() => dispatch({ type: 'NAVIGATE_LOGIN' })} className="text-blue-600 hover:underline">
            {t('login.forgot_password')}
          </button>
          <button onClick={() => dispatch({ type: 'NAVIGATE_REGISTER' })} className="text-blue-600 hover:underline">
            {t('login.no_account')}
          </button>
        </div>
      </div>
    </div>
  );
}