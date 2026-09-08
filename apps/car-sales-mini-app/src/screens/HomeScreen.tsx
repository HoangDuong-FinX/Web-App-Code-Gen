import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { featuredCars, brands, bodyTypes } from '../fixtures/cars';
import { formatPrice } from '../utils';
import BottomNav from '../components/BottomNav';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectCar: (carId: string) => void;
  onSearch: (keyword: string) => void;
  isAuthenticated: boolean;
  wishlistIds: string[];
  onToggleWishlist: (carId: string) => void;
  compareList: string[];
  onToggleCompare: (carId: string) => void;
}

export default function HomeScreen({
  onNavigate,
  onSelectCar,
  onSearch,
  isAuthenticated,
  wishlistIds,
  onToggleWishlist,
  compareList,
  onToggleCompare,
}: HomeScreenProps) {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch(keyword);
    onNavigate('search-results');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-blue-700 text-white px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold">{t('app.title')}</h1>
        <p className="text-blue-200 text-sm mt-1">{t('app.tagline')}</p>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('home.searchPlaceholder')}
            className="flex-1 rounded-lg px-4 py-3 text-gray-900 bg-white text-sm"
            aria-label={t('home.searchPlaceholder')}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 rounded-lg font-medium"
            aria-label={t('nav.search')}
          >
            \u2315
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 -mt-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
          <p className="text-lg font-semibold">{t('home.heroBanner')}</p>
          <p className="text-sm text-blue-200 mt-1">{t('app.tagline')}</p>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.browseByBrand')}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => {
                onSearch('');
                onNavigate('search-results');
              }}
              className="flex flex-col items-center min-w-[72px] p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              aria-label={brand.name}
            >
              <img src={brand.logoUrl} alt={brand.name} className="w-12 h-12 rounded-full" />
              <span className="text-xs text-gray-700 mt-1 whitespace-nowrap">{brand.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.featuredCars')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => onSelectCar(car.id)}
                className="w-full text-left"
                aria-label={car.name}
              >
                <img src={car.thumbnail} alt={car.name} className="w-full h-40 object-cover" />
              </button>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{car.name}</h3>
                    <p className="text-blue-600 font-bold text-base mt-1">{formatPrice(car.price)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onToggleWishlist(car.id)}
                      className={`p-1.5 rounded-full ${
                        wishlistIds.includes(car.id) ? 'text-red-500' : 'text-gray-400'
                      }`}
                      aria-label={t('wishlist.title')}
                      data-testid={`wishlist-toggle-${car.id}`}
                    >
                      {wishlistIds.includes(car.id) ? '\u2665' : '\u2661'}
                    </button>
                    <button
                      onClick={() => onToggleCompare(car.id)}
                      className={`p-1.5 rounded-full text-xs ${
                        compareList.includes(car.id) ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
                      }`}
                      aria-label={t('carDetail.compare')}
                      data-testid={`compare-toggle-${car.id}`}
                    >
                      \u2194
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {car.year} | {car.mileage > 0 ? `${car.mileage.toLocaleString()} ${t('common.km')}` : t('common.new')} | {car.fuelType}
                </p>
                {car.tag && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {car.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body Types */}
      <section className="mt-6 px-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('home.bodyTypes')}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {bodyTypes.map((bt) => (
            <button
              key={bt.id}
              onClick={() => onNavigate('search-results')}
              className="flex flex-col items-center min-w-[80px] p-3 bg-white rounded-xl shadow-sm hover:shadow-md"
              aria-label={bt.label}
            >
              <img src={bt.iconUrl} alt={bt.label} className="w-14 h-10 object-contain" />
              <span className="text-xs text-gray-700 mt-1">{bt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Compare floating bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between z-30 shadow-lg">
          <div className="flex gap-2">
            {compareList.map((cid) => {
              const car = featuredCars.find((c) => c.id === cid);
              return car ? (
                <div key={cid} className="relative">
                  <img src={car.thumbnail} alt={car.name} className="w-12 h-8 rounded object-cover" />
                  <button
                    onClick={() => onToggleCompare(cid)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                    aria-label={t('compare.remove')}
                  >
                    \u00D7
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <button
            onClick={() => onNavigate('compare')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            aria-label={t('compare.compareNow')}
          >
            {t('compare.compareNow')} ({compareList.length})
          </button>
        </div>
      )}

      <BottomNav currentScreen="home" onNavigate={onNavigate} isAuthenticated={isAuthenticated} />
    </div>
  );
}
