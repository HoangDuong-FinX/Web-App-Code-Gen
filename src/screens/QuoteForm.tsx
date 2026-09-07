import React, { useState } from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface QuoteFormProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function QuoteForm({ dispatch, state }: QuoteFormProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    contactMethod: 'email',
    deliveryDate: '',
    specialRequests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'NAVIGATE_QUOTE_CONFIRMATION' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AutoHub</h1>
          <button onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="text-gray-700 hover:text-blue-600">
            {t('nav.home')}
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('quote.title')}</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">{t('quote.your_info')}</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t('quote.title')}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('register.full_name')}
              />
              <input
                type="email"
                placeholder={t('contact.email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('contact.email')}
              />
              <input
                type="tel"
                placeholder={t('contact.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('contact.phone')}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t('quote.contact_method')}</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="contact" value="email" checked={formData.contactMethod === 'email'} onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })} className="mr-2" />
                <span>Email</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="contact" value="phone" checked={formData.contactMethod === 'phone'} onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })} className="mr-2" />
                <span>Phone</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('quote.delivery_date')}</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-label={t('quote.delivery_date')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('quote.special_requests')}</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              aria-label={t('quote.special_requests')}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              {t('quote.submit')}
            </button>
            <button type="button" onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
              {t('quote.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}