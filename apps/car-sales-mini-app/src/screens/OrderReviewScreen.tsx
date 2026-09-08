import { t } from '../i18n';
import type { ScreenId } from '../types';
import { getCarById } from '../fixtures/cars';
import { formatPrice } from '../utils';

interface OrderReviewScreenProps {
  carId: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export default function OrderReviewScreen({ carId, onNavigate }: OrderReviewScreenProps) {
  const car = carId ? getCarById(carId) : undefined;
  const carPrice = car?.price ?? 0;
  const depositAmount = Math.round(carPrice * 0.1);
  const remainingBalance = carPrice - depositAmount;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-2 sticky top-0 z-10">
        <button onClick={() => onNavigate('car-detail')} className="text-gray-600 p-1" aria-label={t('nav.back')}>\u2190</button>
        <h1 className="text-lg font-semibold">{t('orderReview.title')}</h1>
      </header>

      {/* Car Details */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderReview.carDetails')}</h2>
        {car && (
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <img src={car.thumbnail} alt={car.name} className="w-20 h-14 rounded object-cover" />
            <div>
              <p className="font-medium text-gray-900">{car.name}</p>
              <p className="text-xs text-gray-500">{car.year} | {car.fuelType} | {car.transmission}</p>
            </div>
          </div>
        )}
      </section>

      {/* Pricing BR-07 */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderReview.pricing')}</h2>
        <div className="bg-white rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('orderReview.fullPrice')}</span>
            <span className="font-bold text-gray-900">{formatPrice(carPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">{t('orderReview.deposit')}</span>
            <span className="font-bold text-blue-600">{formatPrice(depositAmount)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between">
            <span className="text-sm text-gray-600">{t('orderReview.remaining')}</span>
            <span className="font-medium text-gray-900">{formatPrice(remainingBalance)}</span>
          </div>
        </div>
      </section>

      {/* Dealer Info */}
      <section className="px-4 mt-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">{t('orderReview.dealerInfo')}</h2>
        <div className="bg-white rounded-xl p-4 space-y-2">
          <p className="text-sm"><span className="text-gray-500">{t('carDetail.dealer')}:</span> <span className="font-medium">{car?.dealer.name}</span></p>
          <p className="text-sm"><span className="text-gray-500">{t('orderReview.estimatedDelivery')}:</span> <span className="font-medium">2-4 {t('common.year').charAt(0) === 'n' ? 'tu\u1EA7n' : 'weeks'}</span></p>
        </div>
      </section>

      {/* CTA */}
      <div className="px-4 mt-6 pb-6">
        <button
          onClick={() => onNavigate('payment-method')}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold text-base"
          aria-label={t('orderReview.proceedPayment')}
          data-testid="proceed-payment"
        >
          {t('orderReview.proceedPayment')}
        </button>
      </div>
    </div>
  );
}
