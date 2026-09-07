import React from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';

interface InventoryDashboardProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function InventoryDashboard({ dispatch, state }: InventoryDashboardProps) {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('inventory.title')}</h1>
          <button onClick={() => dispatch({ type: 'NAVIGATE_ADD_VEHICLE' })} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {t('inventory.add_vehicle')}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('inventory.total_vehicles')}</p>
            <p className="text-3xl font-bold">42</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('inventory.available')}</p>
            <p className="text-3xl font-bold">35</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">{t('inventory.sold_this_month')}</p>
            <p className="text-3xl font-bold">7</p>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Price</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3">Toyota Camry 2023</td>
                <td className="px-6 py-3">$28,500</td>
                <td className="px-6 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Available</span></td>
                <td className="px-6 py-3 text-sm space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Mark Sold</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}