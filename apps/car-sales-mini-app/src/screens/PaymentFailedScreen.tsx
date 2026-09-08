import { t } from '../i18n';
import type { ScreenId } from '../types';

interface PaymentFailedScreenProps {
  failureReason: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export default function PaymentFailedScreen({ failureReason, onNavigate }: PaymentFailedScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-6xl text-red-500 mb-4">\u2717</div>
      <h1 className="text-2xl font-bold text-gray-900">{t('payment.failedTitle')}</h1>
      {failureReason && (
        <p className="mt-2 text-gray-600 text-center">{failureReason}</p>
      )}
      <div className="mt-8 w-full max-w-sm space-y-3">
        <button
          onClick={() => onNavigate('payment-method')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          aria-label={t('payment.retry')}
        >
          {t('payment.retry')}
        </button>
        <button
          onClick={() => onNavigate('payment-method')}
          className="w-full border border-gray-200 py-3 rounded-xl font-medium text-gray-700"
          aria-label={t('payment.chooseAnother')}
        >
          {t('payment.chooseAnother')}
        </button>
      </div>
    </div>
  );
}
