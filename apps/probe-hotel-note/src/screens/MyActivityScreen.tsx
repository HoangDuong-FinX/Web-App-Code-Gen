import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { loadMyInquiries, loadMyTestDrives, loadMyReservations } from '../fixtures/activities';
import type { ActivityItem } from '../types';
import BottomNav from './shared/BottomNav';

export default function MyActivityScreen(): React.JSX.Element {
  const { navigate } = useApp();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'test-drives' | 'reservations'>('inquiries');
  const [inquiries, setInquiries] = useState<ActivityItem[]>([]);
  const [testDrives, setTestDrives] = useState<ActivityItem[]>([]);
  const [reservations, setReservations] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [inq, td, res] = await Promise.all([
          loadMyInquiries(), loadMyTestDrives(), loadMyReservations(),
        ]);
        if (!cancelled) {
          setInquiries(inq);
          setTestDrives(td);
          setReservations(res);
        }
      } catch {
        // error
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const tabs = [
    { id: 'inquiries' as const, label: t('myActivity.tabInquiries'), testId: 'tab-inquiries' },
    { id: 'test-drives' as const, label: t('myActivity.tabTestDrives'), testId: 'tab-test-drives' },
    { id: 'reservations' as const, label: t('myActivity.tabReservations'), testId: 'tab-reservations' },
  ];

  function getItems(): ActivityItem[] {
    if (activeTab === 'inquiries') return inquiries;
    if (activeTab === 'test-drives') return testDrives;
    return reservations;
  }

  const variantColors: Record<string, string> = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    neutral: 'bg-gray-100 text-gray-600',
    error: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('home')} aria-label={t('myActivity.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('myActivity.title')}</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b" aria-label={t('myActivity.tabsAria')}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}
            data-testid={tab.testId}
            className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div className="p-4 space-y-3">
          {[1, 2].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="p-4 space-y-3 flex-1">
          {getItems().map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate('activity-detail', { currentActivityId: item.id, currentActivityType: item.type, currentCarId: item.carId })}
              aria-label={`${item.type === 'inquiry' ? t('myActivity.tabInquiries') : item.type === 'test-drive' ? t('myActivity.tabTestDrives') : t('myActivity.tabReservations')} ${item.carName}`}
              data-testid={`${item.type}-item`}
              className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow flex flex-col gap-1"
            >
              <span className="font-bold text-sm">{item.carName}</span>
              <span className="text-xs text-gray-500">{item.date}</span>
              {item.showroomName && <span className="text-xs text-gray-500">{item.showroomName}</span>}
              {item.depositAmount && <span className="text-xs text-blue-600">{item.depositAmount}</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${variantColors[item.statusVariant] ?? 'bg-gray-100 text-gray-600'}`}>
                {item.statusLabel}
              </span>
            </button>
          ))}
        </div>
      )}

      <BottomNav active="activity" />
    </div>
  );
}
