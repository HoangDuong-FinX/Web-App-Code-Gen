import React, { useState, useCallback } from 'react';
import { t } from '../i18n';
import { submitInquiryFixture } from '../fixtures/cars';

interface InquiryFormScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function InquiryFormScreen({ onNavigate, params }: InquiryFormScreenProps): React.JSX.Element {
  const carId = params.carId as string;
  const carName = params.carName as string;
  const carPrice = params.carPrice as string;
  const carThumbnailUrl = params.carThumbnailUrl as string;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = t('validation.nameRequired');
    if (!phone.trim()) {
      errs.phone = t('validation.phoneRequired');
    } else if (!/^0\d{9}$/.test(phone.trim())) {
      errs.phone = t('validation.phoneInvalid');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fullName, phone]);

  const handleSubmit = useCallback(() => {
    setSubmitError('');
    if (!validate()) return;
    setSubmitting(true);
    const result = submitInquiryFixture();
    setSubmitting(false);
    if (result.success) {
      onNavigate('inquiry-success', { carId, carName, carThumbnailUrl });
    } else {
      setSubmitError(t('common.errorRetry'));
    }
  }, [validate, onNavigate, carId, carName, carThumbnailUrl]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('car-detail', { carId })}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('inquiry.title')}</h1>
      </header>

      <div className="flex gap-3 items-center p-4 border-b border-gray-200 bg-white">
        <img src={carThumbnailUrl} alt={carName} className="w-16 h-12 object-cover rounded-lg" data-testid="car-thumbnail-small" />
        <div>
          <p className="font-semibold text-gray-900">{carName}</p>
          <p className="text-gray-600">{carPrice}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="inquiry-fullname" className="text-sm font-medium text-gray-700">{t('inquiry.fullName')} *</label>
          <input id="inquiry-fullname" type="text" placeholder={t('inquiry.fullNamePlaceholder')} aria-label={t('inquiry.fullName')} data-testid="full-name-input" className={`px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="inquiry-phone" className="text-sm font-medium text-gray-700">{t('inquiry.phone')} *</label>
          <input id="inquiry-phone" type="tel" placeholder={t('inquiry.phonePlaceholder')} aria-label={t('inquiry.phone')} data-testid="phone-input" className={`px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="inquiry-email" className="text-sm font-medium text-gray-700">{t('inquiry.emailHint')}</label>
          <input id="inquiry-email" type="email" placeholder={t('inquiry.emailPlaceholder')} aria-label={t('inquiry.emailHint')} data-testid="email-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="inquiry-time" className="text-sm font-medium text-gray-700">{t('inquiry.preferredTime')}</label>
          <input id="inquiry-time" type="text" placeholder={t('inquiry.preferredTimePlaceholder')} aria-label={t('inquiry.preferredTime')} data-testid="preferred-contact-time-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="inquiry-message" className="text-sm font-medium text-gray-700">{t('inquiry.message')}</label>
          <textarea id="inquiry-message" placeholder={t('inquiry.messagePlaceholder')} aria-label={t('inquiry.message')} data-testid="message-input" rows={4} className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>

        {submitError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200" data-testid="error-banner">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        <button
          type="button"
          aria-label={t('inquiry.submitAria')}
          data-testid="submit-action"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? t('common.loading') : t('inquiry.submit')}
        </button>
      </div>
    </div>
  );
}
