import React, { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';
import { t } from '../i18n';
import { searchCars } from '../fixtures/cars';
import { toggleFavorite, getFavoriteIds } from '../state/favorites';
import { toggleCompare, getCompareIds } from '../state/compare';
import { formatPrice } from '../utils/format';
import Toast from '../components/Toast';

interface SearchResultsScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function SearchResultsScreen({ onNavigate, params }: SearchResultsScreenProps): React.JSX.Element {
  const initialKeyword = (params.keyword as string) || '';
  const [keyword, setKeyword] = useState(initialKeyword);
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const doSearch = useCallback((kw: string, pg: number, append: boolean) => {
    if (!kw.trim()) {
      if (!append) { setCars([]); setTotalCount(0); setHasMore(false); }
      return;
    }
    const result = searchCars(kw, pg);
    setCars((prev) => (append ? [...prev, ...result.cars] : result.cars));
    setTotalCount(result.totalCount);
    setHasMore(result.hasMore);
  }, []);

  useEffect(() => {
    doSearch(keyword, 1, false);
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
  }, [keyword, doSearch]);

  const handleLoadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    doSearch(keyword, next, true);
  }, [page, keyword, doSearch]);

  const handleToggleFavorite = useCallback((carId: string) => {
    const result = toggleFavorite(carId);
    setFavoriteIds(result.ids);
  }, []);

  const handleToggleCompare = useCallback((carId: string) => {
    const result = toggleCompare(carId);
    setCompareIds(result.ids);
    if (result.limitReached) {
      setToastMsg(t('compare.limitToast'));
      setToastVisible(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('home')}>
          \u2190
        </button>
        <input
          type="search"
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          data-testid="search-input"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
        />
      </header>

      {keyword.trim() && (
        <p className="px-4 py-2 text-sm text-gray-500" data-testid="results-count">
          {t('search.resultsCount', { count: totalCount, keyword })}
        </p>
      )}

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="flex flex-col gap-2 p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
              data-testid="car-card"
              onClick={() => onNavigate('car-detail', { carId: car.id })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('car-detail', { carId: car.id }); } }}
              tabIndex={0}
              aria-label={car.name}
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-full aspect-[4/3] object-cover rounded-lg" />
              <h3 className="font-semibold text-gray-900">{car.name}</h3>
              <div className="flex items-center gap-2">
                {car.promoPrice ? (
                  <><span className="text-red-600 font-semibold">{formatPrice(car.promoPrice)}</span><span className="text-gray-400 line-through text-sm">{formatPrice(car.price)}</span></>
                ) : (
                  <span className="text-gray-900 font-semibold">{formatPrice(car.price)}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">{car.keySpecs}</p>
              <div className="flex justify-end gap-2">
                <button type="button" aria-label={favoriteIds.includes(car.id) ? t('common.removeFromFavorite') : t('common.addToFavorite')} data-testid="favorite-toggle" className={`p-1.5 rounded-full text-lg ${favoriteIds.includes(car.id) ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`} onClick={(e) => { e.stopPropagation(); handleToggleFavorite(car.id); }}>
                  {favoriteIds.includes(car.id) ? '\u2764' : '\u2661'}
                </button>
                <button type="button" aria-label={compareIds.includes(car.id) ? t('common.removeFromCompare') : t('common.addToCompare')} data-testid="compare-toggle" className={`p-1.5 rounded-full text-lg ${compareIds.includes(car.id) ? 'text-blue-500' : 'text-gray-400'} hover:bg-gray-100`} onClick={(e) => { e.stopPropagation(); handleToggleCompare(car.id); }}>
                  \u21d4
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : keyword.trim() ? (
        <div className="flex flex-col items-center gap-3 p-8" data-testid="empty-state">
          <img src="https://placehold.co/200x150/f1f5f9/94a3b8?text=No+Results" alt={t('search.emptyAlt')} data-testid="empty-state-illustration" className="w-48 h-36 object-contain" />
          <p className="text-gray-600">{t('search.emptyTitle')}</p>
          <p className="text-sm text-gray-400" data-testid="search-suggestion">{t('search.emptySuggestion')}</p>
        </div>
      ) : null}

      {hasMore && cars.length > 0 && (
        <div className="px-4 pb-4">
          <button type="button" aria-label={t('search.loadMore')} data-testid="load-more-trigger" className="w-full py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={handleLoadMore}>
            {t('search.loadMore')}
          </button>
        </div>
      )}

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
