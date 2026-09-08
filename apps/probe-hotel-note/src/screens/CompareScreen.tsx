import React, { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';
import { t } from '../i18n';
import { getCarsByIds } from '../fixtures/cars';
import { removeFromCompare, getCompareIds } from '../state/compare';

interface CompareScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
}

export default function CompareScreen({ onNavigate }: CompareScreenProps): React.JSX.Element {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const ids = getCompareIds();
    setCars(getCarsByIds(ids));
  }, []);

  const handleRemove = useCallback((carId: string) => {
    const newIds = removeFromCompare(carId);
    setCars(getCarsByIds(newIds));
  }, []);

  const specLabels = cars.length > 0 ? cars[0].specs.map((s) => s.label) : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('catalog')}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('compare.title')}</h1>
      </header>

      {cars.length > 0 ? (
        <>
          <div className="flex gap-3 p-4 overflow-x-auto">
            {cars.map((car) => (
              <div key={car.id} className="flex flex-col items-center gap-2 min-w-[120px]">
                <img
                  src={car.thumbnailUrl}
                  alt={car.name}
                  className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                  onClick={() => onNavigate('car-detail', { carId: car.id })}
                />
                <p className="text-sm text-gray-700 text-center">{car.name}</p>
                <button
                  type="button"
                  aria-label={t('compare.removeAria', { name: car.name })}
                  data-testid="remove-from-compare-action"
                  className="text-gray-400 hover:text-red-500 text-lg"
                  onClick={() => handleRemove(car.id)}
                >
                  \u2715
                </button>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            {specLabels.map((label) => (
              <div key={label} className="flex border-b border-gray-100 py-2 overflow-x-auto">
                <span className="min-w-[100px] text-sm text-gray-500 shrink-0">{label}</span>
                {cars.map((car) => {
                  const spec = car.specs.find((s) => s.label === label);
                  return (
                    <span key={car.id} className="min-w-[120px] text-sm text-gray-900 text-center">
                      {spec?.value ?? '-'}
                    </span>
                  );
                })}
              </div>
            ))}
            <div className="flex border-b border-gray-100 py-2 overflow-x-auto">
              <span className="min-w-[100px] text-sm text-gray-500 shrink-0">Gi\u00e1</span>
              {cars.map((car) => (
                <span key={car.id} className="min-w-[120px] text-sm text-gray-900 text-center font-semibold">
                  {car.promoPrice
                    ? car.promoPrice.toLocaleString('vi-VN') + ' VN\u0110'
                    : car.price.toLocaleString('vi-VN') + ' VN\u0110'}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8" data-testid="empty-state">
          <p className="text-gray-600">{t('compare.emptyTitle')}</p>
          <button
            type="button"
            aria-label={t('compare.browseCatalog')}
            data-testid="browse-catalog-action"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => onNavigate('catalog')}
          >
            {t('compare.browseCatalog')}
          </button>
        </div>
      )}
    </div>
  );
}
