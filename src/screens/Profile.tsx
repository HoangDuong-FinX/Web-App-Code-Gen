import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface ProfileProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Profile({ dispatch, state }: ProfileProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER_ROLE', payload: { role: 'guest' } });
    dispatch({ type: 'SET_SESSION_TOKEN', payload: { token: null } });
    dispatch({ type: 'NAVIGATE_HOME' });
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">👤</div>
            <h2 className="text-2xl font-bold mb-1">John Doe</h2>
            <p className="text-gray-600">john@example.com</p>
          </div>

          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-bold mb-4">{t('profile.account_info')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('profile.phone')}</span>
                <span className="font-medium">+1-555-0123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('profile.address')}</span>
                <span className="font-medium">123 Main St, City, State</span>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t('profile.edit_profile')}
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">{t('profile.my_inquiries')}</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-center">No inquiries yet</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => dispatch({ type: 'NAVIGATE_FAVORITES' })} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t('profile.view_favorites')}
            </button>
            <button onClick={handleLogout} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              {t('profile.logout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}