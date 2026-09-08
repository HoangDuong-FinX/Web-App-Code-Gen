import { useState, useMemo } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { searchCars, featuredCars } from '../fixtures/cars';
import { formatPrice } from '../utils';

interface SearchResultsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectCar: (carId: string) => void;
  keyword: string;
  onKeywordChange: (kw: string) => void;
  isAuthenticated: boolean;
  wishlistIds: string[];
  onToggleWishlist: (carId: string) => void;
  compareList: string[];
  onToggleCompare: (carId: string) => void;
}

export default function SearchResultsScreen({
  onNavigate,
  onSelectCar,
  keyword,
  onKeywordChange,
  isAuthenticated,
  wishlistIds,
  onToggleWishlist,
  compareList,
  onToggleCompare,
}: SearchResultsScreenProps) {
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showSort, setShowSort] = useState(false);

  const { results, totalCount } = useMemo(
    () => searchCars(localKeyword, filters),
    [localKeyword, filters],
  );

  const handleSearch = () => {
    onKeywordChange(localKeyword);
  };

  const handleSort = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort }));
    setShowSort(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="text-gray-600 p-2"
            aria-label={t('nav.back')}
          >
            \u2190
          </button>
          <input
            type="text"
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('home.searchPlaceholder')}
            className="flex-1 bg-gray-100 rounded-lg px-3 py-2 text-sm"
            aria-label={t('home.searchPlaceholder')}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setFilters({})}
            className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-700"
            aria-label={t('search.filter')}
          >
            {t('search.filter')}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-700"
              aria-label={t('search.sort')}
            >
              {t('search.sort')}
            </button>
            {showSort && (
              <div className="absolute top-8 left-0 bg-white shadow-lg rounded-lg py-1 z-30 min-w-[160px]">
                {[
                  { key: 'price-asc', label: t('search.sortPriceAsc') },
                  { key: 'price-desc', label: t('search.sortPriceDesc') },
                  { key: 'year', label: t('search.sortYear') },
                  { key: 'mileage', label: t('search.sortMileage') },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleSort(opt.key)}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    aria-label={opt.label}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {filters.sort && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
              {filters.sort}
              <button
                onClick={() => setFilters((p) => { const n = { ...p }; delete n.sort; return n; })}
                aria-label={t('common.close')}
              >
                \u00D7
              </button>
            </span>
          )}
        </div>
      </header>

      {/* Result count */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-600">{t('search.resultCount', { count: totalCount })}</p>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <p className="text-gray-500 text-lg">{t('search.noResults')}</p>
          <p className="text-gray-400 text-sm mt-2">{t('search.noResultsSuggestion')}</p>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((car) => (
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
                    <p className="text-blue-600 font-bold mt-1">{formatPrice(car.price)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onToggleWishlist(car.id)}
                      className={`p-1.5 rounded-full ${wishlistIds.includes(car.id) ? 'text-red-500' : 'text-gray-400'}`}
                      aria-label={t('wishlist.title')}
                    >
                      {wishlistIds.includes(car.id) ? '\u2665' : '\u2661'}
                    </button>
                    <button
                      onClick={() => onToggleCompare(car.id)}
                      className={`p-1.5 rounded-full text-xs ${compareList.includes(car.id) ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}
                      aria-label={t('carDetail.compare')}
                    >
                      \u2194
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {car.year} | {car.mileage > 0 ? `${car.mileage.toLocaleString()} ${t('common.km')}` : t('common.new')} | {car.fuelType}
                </p>
                {car.tag && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{car.tag}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
