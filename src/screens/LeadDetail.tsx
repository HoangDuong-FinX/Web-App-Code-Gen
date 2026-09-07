import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface LeadDetailProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function LeadDetail({ dispatch, state }: LeadDetailProps) {
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('lead_detail.title')}</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 text-center">Lead detail implementation</p>
          <button onClick={() => dispatch({ type: 'NAVIGATE_LEADS_DASHBOARD' })} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Leads
          </button>
        </div>
      </div>
    </div>
  );
}