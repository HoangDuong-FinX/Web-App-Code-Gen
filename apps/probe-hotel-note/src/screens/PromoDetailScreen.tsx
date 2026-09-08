import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadPromoDetail } from '../fixtures/promotions';
import type { Promotion } from '../types';

export default function PromoDetailScreen(): React.JSX.Element {
  const { navigate, currentPromoId } = useApp();
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!currentPromoId) return;
      try {
        const data = await loadPromoDetail(currentPromoId);
        if (!cancelled) setPromo(data);
      } catch {
        // error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [currentPromoId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label={t('resPayment.processing')} /></div>;
  }

  if (!promo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-gray-500 mb-4">{t('catalog.emptyTitle')}</p>
        <button type="button" onClick={() => navigate('promotions')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{t('promotions.back')}</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('promotions')} aria-label={t('promoDetail.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('promoDetail.title')}</h1>
      </header>

      <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />

      <section className="p-4 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{promo.title}</h2>
        <span className="text-xs text-gray-500">{promo.validity}</span>
        <p className="text-sm text-gray-700">{promo.termsAndConditions}</p>
      </section>

      {/* Eligible cars */}
      <section className="p-4">
        <h3 className="text-lg font-bold mb-3">{t('promoDetail.eligibleCars')}</h3>
        <div className="space-y-3">
          {promo.eligibleCars.map(car => (
            <button
              key={car.id}
              type="button"
              onClick={() => navigate('car-detail', { currentCarId: car.id })}
              aria-label={car.name}
              data-testid="eligible-car-card"
              className="w-full flex bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
            >
              <img src={car.thumbnailUrl} alt={car.name} className="w-24 aspect-[4/3] object-cover" />
              <div className="p-3 flex-1 flex flex-col gap-1">
                <span className="text-sm font-bold">{car.name}</span>
                <span className="text-sm font-bold text-blue-600">{car.formattedPrice}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 w-fit">{car.promoDiscountTag}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="p-4">
        <button
          type="button"
          onClick={() => navigate('catalog')}
          aria-label={t('promoDetail.viewAllAria')}
          data-testid="view-all-eligible"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          {t('promoDetail.viewAll')}
        </button>
      </div>
    </div>
  );
}
