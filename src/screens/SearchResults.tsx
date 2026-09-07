import React, { useState } from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';
import { searchVehicles } from '../fixtures/vehicles';

interface SearchResultsProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function SearchResults({ dispatch, state }: SearchResultsProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const [filters, setFilters] = useState(state.searchFilters);
  const [sortBy, setSortBy] = useState('relevance');

  const results = searchVehicles.filter(v => {
    if (filters.make && v.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    if (filters.transmission && v.transmission !== filters.transmission) return false;
    if (filters.fuelType && v.fuelType !== filters.fuelType) return false;
    if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
    return true;
  });

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

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">{t('search.filters')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t('search.filter_make')}</label>
                <select value={filters.make} onChange={(e) => setFilters({ ...filters, make: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={t('search.filter_make')}>
                  <option value="">All</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('search.filter_transmission')}</label>
                <select value={filters.transmission} onChange={(e) => setFilters({ ...filters, transmission: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={t('search.filter_transmission')}>
                  <option value="">All</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('search.filter_fuel')}</label>
                <select value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={t('search.filter_fuel')}>
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('search.filter_body')}</label>
                <select value={filters.bodyType} onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={t('search.filter_body')}>
                  <option value="">All</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                {t('search.apply_filters')}
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                {t('search.clear_all')}
              </button>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="lg:col-span-3">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-700 font-medium">{t('search.results_count').replace('{{count}}', results.length.toString())}</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={t('search.sort_by')}>
              <option value="relevance">{t('search.sort_relevance')}</option>
              <option value="price">{t('search.sort_price')}</option>
              <option value="year">{t('search.sort_year')}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-blue-600 font-bold text-xl mb-2">${vehicle.price.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm mb-4">{vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.transmission}</p>
                  <div className="flex gap-2">
                    <button onClick={() => dispatch({ type: 'NAVIGATE_VEHICLE_DETAIL', payload: { vehicleId: vehicle.id } })} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                      {t('search.view_detail')}
                    </button>
                    <button onClick={() => dispatch({ type: 'ADD_TO_COMPARISON', payload: { vehicleId: vehicle.id } })} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm">
                      {t('search.add_to_compare')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 text-lg">{t('search.no_results')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}