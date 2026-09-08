import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadActivityDetail } from '../fixtures/activities';
import type { ActivityDetail } from '../types';

export default function ActivityDetailScreen(): React.JSX.Element {
  const { navigate, currentCarId } = useApp();
  const [detail, setDetail] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await loadActivityDetail();
        if (!cancelled) setDetail(data);
      } catch {
        // error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" aria-label={t('resPayment.processing')} /></div>;
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-gray-500 mb-4">{t('catalog.emptyTitle')}</p>
        <button type="button" onClick={() => navigate('my-activity')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{t('myActivity.back')}</button>
      </div>
    );
  }

  const variantColors: Record<string, string> = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    neutral: 'bg-gray-100 text-gray-600',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('my-activity')} aria-label={t('activityDetail.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('activityDetail.title')}</h1>
      </header>

      {/* Car info */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('activityDetail.carInfo')}</h3>
        <div className="flex gap-3 items-center">
          <img src={detail.car.thumbnailUrl} alt={detail.car.name} className="w-20 aspect-[4/3] object-cover rounded-lg" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">{detail.car.name}</span>
            <span className="text-sm text-blue-600">{detail.car.formattedPrice}</span>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('activityDetail.status')}</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${variantColors[detail.activity.statusVariant] ?? 'bg-gray-100 text-gray-600'}`}>
          {detail.activity.statusLabel}
        </span>
      </section>

      {/* Details */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('activityDetail.details')}</h3>
        <p className="text-sm whitespace-pre-line">{detail.activity.typeSpecificDetails}</p>
      </section>

      {/* Timeline */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('activityDetail.history')}</h3>
        <div className="divide-y">
          {detail.timeline.map((event: { date: string; description: string }, i: number) => (
            <div key={i} className="flex gap-3 py-2">
              <span className="text-xs text-gray-500 w-20 flex-shrink-0">{event.date}</span>
              <span className="text-sm flex-1">{event.description}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="p-4 mt-auto">
        <button
          type="button"
          onClick={() => navigate('car-detail', { currentCarId: detail.car.id ?? currentCarId })}
          aria-label={t('activityDetail.viewCarAria')}
          data-testid="view-car"
          className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
        >
          {t('activityDetail.viewCar')}
        </button>
      </div>
    </div>
  );
}
