import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { dealerLeadsData } from '../fixtures/dealer';
import { formatDate } from '../utils';
import { formatPrice } from '../utils';

interface DealerLeadsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectOrder: (orderId: string) => void;
}

type TabKey = 'test-drives' | 'inquiries' | 'orders';

export default function DealerLeadsScreen({ onNavigate, onSelectOrder }: DealerLeadsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('test-drives');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'test-drives', label: t('leads.testDrives') },
    { key: 'inquiries', label: t('leads.inquiries') },
    { key: 'orders', label: t('leads.orders') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('dealer-dashboard')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('leads.title')}</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
            aria-label={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {/* Test Drives Tab */}
        {activeTab === 'test-drives' && (
          dealerLeadsData.testDriveLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('leads.empty')}</p>
          ) : (
            <div className="space-y-3">
              {dealerLeadsData.testDriveLeads.map((lead, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.buyerName}</p>
                      <p className="text-xs text-gray-500">{lead.carName}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(lead.requestedDate)}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{lead.status}</span>
                  </div>
                  <button className="mt-2 text-sm text-blue-600 font-medium" aria-label={t('leads.respond')}>{t('leads.respond')}</button>
                </div>
              ))}
            </div>
          )
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          dealerLeadsData.inquiryLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('leads.empty')}</p>
          ) : (
            <div className="space-y-3">
              {dealerLeadsData.inquiryLeads.map((lead, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.buyerName}</p>
                      <p className="text-xs text-gray-500">{lead.carName}</p>
                      <p className="text-xs text-gray-600 mt-1">{lead.messagePreview}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(lead.date)}</p>
                    </div>
                  </div>
                  <button className="mt-2 text-sm text-blue-600 font-medium" aria-label={t('leads.respond')}>{t('leads.respond')}</button>
                </div>
              ))}
            </div>
          )
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          dealerLeadsData.orderLeads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">{t('leads.empty')}</p>
          ) : (
            <div className="space-y-3">
              {dealerLeadsData.orderLeads.map((lead, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.buyerName}</p>
                      <p className="text-xs text-gray-500">{lead.carName}</p>
                      <p className="text-sm font-bold text-blue-600 mt-1">{formatPrice(lead.amount)}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {t(`myOrders.status.${lead.status}`)}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectOrder('order-001')}
                    className="mt-2 text-sm text-blue-600 font-medium"
                    aria-label={t('leads.viewOrder')}
                  >
                    {t('leads.viewOrder')}
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
