import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { loadFeaturedCars } from '../fixtures/cars';
import { loadHomePromotions } from '../fixtures/promotions';
import type { Car, Promotion } from '../types';
import BottomNav from './shared/BottomNav';

export default function HomeScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const { isLoggedIn } = useAuth();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cars, promos] = await Promise.all([loadFeaturedCars(), loadHomePromotions()]);
        if (!cancelled) {
          setFeaturedCars(cars);
          setPromotions(promos);
        }
      } catch {
        // Silently handle - sections will be empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const bodyTypes = [
    { key: 'Sedan', label: t('home.filterSedan') },
    { key: 'SUV', label: t('home.filterSuv') },
    { key: 'Truck', label: t('home.filterTruck') },
    { key: 'Hatchback', label: t('home.filterHatchback') },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <span className="text-xl font-bold text-blue-600" aria-label={t('app.title')}>{t('app.title')}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('search')}
            aria-label={t('home.search')}
            data-testid="search-trigger"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <button
            type="button"
            onClick={() => navigate(isLoggedIn ? 'my-activity' : 'login', { returnTo: 'home' })}
            aria-label={t('home.account')}
            data-testid="profile-trigger"
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </button>
        </div>
      </header>

      {/* Promo Carousel */}
      {promotions.length > 0 && (
        <section aria-label={t('home.promoBanner')} className="relative">
          <div className="overflow-x-auto flex snap-x snap-mandatory scrollbar-hide">
            {promotions.map(promo => (
              <button
                key={promo.id}
                type="button"
                onClick={() => navigate('promo-detail', { currentPromoId: promo.id })}
                className="snap-start flex-shrink-0 w-full"
                aria-label={promo.title}
              >
                <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Quick Filters */}
      <section className="p-4">
        <h2 className="text-lg font-bold">{t('home.quickFilter')}</h2>
        <div className="flex flex-wrap gap-2 pt-3">
          {bodyTypes.map(bt => (
            <button
              key={bt.key}
              type="button"
              onClick={() => navigate('catalog')}
              aria-label={`${t('home.filterAriaPrefix')} ${bt.label}`}
              data-testid={`quick-filter-${bt.key.toLowerCase()}`}
              className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              {bt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{t('home.featuredCars')}</h2>
          <button
            type="button"
            onClick={() => navigate('catalog')}
            aria-label={t('home.viewAllFeatured')}
            data-testid="view-all-featured"
            className="text-sm text-blue-600 font-medium"
          >
            {t('home.viewAll')}
          </button>
        </div>
        {loading ? (
          <div className="flex gap-3 pt-3 overflow-x-auto">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-48 h-56 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 pt-3 overflow-x-auto pb-2 scrollbar-hide">
            {featuredCars.map(car => (
              <button
                key={car.id}
                type="button"
                onClick={() => navigate('car-detail', { currentCarId: car.id })}
                aria-label={car.name}
                data-testid="featured-car-card"
                className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
              >
                <img src={car.thumbnailUrl} alt={car.name} className="w-full aspect-[4/3] object-cover" />
                <div className="p-3 flex flex-col gap-1">
                  <span className="text-sm font-bold truncate">{car.name}</span>
                  <span className="text-sm font-bold text-blue-600">{car.formattedPrice}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${car.condition === 'Mới' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {car.condition}
                  </span>
                  <span className="text-xs text-gray-500">{car.specsSummary}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Promotions */}
      <section className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{t('home.promotions')}</h2>
          <button
            type="button"
            onClick={() => navigate('promotions')}
            aria-label={t('home.viewAllPromos')}
            data-testid="view-all-promos"
            className="text-sm text-blue-600 font-medium"
          >
            {t('home.viewAll')}
          </button>
        </div>
        <div className="flex gap-3 pt-3 overflow-x-auto pb-2 scrollbar-hide">
          {promotions.map(promo => (
            <button
              key={promo.id}
              type="button"
              onClick={() => navigate('promo-detail', { currentPromoId: promo.id })}
              aria-label={promo.title}
              data-testid="promo-card"
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
            >
              <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />
              <div className="p-3 flex flex-col gap-1">
                <span className="text-sm font-bold">{promo.title}</span>
                <span className="text-xs text-gray-500">{promo.validity}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BottomNav active="home" />
    </div>
  );
}
