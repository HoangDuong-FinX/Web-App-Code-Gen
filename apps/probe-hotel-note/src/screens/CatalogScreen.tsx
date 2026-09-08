import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useCompare } from '../context/CompareContext';
import { loadCatalog } from '../fixtures/cars';
import type { Car } from '../types';
import BottomNav from './shared/BottomNav';

export default function CatalogScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const { isInCompare, addToCompare, removeFromCompare, compareList } = useCompare();
  const [cars, setCars] = useState<Car[]>([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCompareFullWarning, setShowCompareFullWarning] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await loadCatalog();
        if (!cancelled) {
          setCars(data.cars);
          setResultsCount(data.resultsCount);
        }
      } catch {
        // handled by empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  function handleCompareToggle(car: Car): void {
    if (isInCompare(car.id)) {
      removeFromCompare(car.id);
    } else if (compareList.length >= 3) {
      setShowCompareFullWarning(true);
    } else {
      addToCompare(car);
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Header */}
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('home')} aria-label={t('catalog.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold flex-1">{t('catalog.title')}</h1>
        <button type="button" onClick={() => navigate('search')} aria-label={t('home.search')} data-testid="search-trigger" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </header>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
        {['filterMake', 'filterPrice', 'filterBody', 'filterCondition'].map(key => (
          <span key={key} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-gray-100 text-sm" aria-label={`${t('catalog.filterAriaPrefix')} ${t(`catalog.${key}`)}`} data-testid={`filter-${key.replace('filter', '').toLowerCase()}`}>
            {t(`catalog.${key}`)}
          </span>
        ))}
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center px-4 py-2">
        <span className="text-xs text-gray-500">{t('catalog.resultsCount', { count: resultsCount })}</span>
      </div>

      {/* Car list */}
      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : cars.length === 0 ? (
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="text-center text-gray-700">{t('catalog.emptyTitle')}</p>
          <p className="text-center text-sm text-gray-500">{t('catalog.emptySubtitle')}</p>
        </div>
      ) : (
        <div className="p-4 space-y-3 flex-1">
          {cars.map(car => (
            <button
              key={car.id}
              type="button"
              onClick={() => navigate('car-detail', { currentCarId: car.id })}
              aria-label={car.name}
              data-testid="car-list-card"
              className="w-full flex bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-28 aspect-[4/3] object-cover" />
              <div className="p-3 flex-1 flex flex-col gap-1">
                <span className="text-sm font-bold">{car.name}</span>
                <span className="text-sm font-bold text-blue-600">{car.formattedPrice}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${car.condition === 'Mới' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {car.condition}
                </span>
                <span className="text-xs text-gray-500">{car.specsSummary}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCompareToggle(car); }}
                  aria-label={t('catalog.compareAria', { name: car.name })}
                  data-testid="compare-toggle"
                  className={`self-end p-1 rounded ${isInCompare(car.id) ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </button>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Compare Tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white shadow-lg border-t p-3 flex items-center gap-2 z-10">
          <div className="flex gap-2 flex-1">
            {compareList.map(c => (
              <div key={c.id} className="flex flex-col items-center gap-1">
                <img src={c.thumbnailUrl} alt={c.name} className="w-12 h-9 object-cover rounded" />
                <button type="button" onClick={() => removeFromCompare(c.id)} aria-label={`${t('compareTray.removeAria')} ${c.name}`} className="text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate('compare')}
            aria-label={t('compareTray.openAria')}
            data-testid="open-compare"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium"
          >
            {t('compareTray.open')} ({compareList.length})
          </button>
        </div>
      )}

      {/* Compare Full Warning Modal */}
      {showCompareFullWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-label={t('modal.compareFull.title')} data-testid="compare-full-dialog">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">{t('modal.compareFull.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('modal.compareFull.body')}</p>
            <button
              type="button"
              onClick={() => setShowCompareFullWarning(false)}
              aria-label={t('modal.compareFull.dismissAria')}
              data-testid="dismiss-compare-warning"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
            >
              {t('modal.compareFull.dismiss')}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="catalog" />
    </div>
  );
}
