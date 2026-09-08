import React, { useState } from 'react';
import type { Traveller } from '../types';
import { t } from '../i18n/vi';

interface TravellerDetailSheetProps {
  index: number;
  traveller: Traveller;
  travellerType: string;
  onConfirm: (data: Traveller) => void;
  onClose: () => void;
}

export function TravellerDetailSheet({ index, traveller, travellerType, onConfirm, onClose }: TravellerDetailSheetProps) {
  const [form, setForm] = useState<Traveller>({ ...traveller });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.last_name.trim()) errs.last_name = t('passengers.required');
    if (!form.first_middle_name.trim()) errs.first_middle_name = t('passengers.required');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('passengers.invalidEmail');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) {
      onConfirm(form);
    }
  };

  const handleChange = (field: keyof Traveller, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" aria-label={t('traveller.title')}>
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900" data-testid="modal-title">
            {`${t('traveller.title')} ${index + 1} - ${travellerType}`}
          </h2>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label={t('common.close')}
            data-testid="close-action"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-sm text-gray-600">{t('traveller.lastName')}</label>
              <input
                type="text"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.last_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                value={form.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                aria-label={t('traveller.lastNameLabel')}
                data-testid="last-name-input"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-500" aria-live="assertive" data-testid="field-validation-error">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">{t('traveller.firstMiddleName')}</label>
              <input
                type="text"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.first_middle_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                value={form.first_middle_name}
                onChange={(e) => handleChange('first_middle_name', e.target.value)}
                aria-label={t('traveller.firstMiddleNameLabel')}
                data-testid="middle-first-name-input"
              />
              {errors.first_middle_name && (
                <p className="mt-1 text-xs text-red-500" aria-live="assertive" data-testid="field-validation-error">{errors.first_middle_name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">{t('traveller.genderLabel')}</label>
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    form.gender === 'Male' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                  onClick={() => handleChange('gender', 'Male')}
                  aria-label={t('traveller.male')}
                  data-testid="gender-selector"
                >
                  {t('traveller.male')}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                    form.gender === 'Female' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                  onClick={() => handleChange('gender', 'Female')}
                  aria-label={t('traveller.female')}
                >
                  {t('traveller.female')}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">{t('traveller.dob')}</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder={t('traveller.dobPlaceholder')}
                value={form.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                aria-label={t('traveller.dobLabel')}
                data-testid="dob-input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">{t('traveller.phone')}</label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                aria-label={t('traveller.phoneLabel')}
                data-testid="phone-input"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-600">{t('traveller.email')}</label>
              <input
                type="email"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
                }`}
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                aria-label={t('traveller.emailLabel')}
                data-testid="email-input"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500" aria-live="assertive" data-testid="field-validation-error">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            className="w-full rounded-lg bg-red-500 py-3 text-center font-medium text-white hover:bg-red-600"
            onClick={handleConfirm}
            aria-label={t('traveller.confirmLabel')}
            data-testid="confirm-action"
          >
            {t('traveller.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}