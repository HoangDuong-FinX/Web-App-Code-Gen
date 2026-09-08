import React, { useState } from 'react';
import { t } from '../i18n';
import { useApp } from '../context/AppContext';

export default function InquiryFormScreen(): React.JSX.Element {
  const { navigate, selectedCar, currentCarId } = useApp();
  const [contactMethod, setContactMethod] = useState<'call' | 'zalo' | 'email'>('call');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');

  function handleContinue(): void {
    navigate('inquiry-confirm', {
      currentCarId,
      selectedCar,
      inquiryData: { contactMethod, preferredTime, message },
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 p-4">
        <button type="button" onClick={() => navigate('car-detail', { currentCarId })} aria-label={t('inquiry.back')} data-testid="back-action" className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-bold">{t('inquiry.title')}</h1>
      </header>

      {/* Car summary */}
      {selectedCar && (
        <div className="flex gap-3 px-4 py-3 items-center">
          <img src={selectedCar.thumbnailUrl} alt={selectedCar.name} className="w-20 aspect-[4/3] object-cover rounded-lg" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">{selectedCar.name}</span>
            <span className="text-sm text-blue-600">{selectedCar.formattedPrice}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 p-4">
        {/* Contact method */}
        <fieldset>
          <legend className="text-sm font-medium mb-2">{t('inquiry.contactMethod')}</legend>
          {(['call', 'zalo', 'email'] as const).map(method => (
            <label key={method} className="flex items-center gap-3 py-2 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value={method}
                checked={contactMethod === method}
                onChange={() => setContactMethod(method)}
                aria-label={t(`inquiry.${method}`)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm">{t(`inquiry.${method}`)}</span>
            </label>
          ))}
        </fieldset>

        {/* Preferred time */}
        <div className="flex flex-col gap-1">
          <label htmlFor="preferred-time" className="text-sm font-medium">{t('inquiry.preferredTime')}</label>
          <input
            id="preferred-time"
            type="text"
            value={preferredTime}
            onChange={e => setPreferredTime(e.target.value)}
            placeholder={t('inquiry.preferredTimePlaceholder')}
            aria-label={t('inquiry.preferredTimeAria')}
            data-testid="preferred-time"
            className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1">
          <label htmlFor="inquiry-msg" className="text-sm font-medium">{t('inquiry.message')}</label>
          <textarea
            id="inquiry-msg"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t('inquiry.messagePlaceholder')}
            aria-label={t('inquiry.messageAria')}
            data-testid="inquiry-message"
            rows={4}
            className="w-full px-4 py-3 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleContinue}
          aria-label={t('inquiry.continueAria')}
          data-testid="inquiry-continue"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          {t('inquiry.continue')}
        </button>
      </div>
    </div>
  );
}
