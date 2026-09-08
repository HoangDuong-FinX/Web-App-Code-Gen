import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getCarById } from '../fixtures/cars';
import { getSendInquiryOutcome } from '../fixtures/auth';

interface SendInquiryScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export default function SendInquiryScreen({ carId, onNavigate }: SendInquiryScreenProps) {
  const car = carId ? getCarById(carId) : undefined;
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    setError('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const outcome = getSendInquiryOutcome();
      if (outcome === 'success') {
        onNavigate('inquiry-sent');
      } else {
        setError(t('common.error'));
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <button onClick={() => onNavigate('car-detail')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('inquiry.title')}</h1>
      </header>

      <div className="px-4 py-4 space-y-4">
        {car && (
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <img src={car.thumbnail} alt={car.name} className="w-16 h-10 rounded object-cover" />
            <div>
              <p className="font-medium text-sm">{car.name}</p>
              <p className="text-xs text-gray-500">{car.dealer.name}</p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="inquiry-msg" className="text-sm font-medium text-gray-700 block mb-1">{t('inquiry.message')}</label>
          <textarea
            id="inquiry-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('inquiry.messagePlaceholder')}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none"
            aria-label={t('inquiry.message')}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSend}
          disabled={!message.trim() || isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
          aria-label={t('inquiry.send')}
          data-testid="send-inquiry"
        >
          {isSubmitting ? t('common.loading') : t('inquiry.send')}
        </button>
      </div>
    </div>
  );
}
