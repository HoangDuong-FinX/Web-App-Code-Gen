import { t } from '../i18n';
import type { ScreenId } from '../types';
import type { Car } from '../types';
import { getCarById } from '../fixtures/cars';

interface ContactOptionsModalProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
  onClose: () => void;
}

export default function ContactOptionsModal({ carId, onNavigate, onClose }: ContactOptionsModalProps) {
  const car: Car | undefined = carId ? getCarById(carId) : undefined;

  const handleCall = () => {
    if (car?.dealer.phone) {
      try {
        window.open(`tel:${car.dealer.phone}`, '_self');
      } catch {
        // tel: not supported - phone number is visible in car-detail dealer section
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('contact.title')}</h2>
          <button onClick={onClose} className="text-gray-400 text-xl" aria-label={t('contact.close')}>\u00D7</button>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => { onClose(); }}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50"
            aria-label={t('contact.chat')}
          >
            <span className="text-xl">\u{1F4AC}</span>
            <span className="font-medium text-gray-900">{t('contact.chat')}</span>
          </button>

          <button
            onClick={handleCall}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50"
            aria-label={t('contact.call')}
          >
            <span className="text-xl">\u{1F4DE}</span>
            <span className="font-medium text-gray-900">{t('contact.call')}</span>
          </button>

          <button
            onClick={() => { onClose(); onNavigate('send-inquiry'); }}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50"
            aria-label={t('contact.inquiry')}
          >
            <span className="text-xl">\u2709</span>
            <span className="font-medium text-gray-900">{t('contact.inquiry')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
