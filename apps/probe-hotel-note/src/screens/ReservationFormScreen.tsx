import React, { useState, useCallback } from 'react';
import { t } from '../i18n';

interface ReservationFormScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
  params: Record<string, unknown>;
}

export default function ReservationFormScreen({ onNavigate, params }: ReservationFormScreenProps): React.JSX.Element {
  const carId = params.carId as string;
  const carName = params.carName as string;
  const carPrice = params.carPrice as string;
  const carThumbnailUrl = params.carThumbnailUrl as string;

  const [fullName, setFullName] = useState((params.fullName as string) || '');
  const [phone, setPhone] = useState((params.phone as string) || '');
  const [email, setEmail] = useState((params.email as string) || '');
  const [visitDate, setVisitDate] = useState((params.visitDate as string) || '');
  const [visitTime, setVisitTime] = useState((params.visitTime as string) || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = t('validation.nameRequired');
    if (!phone.trim()) {
      errs.phone = t('validation.phoneRequired');
    } else if (!/^0\d{9}$/.test(phone.trim())) {
      errs.phone = t('validation.phoneInvalid');
    }
    if (!visitDate) errs.visitDate = t('validation.dateRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fullName, phone, visitDate]);

  const handleReview = useCallback(() => {
    if (!validate()) return;
    onNavigate('reservation-confirm', {
      carId, carName, carPrice, carThumbnailUrl,
      fullName: fullName.trim(), phone: phone.trim(), email: email.trim(),
      visitDate, visitTime,
    });
  }, [validate, onNavigate, carId, carName, carPrice, carThumbnailUrl, fullName, phone, email, visitDate, visitTime]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button type="button" aria-label={t('nav.back')} data-testid="back-action" className="p-2 text-lg text-gray-600 hover:bg-gray-100 rounded-full" onClick={() => onNavigate('car-detail', { carId })}>
          \u2190
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{t('reservation.title')}</h1>
      </header>

      <div className="flex gap-3 items-center p-4 border-b border-gray-200 bg-white">
        <img src={carThumbnailUrl} alt={carName} className="w-16 h-12 object-cover rounded-lg" />
        <div>
          <p className="font-semibold text-gray-900">{carName}</p>
          <p className="text-gray-600">{carPrice}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="res-fullname" className="text-sm font-medium text-gray-700">{t('reservation.fullName')} *</label>
          <input id="res-fullname" type="text" placeholder={t('reservation.fullNamePlaceholder')} aria-label={t('reservation.fullName')} data-testid="full-name-input" className={`px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="res-phone" className="text-sm font-medium text-gray-700">{t('reservation.phone')} *</label>
          <input id="res-phone" type="tel" placeholder={t('reservation.phonePlaceholder')} aria-label={t('reservation.phone')} data-testid="phone-input" className={`px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="res-email" className="text-sm font-medium text-gray-700">{t('reservation.email')}</label>
          <input id="res-email" type="email" placeholder={t('reservation.emailPlaceholder')} aria-label={t('reservation.email')} data-testid="email-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="res-date" className="text-sm font-medium text-gray-700">{t('reservation.visitDate')} *</label>
          <input id="res-date" type="date" aria-label={t('reservation.visitDate')} data-testid="preferred-visit-date-input" className={`px-4 py-3 rounded-lg border ${errors.visitDate ? 'border-red-500' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 outline-none`} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required />
          {errors.visitDate && <p className="text-sm text-red-500">{errors.visitDate}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="res-time" className="text-sm font-medium text-gray-700">{t('reservation.visitTime')}</label>
          <input id="res-time" type="time" aria-label={t('reservation.visitTime')} data-testid="preferred-visit-time-input" className="px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} />
        </div>

        <button
          type="button"
          aria-label={t('reservation.reviewAria')}
          data-testid="review-action"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          onClick={handleReview}
        >
          {t('reservation.review')}
        </button>
      </div>
    </div>
  );
}
