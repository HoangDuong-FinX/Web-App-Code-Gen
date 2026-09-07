import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface QuoteConfirmationProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function QuoteConfirmation({ dispatch, state }: QuoteConfirmationProps) {
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
          <div className="text-5xl mb-4 text-green-600">✓</div>
          <h1 className="text-3xl font-bold mb-4">{t('quote.submitted')}</h1>
          <p className="text-gray-600 text-lg mb-8">{t('quote.expected_response')}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-bold mb-4">{t('quote.title')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quote.reference_number')}</span>
                <span className="font-bold">QR-12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle</span>
                <span className="font-bold">Make Model Year</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => dispatch({ type: 'NAVIGATE_PROFILE' })} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              {t('quote.view_inquiries')}
            </button>
            <button onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
              {t('quote.back_to_home')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}