import React from 'react';
import { AppState, NavigationAction } from '../types';
import { vi } from '../i18n/vi';
import { searchVehicles } from '../fixtures/vehicles';

interface VehicleDetailProps {
  dispatch: React.Dispatch<NavigationAction>;
  state: AppState;
}

export function VehicleDetail({ dispatch, state }: VehicleDetailProps) {
  const t = (key: string) => {
    const parts = key.split('.');
    let value: any = vi;
    for (const part of parts) {
      value = value[part];
    }
    return typeof value === 'string' ? value : key;
  };

  const vehicle = searchVehicles.find(v => v.id === state.selectedVehicleId);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">{t('error.not_found')}</p>
          <button onClick={() => dispatch({ type: 'NAVIGATE_HOME' })} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {t('nav.home')}
          </button>
        </div>
      </div>
    );
  }

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
        {/* Photo Gallery */}
        <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
          <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Vehicle Image</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-3xl font-bold mb-4">{vehicle.make} {vehicle.model} {vehicle.year}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {vehicle.status === 'available' ? t('vehicle.in_stock') : t('vehicle.sold')}
                </span>
                {vehicle.rating && <span className="text-yellow-500">★ {vehicle.rating}/5</span>}
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-6">${vehicle.price.toLocaleString()}</p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">{t('vehicle.mileage')}</p>
                  <p className="font-bold text-lg">{vehicle.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('vehicle.transmission')}</p>
                  <p className="font-bold text-lg">{vehicle.transmission}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('vehicle.fuel_type')}</p>
                  <p className="font-bold text-lg">{vehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('vehicle.body_type')}</p>
                  <p className="font-bold text-lg">{vehicle.bodyType}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{t('vehicle.color')}</p>
                  <p className="font-bold text-lg">{vehicle.color}</p>
                </div>
                {vehicle.engine && (
                  <div>
                    <p className="text-gray-600 text-sm">{t('vehicle.engine')}</p>
                    <p className="font-bold text-lg">{vehicle.engine}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">{t('vehicle.features')}</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 sticky top-20">
              <div className="space-y-3">
                <button onClick={() => dispatch({ type: 'NAVIGATE_QUOTE_FORM' })} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  {t('vehicle.request_quote')}
                </button>
                <button onClick={() => dispatch({ type: 'NAVIGATE_TEST_DRIVE_BOOKING' })} className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  {t('vehicle.schedule_test_drive')}
                </button>
                <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                  {t('vehicle.add_to_favorites')}
                </button>
                <button onClick={() => dispatch({ type: 'ADD_TO_COMPARISON', payload: { vehicleId: vehicle.id } })} className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                  {t('vehicle.add_to_compare')}
                </button>
              </div>
            </div>

            {/* Dealership Info */}
            {vehicle.dealership && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">{t('vehicle.dealership_info')}</h3>
                <p className="font-medium mb-2">{vehicle.dealership.name}</p>
                <p className="text-gray-600 text-sm mb-2">{vehicle.dealership.address}</p>
                <p className="text-gray-600 text-sm mb-4">{vehicle.dealership.phone}</p>
                <button onClick={() => dispatch({ type: 'NAVIGATE_CONTACT' })} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  {t('vehicle.contact_dealership')}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}