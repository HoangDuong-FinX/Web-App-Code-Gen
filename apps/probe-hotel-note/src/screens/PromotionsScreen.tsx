import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadPromotionsList } from '../fixtures/promotions';
import type { Promotion } from '../types';
import BottomNav from './shared/BottomNav';

export default function PromotionsScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await loadPromotionsList();
        if (!cancelled) setPromotions(data);
      } catch {
        // error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('home')} aria-label={t('promotions.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('promotions.title')}</h1>
      </header>

      {loading ? (
        <div className="p-4 space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="p-4 space-y-4 flex-1">
          {promotions.map(promo => (
            <button
              key={promo.id}
              type="button"
              onClick={() => navigate('promo-detail', { currentPromoId: promo.id })}
              aria-label={promo.title}
              data-testid="promo-list-card"
              className="w-full bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
            >
              <img src={promo.bannerUrl} alt={promo.title} className="w-full aspect-video object-cover" />
              <div className="p-3 flex flex-col gap-1">
                <span className="text-sm font-bold">{promo.title}</span>
                <span className="text-xs text-gray-500">{promo.validity}</span>
                <span className="text-xs text-gray-500">{t('promotions.applicableTo')} {promo.applicableModelsPreview}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <BottomNav active="promotions" />
    </div>
  );
}
