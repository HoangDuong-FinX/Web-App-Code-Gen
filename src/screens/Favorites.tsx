import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';
import { searchVehicles } from '../fixtures/vehicles';

interface FavoritesProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Favorites({ dispatch, state }: FavoritesProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const favorites = searchVehicles.filter(v => state.favoritesList.includes(v.id));

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
        <h1 className="text-3xl font-bold mb-2">{t('favorites.title')}</h1>
        <p className="text-gray-600 mb-8">{t('favorites.saved').replace('{{count}}', favorites.length.toString())}</p>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">{t('favorites.no_saved')}</p>
            <button onClick={() => dispatch({ type: 'NAVIGATE_SEARCH_RESULTS' })} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t('search.browse_all')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-blue-600 font-bold text-xl mb-2">${vehicle.price.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm mb-4">{vehicle.year} • {vehicle.mileage.toLocaleString()} km</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => dispatch({ type: 'NAVIGATE_VEHICLE_DETAIL', payload: { vehicleId: vehicle.id } })} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                      {t('favorites.view')}
                    </button>
                    <button onClick={() => dispatch({ type: 'NAVIGATE_QUOTE_FORM' })} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm">
                      {t('favorites.request_quote')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}