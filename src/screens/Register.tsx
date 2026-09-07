import React, { useState } from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface RegisterProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Register({ dispatch, state }: RegisterProps) {
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
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError(t('register.validation_error'));
      return;
    }
    dispatch({ type: 'NAVIGATE_EMAIL_VERIFICATION' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">{t('register.title')}</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('register.email')}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('register.email')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('register.password')}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('register.password')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('register.full_name')}</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('register.full_name')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('register.phone')}</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('register.phone')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('register.address')}</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('register.address')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">{t('register.city')}</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('register.city')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('register.state')}</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('register.state')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('register.zip')}</label>
            <input
              type="text"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('register.zip')}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="mr-2"
              required
              aria-label={t('register.agree_terms')}
            />
            <label className="text-sm text-gray-700">{t('register.agree_terms')}</label>
          </div>

          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {t('register.create_account')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          <button onClick={() => dispatch({ type: 'NAVIGATE_LOGIN' })} className="text-blue-600 hover:underline">
            {t('register.already_have_account')}
          </button>
        </p>
      </div>
    </div>
  );
}