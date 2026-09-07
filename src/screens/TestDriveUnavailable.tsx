import React from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface TestDriveUnavailableProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function TestDriveUnavailable({ dispatch, state }: TestDriveUnavailableProps) {
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
          <div className="text-5xl mb-4 text-yellow-600">⚠</div>
          <h1 className="text-3xl font-bold mb-4">{t('test_drive.slot_taken')}</h1>
          <p className="text-gray-600 text-lg mb-8">Please select another time slot.</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold mb-4">Available alternatives:</h3>
            <div className="space-y-2 text-left">
              <button className="w-full p-3 border border-blue-300 rounded-lg hover:bg-blue-50 text-left">2024-01-15 at 11:00 AM</button>
              <button className="w-full p-3 border border-blue-300 rounded-lg hover:bg-blue-50 text-left">2024-01-15 at 02:00 PM</button>
              <button className="w-full p-3 border border-blue-300 rounded-lg hover:bg-blue-50 text-left">2024-01-16 at 09:00 AM</button>
            </div>
          </div>

          <button onClick={() => dispatch({ type: 'NAVIGATE_TEST_DRIVE_BOOKING' })} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
}