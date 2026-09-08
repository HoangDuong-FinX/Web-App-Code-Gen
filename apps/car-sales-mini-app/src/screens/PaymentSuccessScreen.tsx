import { t } from '../i18n';
import type { ScreenId } from '../types';

interface PaymentSuccessScreenProps {
  orderNumber: string | null;
  onNavigate: (screen: ScreenId) => void;
  onViewOrder: (orderId: string) => void;
}

export default function PaymentSuccessScreen({ orderNumber, onNavigate, onViewOrder }: PaymentSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="text-6xl text-green-500 mb-4">\u2713</div>
      <h1 className="text-2xl font-bold text-gray-900">{t('payment.successTitle')}</h1>
      {orderNumber && (
        <p className="mt-3 text-gray-600">
          {t('payment.orderNumber')}: <span className="font-mono font-bold text-gray-900">{orderNumber}</span>
        </p>
      )}
      <div className="mt-8 w-full max-w-sm space-y-3">
        <button
          onClick={() => onViewOrder('order-001')}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          aria-label={t('payment.viewOrder')}
          data-testid="view-order"
        >
          {t('payment.viewOrder')}
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="w-full border border-gray-200 py-3 rounded-xl font-medium text-gray-700"
          aria-label={t('payment.goHome')}
        >
          {t('payment.goHome')}
        </button>
      </div>
    </div>
  );
}
