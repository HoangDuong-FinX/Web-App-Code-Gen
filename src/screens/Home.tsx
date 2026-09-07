import React from 'react';
import type { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';
import { featuredVehicles } from '../fixtures/vehicles';

interface HomeProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function Home({ dispatch, state }: HomeProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: 'NAVIGATE_SEARCH_RESULTS' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AutoHub</h1>
          <nav className="flex gap-4">
            <button onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="text-gray-700 hover:text-blue-600">
              {t('nav.home')}
            </button>
            <button onClick={() => dispatch({ type: 'NAVIGATE_LOGIN' })} className="text-gray-700 hover:text-blue-600">
              {t('nav.login')}
            </button>
            <button onClick={() => dispatch({ type: 'NAVIGATE_REGISTER' })} className="text-gray-700 hover:text-blue-600">
              {t('nav.register')}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('home.title')}</h2>
          <p className="text-xl mb-8">Tìm chiếc xe mơ ước của bạn</p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder={t('home.search_placeholder')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('home.search_placeholder')}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              aria-label="Search"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">
              Sedan
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">
              SUV
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">
              Truck
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 whitespace-nowrap">
              Electric
            </button>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8">{t('home.featured_vehicles')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.slice(0, 4).map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer" onClick={() => dispatch({ type: 'NAVIGATE_VEHICLE_DETAIL', payload: { vehicleId: vehicle.id } })}>
                <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">Image</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-blue-600 font-bold text-xl mb-2">${vehicle.price.toLocaleString()}</p>
                  <p className="text-gray-600 text-sm mb-4">{vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.transmission}</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {t('search.view_detail')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Bắt đầu tìm kiếm ngay</h3>
          <button onClick={() => dispatch({ type: 'NAVIGATE_SEARCH_RESULTS' })} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            {t('home.browse_all')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 AutoHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}