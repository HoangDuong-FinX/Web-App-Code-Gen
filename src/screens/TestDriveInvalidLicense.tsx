import React from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface TestDriveInvalidLicenseProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function TestDriveInvalidLicense({ dispatch, state }: TestDriveInvalidLicenseProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
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

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-5xl mb-4 text-red-600">✕</div>
          <h1 className="text-3xl font-bold mb-4">{t('test_drive.invalid_license')}</h1>
          <p className="text-gray-600 text-lg mb-8">The driver's license format is invalid.</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm">{t('test_drive.license_format').replace('{{format}}', 'XXX-XXX-XXX')}</p>
          </div>

          <button onClick={() => dispatch({ type: 'NAVIGATE_TEST_DRIVE_BOOKING' })} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
}