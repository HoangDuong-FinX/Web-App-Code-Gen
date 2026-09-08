import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { submitInquiry } from '../fixtures/payment';

export default function InquiryConfirmScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId, inquiryData } = useApp();
  const { buyer } = useAuth();
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contactMethodLabels: Record<string, string> = {
    call: t('inquiry.call'),
    zalo: t('inquiry.zalo'),
    email: t('inquiry.email'),
  };

  async function handleSubmit(): Promise<void> {
    setError(false);
    setSubmitting(true);
    try {
      await submitInquiry();
      navigate('inquiry-success', { currentCarId, selectedCar });
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('inquiry-form', { currentCarId, selectedCar, inquiryData })} aria-label={t('inquiryConfirm.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('inquiryConfirm.title')}</h1>
      </header>

      {/* Car Info */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('inquiryConfirm.carInfo')}</h3>
        <p className="font-bold">{selectedCar?.name}</p>
        <p className="text-blue-600">{selectedCar?.formattedPrice}</p>
      </section>

      {/* Contact Info */}
      <section className="p-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{t('inquiryConfirm.contactInfo')}</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('inquiryConfirm.name')}</span><span className="text-sm font-medium">{buyer?.name}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('inquiryConfirm.phone')}</span><span className="text-sm font-medium">{buyer?.phone}</span></div>
          <div className="flex justify-between"><span className="text-sm text-gray-500">{t('inquiryConfirm.contactVia')}</span><span className="text-sm font-medium">{contactMethodLabels[inquiryData?.contactMethod ?? 'call']}</span></div>
          {inquiryData?.preferredTime && (
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t('inquiryConfirm.time')}</span><span className="text-sm font-medium">{inquiryData.preferredTime}</span></div>
          )}
          {inquiryData?.message && (
            <div className="flex flex-col gap-1"><span className="text-sm text-gray-500">{t('inquiryConfirm.message')}</span><span className="text-sm">{inquiryData.message}</span></div>
          )}
        </div>
      </section>

      <div className="p-4 flex flex-col gap-3">
        <button type="button" onClick={() => navigate('inquiry-form', { currentCarId, selectedCar, inquiryData })} aria-label={t('inquiryConfirm.editAria')} data-testid="edit-inquiry" className="text-sm text-blue-600 font-medium">
          {t('inquiryConfirm.edit')}
        </button>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" aria-live="polite" data-testid="inquiry-submit-error">{t('inquiryConfirm.submitError')}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          aria-label={t('inquiryConfirm.submitAria')}
          data-testid="inquiry-submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? '...' : t('inquiryConfirm.submit')}
        </button>
      </div>
    </div>
  );
}
