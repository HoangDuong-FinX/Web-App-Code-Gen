import React from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface ReportsDashboardProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function ReportsDashboard({ dispatch, state }: ReportsDashboardProps) {
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
        <h1 className="text-3xl font-bold mb-8">{t('reports.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('reports.total_vehicles')}</p>
            <p className="text-3xl font-bold">42</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('reports.vehicles_sold')}</p>
            <p className="text-3xl font-bold">7</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('reports.total_leads')}</p>
            <p className="text-3xl font-bold">156</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('reports.conversion_rate')}</p>
            <p className="text-3xl font-bold">4.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}