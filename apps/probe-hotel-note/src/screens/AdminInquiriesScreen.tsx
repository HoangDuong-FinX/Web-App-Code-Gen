import React, { useState, useEffect, useCallback } from 'react';
import type { Inquiry } from '../types';
import { t } from '../i18n';
import { loadAdminInquiries } from '../fixtures/inquiries';

interface AdminInquiriesScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
}

const STATUS_FILTERS = [
  { key: 'all', label: 'adminInquiries.filterAll' },
  { key: 'new', label: 'adminInquiries.filterNew' },
  { key: 'contacted', label: 'adminInquiries.filterContacted' },
  { key: 'closed', label: 'adminInquiries.filterClosed' },
];

export default function AdminInquiriesScreen({ onNavigate }: AdminInquiriesScreenProps): React.JSX.Element {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = useCallback((filter: string) => {
    setInquiries(loadAdminInquiries(filter));
  }, []);

  useEffect(() => {
    loadData(statusFilter);
  }, [statusFilter, loadData]);

  const statusBadgeClass = (status: string): string => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('admin-listings')}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('adminInquiries.title')}</h1>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-gray-100">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            data-testid="status-filter-tab"
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${statusFilter === f.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
            onClick={() => setStatusFilter(f.key)}
            aria-label={t('catalog.filterBy', { name: t(f.label) })}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      {inquiries.length > 0 ? (
        <div className="flex flex-col gap-3 p-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="flex justify-between items-center p-3 rounded-xl border border-gray-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
              data-testid="inquiry-row"
              onClick={() => onNavigate('admin-inquiry-detail', { inquiryId: inq.id })}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNavigate('admin-inquiry-detail', { inquiryId: inq.id }); } }}
              tabIndex={0}
              aria-label={inq.buyerName}
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-gray-900" data-testid="buyer-name">{inq.buyerName}</p>
                <p className="text-sm text-gray-500" data-testid="inquiry-car-name">{inq.carName}</p>
                <p className="text-xs text-gray-400" data-testid="inquiry-date">{inq.date}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(inq.status)}`} data-testid="inquiry-status-badge">
                {t('status.' + inq.status)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8" data-testid="empty-state">
          <img src="https://placehold.co/200x150/f1f5f9/94a3b8?text=No+Inquiries" alt={t('adminInquiries.emptyAlt')} data-testid="empty-state-illustration" className="w-48 h-36 object-contain" />
          <p className="text-gray-600">{t('adminInquiries.emptyTitle')}</p>
        </div>
      )}
    </div>
  );
}
