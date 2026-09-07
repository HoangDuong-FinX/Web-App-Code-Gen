import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';
import { searchVehicles } from '../fixtures/vehicles';

interface ComparisonProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Comparison({ dispatch, state }: ComparisonProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const vehicles = searchVehicles.filter(v => state.comparisonList.includes(v.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AutoHub</h1>
          <button onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="text-gray-700 hover:text-blue-600">
            {t('nav.home')}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('comparison.title')}</h1>
          <p className="text-gray-600">{t('comparison.selected').replace('{{count}}', vehicles.length.toString())}</p>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No vehicles selected for comparison</p>
            <button onClick={() => dispatch({ type: 'NAVIGATE_SEARCH_RESULTS' })} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t('search.back_to_results')}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left font-bold">Specification</th>
                  {vehicles.map(v => (
                    <th key={v.id} className="px-4 py-3 text-left font-bold min-w-48">
                      <div className="mb-2">{v.make} {v.model}</div>
                      <button onClick={() => dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: { vehicleId: v.id } })} className="text-sm text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium">Price</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-3">${v.price.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-4 py-3 font-medium">Year</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-3">{v.year}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium">Mileage</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-3">{v.mileage.toLocaleString()} km</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-4 py-3 font-medium">Transmission</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-3">{v.transmission}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 font-medium">Fuel Type</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-3">{v.fuelType}</td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="px-4 py-3 font-medium">Body Type</td>
                  {vehicles.map(v => (
                    <td key={v.id} className="px-4 py-3">{v.bodyType}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            {t('comparison.export_pdf')}
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            {t('comparison.email_comparison')}
          </button>
          <button onClick={() => dispatch({ type: 'NAVIGATE_SEARCH_RESULTS' })} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {t('comparison.back_to_results')}
          </button>
        </div>
      </div>
    </div>
  );
}