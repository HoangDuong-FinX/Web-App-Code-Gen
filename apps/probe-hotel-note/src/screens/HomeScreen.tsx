import React, { useState, useEffect, useCallback } from 'react';
import type { Car, Category } from '../types';
import { t } from '../i18n';
import { loadFeaturedCars } from '../fixtures/cars';
import { toggleFavorite, getFavoriteIds } from '../state/favorites';
import { toggleCompare, getCompareIds } from '../state/compare';
import { formatPrice } from '../utils/format';
import Toast from '../components/Toast';

interface HomeScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps): React.JSX.Element {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroBannerUrl, setHeroBannerUrl] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const data = loadFeaturedCars();
    setFeaturedCars(data.featuredCars);
    setCategories(data.categories);
    setHeroBannerUrl(data.heroBannerUrl);
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
  }, []);

  const handleToggleFavorite = useCallback((carId: string) => {
    const result = toggleFavorite(carId);
    setFavoriteIds(result.ids);
    if (!result.saved) {
      setToastMsg(t('common.saveFailed'));
      setToastVisible(true);
    }
  }, []);

  const handleToggleCompare = useCallback((carId: string) => {
    const result = toggleCompare(carId);
    setCompareIds(result.ids);
    if (result.limitReached) {
      setToastMsg(t('compare.limitToast'));
      setToastVisible(true);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) {
      onNavigate('search-results', { keyword: searchValue.trim() });
    }
  }, [searchValue, onNavigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600" aria-label={t('app.logo')}>{t('app.logo')}</span>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label={t('nav.favorites')}
            data-testid="favorites-nav-action"
            className="p-2 text-lg text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-100"
            onClick={() => onNavigate('favorites')}
          >
            \u2661
          </button>
          <button
            type="button"
            aria-label={t('nav.admin')}
            data-testid="admin-nav-action"
            className="p-2 text-lg text-gray-600 hover:text-blue-500 rounded-full hover:bg-gray-100"
            onClick={() => onNavigate('admin-listings')}
          >
            \u2699
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4">
        <img
          src={heroBannerUrl}
          alt={t('home.heroBannerAlt')}
          className="w-full aspect-[16/9] object-cover rounded-xl"
          data-testid="hero-banner"
        />
        <div className="relative">
          <input
            type="search"
            placeholder={t('home.searchPlaceholder')}
            aria-label={t('home.searchPlaceholder')}
            data-testid="search-input"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </div>
      </div>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('home.categories')}</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-label={t('catalog.filterBy', { name: cat.name })}
              data-testid="category-chip"
              className="shrink-0 px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => onNavigate('catalog', { brand: cat.type === 'brand' ? cat.name : undefined })}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 p-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('home.featured')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col gap-2 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
              data-testid="car-card"
              onClick={() => onNavigate('car-detail', { carId: car.id })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('car-detail', { carId: car.id }); } }}
              tabIndex={0}
              aria-label={car.name}
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-full aspect-[4/3] object-cover rounded-lg" data-testid="car-thumbnail" />
              <h3 className="font-semibold text-gray-900" data-testid="car-name">{car.name}</h3>
              <div className="flex items-center gap-2" data-testid="car-price">
                {car.promoPrice ? (
                  <>
                    <span className="text-red-600 font-semibold">{formatPrice(car.promoPrice)}</span>
                    <span className="text-gray-400 line-through text-sm">{formatPrice(car.price)}</span>
                  </>
                ) : (
                  <span className="text-gray-900 font-semibold">{formatPrice(car.price)}</span>
                )}
              </div>
              <p className="text-sm text-gray-500" data-testid="car-year-mileage">{car.keySpecs}</p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  aria-label={favoriteIds.includes(car.id) ? t('common.removeFromFavorite') : t('common.addToFavorite')}
                  data-testid="favorite-toggle"
                  className={`p-1.5 rounded-full text-lg ${favoriteIds.includes(car.id) ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`}
                  onClick={(e) => { e.stopPropagation(); handleToggleFavorite(car.id); }}
                >
                  {favoriteIds.includes(car.id) ? '\u2764' : '\u2661'}
                </button>
                <button
                  type="button"
                  aria-label={compareIds.includes(car.id) ? t('common.removeFromCompare') : t('common.addToCompare')}
                  data-testid="compare-toggle"
                  className={`p-1.5 rounded-full text-lg ${compareIds.includes(car.id) ? 'text-blue-500' : 'text-gray-400'} hover:bg-gray-100`}
                  onClick={(e) => { e.stopPropagation(); handleToggleCompare(car.id); }}
                >
                  \u21d4
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          aria-label={t('home.viewAll')}
          data-testid="view-all-action"
          className="w-full py-3 text-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => onNavigate('catalog')}
        >
          {t('home.viewAll')}
        </button>
      </section>

      {compareIds.length > 0 && (
        <button
          type="button"
          aria-label={t('carDetail.compare')}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 z-40"
          onClick={() => onNavigate('compare')}
        >
          \u21d4 {compareIds.length}
        </button>
      )}

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
