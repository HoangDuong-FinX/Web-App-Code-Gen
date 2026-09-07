import React, { useState } from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface ContactProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Contact({ dispatch, state }: ContactProps) {
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
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'NAVIGATE_CONTACT_CONFIRMATION' });
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('contact.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">{t('contact.dealership_info')}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-medium">AutoHub Main</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('contact.phone')}</p>
                <p className="font-medium">+1-555-0123</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">{t('register.address')}</p>
                <p className="font-medium">123 Main St, City, State</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Hours</p>
                <p className="font-medium">Mon-Fri 9am-6pm, Sat 10am-4pm</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">{t('contact.send_message')}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder={t('register.full_name')}
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
              <input
                type="text"
                placeholder={t('contact.subject')}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('contact.subject')}
              />
              <textarea
                placeholder={t('contact.message')}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
                aria-label={t('contact.message')}
              />
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                {t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}