import React, { useState } from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface TestDriveBookingProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function TestDriveBooking({ dispatch, state }: TestDriveBookingProps) {
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
    phone: '',
    email: '',
    licenseNumber: '',
    date: '',
    time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.licenseNumber || formData.licenseNumber.length < 5) {
      dispatch({ type: 'NAVIGATE_TEST_DRIVE_INVALID_LICENSE' });
      return;
    }
    dispatch({ type: 'NAVIGATE_TEST_DRIVE_CONFIRMATION' });
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
        <h1 className="text-3xl font-bold mb-8">{t('test_drive.title')}</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">{t('test_drive.select_date_time')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('test_drive.select_date_time')}
              />
              <select value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required aria-label="Time">
                <option value="">Select time</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t('test_drive.driver_info')}</h3>
            <div className="space-y-3">
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
                type="tel"
                placeholder={t('register.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('register.phone')}
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
                type="text"
                placeholder={t('test_drive.license_number')}
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label={t('test_drive.license_number')}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              {t('test_drive.confirm_booking')}
            </button>
            <button type="button" onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
              {t('test_drive.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}