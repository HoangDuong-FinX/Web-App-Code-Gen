import { useState } from 'react';
import { t } from '../i18n';
import type { ScreenId } from '../types';
import { paymentMethods, getSubmitPaymentOutcome } from '../fixtures/orders';
import { getCarById } from '../fixtures/cars';
import { formatPrice } from '../utils';

interface PaymentMethodScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
  onPaymentSuccess: (orderNumber: string) => void;
  onPaymentFailed: (reason: string) => void;
}

export default function PaymentMethodScreen({
  carId,
  onNavigate,
  onPaymentSuccess,
  onPaymentFailed,
}: PaymentMethodScreenProps) {
  const car = carId ? getCarById(carId) : undefined;
  const depositAmount = Math.round((car?.price ?? 0) * 0.1);
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const outcome = getSubmitPaymentOutcome();
      if (outcome === 'success') {
        onPaymentSuccess('AM-' + Date.now().toString(36).toUpperCase());
      } else {
        onPaymentFailed('Giao d\u1ECBch b\u1ECB t\u1EEB ch\u1ED1i b\u1EDFi ng\u00E2n h\u00E0ng.');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={() => onNavigate('order-review')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('payment.title')}</h1>
      </header>

      {/* Total */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <p className="text-sm text-gray-500">{t('payment.total')}</p>
        <p className="text-2xl font-bold text-blue-600">{formatPrice(depositAmount)}</p>
      </div>

      {/* Payment methods */}
      <div className="px-4 py-4 space-y-3">
        {paymentMethods.filter((m) => m.enabled).map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethodId(method.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border ${
              selectedMethodId === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
            aria-label={method.label}
          >
            <img src={method.iconUrl} alt={method.label} className="w-10 h-10 rounded" />
            <span className="font-medium text-gray-900">{method.label}</span>
          </button>
        ))}
      </div>

      {/* Confirm */}
      <div className="px-4 mt-4 pb-6">
        <button
          onClick={handlePay}
          disabled={!selectedMethodId || isProcessing}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-50"
          aria-label={t('payment.confirmPay')}
          data-testid="confirm-pay"
        >
          {isProcessing ? t('payment.processing') : t('payment.confirmPay')}
        </button>
      </div>
    </div>
  );
}
