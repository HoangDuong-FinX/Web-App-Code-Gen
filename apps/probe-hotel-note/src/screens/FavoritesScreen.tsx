import React, { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';
import { t } from '../i18n';
import { getCarsByIds } from '../fixtures/cars';
import { getFavoriteIds, toggleFavorite } from '../state/favorites';
import { formatPrice } from '../utils/format';
import Toast from '../components/Toast';

interface FavoritesScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
}

export default function FavoritesScreen({ onNavigate }: FavoritesScreenProps): React.JSX.Element {
  const [cars, setCars] = useState<Car[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const ids = getFavoriteIds();
    setCars(getCarsByIds(ids));
  }, []);

  const handleRemove = useCallback((carId: string) => {
    const result = toggleFavorite(carId);
    setCars(getCarsByIds(result.ids));
    if (!result.saved) {
      setToastMsg(t('common.saveFailed'));
      setToastVisible(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('home')}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('favorites.title')}</h1>
      </header>

      {cars.length > 0 ? (
        <div className="flex flex-col gap-3 p-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex gap-3 items-center p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
              data-testid="favorite-car-row"
              onClick={() => onNavigate('car-detail', { carId: car.id })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('car-detail', { carId: car.id }); } }}
              tabIndex={0}
              aria-label={car.name}
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-20 h-15 object-cover rounded-lg" />
              <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-semibold text-gray-900">{car.name}</h3>
                <p className="text-gray-700">{formatPrice(car.promoPrice ?? car.price)}</p>
                <p className="text-sm text-gray-500">{car.keySpecs}</p>
              </div>
              <button
                type="button"
                aria-label={t('favorites.removeAria', { name: car.name })}
                data-testid="remove-favorite-action"
                className="p-2 text-gray-400 hover:text-red-500 text-lg"
                onClick={(e) => { e.stopPropagation(); handleRemove(car.id); }}
              >
                \u2715
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8" data-testid="empty-state">
          <img src="https://placehold.co/200x150/f1f5f9/94a3b8?text=No+Favorites" alt={t('favorites.emptyAlt')} data-testid="empty-state-illustration" className="w-48 h-36 object-contain" />
          <p className="text-gray-600">{t('favorites.emptyTitle')}</p>
          <button
            type="button"
            aria-label={t('favorites.browseCatalog')}
            data-testid="browse-catalog-action"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => onNavigate('catalog')}
          >
            {t('favorites.browseCatalog')}
          </button>
        </div>
      )}

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
