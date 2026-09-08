import React, { useState, useEffect, useCallback } from 'react';
import type { Inquiry } from '../types';
import { t } from '../i18n';
import { loadInquiryDetail, updateInquiryStatusFixture } from '../fixtures/inquiries';
import Toast from '../components/Toast';

interface AdminInquiryDetailScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function AdminInquiryDetailScreen({ onNavigate, params }: AdminInquiryDetailScreenProps): React.JSX.Element {
  const inquiryId = params.inquiryId as string;
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    setInquiry(loadInquiryDetail(inquiryId));
  }, [inquiryId]);

  const handleUpdateStatus = useCallback((newStatus: string) => {
    const result = updateInquiryStatusFixture();
    if (result.success) {
      setInquiry((prev) => (prev ? { ...prev, status: newStatus as Inquiry['status'] } : prev));
      setToastMsg(t('common.successToast'));
      setToastVisible(true);
    } else {
      setToastMsg(t('common.errorRetry'));
      setToastVisible(true);
    }
  }, []);

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
        <p className="text-gray-600">{t('common.error')}</p>
        <button type="button" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => onNavigate('admin-inquiries')}>{t('nav.back')}</button>
      </div>
    );
  }

  const statusBadgeClass = (status: string): string => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'contacted': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const customerFields = [
    { label: t('adminInquiryDetail.fieldName'), value: inquiry.buyerName },
    { label: t('adminInquiryDetail.fieldPhone'), value: inquiry.phone },
    ...(inquiry.email ? [{ label: t('adminInquiryDetail.fieldEmail'), value: inquiry.email }] : []),
    ...(inquiry.preferredContactTime ? [{ label: t('adminInquiryDetail.fieldTime'), value: inquiry.preferredContactTime }] : []),
    ...(inquiry.message ? [{ label: t('adminInquiryDetail.fieldMessage'), value: inquiry.message }] : []),
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('admin-inquiries')}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('adminInquiryDetail.title')}</h1>
      </header>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminInquiryDetail.customerInfo')}</h2>
        {customerFields.map((f) => (
          <div key={f.label} className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-500">{f.label}</span>
            <span className="text-sm text-gray-900 text-right max-w-[60%]">{f.value}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminInquiryDetail.carOfInterest')}</h2>
        <div className="flex gap-3 items-center">
          <img src={inquiry.carThumbnailUrl} alt={inquiry.carName} className="w-16 h-12 object-cover rounded-lg" />
          <div>
            <p className="font-semibold text-gray-900">{inquiry.carName}</p>
            <p className="text-gray-600">{inquiry.carPrice}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2 p-4">
        <h2 className="text-base font-semibold text-gray-900">{t('adminInquiryDetail.status')}</h2>
        <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass(inquiry.status)}`} data-testid="current-status-badge">
          {t('status.' + inquiry.status)}
        </span>
        <p className="text-xs text-gray-400" data-testid="inquiry-date">{inquiry.date}</p>
      </section>

      <div className="flex gap-3 p-4">
        <button
          type="button"
          aria-label={t('adminInquiryDetail.markContactedAria')}
          data-testid="mark-contacted-action"
          className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
          onClick={() => handleUpdateStatus('contacted')}
        >
          {t('adminInquiryDetail.markContacted')}
        </button>
        <button
          type="button"
          aria-label={t('adminInquiryDetail.markClosedAria')}
          data-testid="mark-closed-action"
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          onClick={() => handleUpdateStatus('closed')}
        >
          {t('adminInquiryDetail.markClosed')}
        </button>
      </div>

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}
