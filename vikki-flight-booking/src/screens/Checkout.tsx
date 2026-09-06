import React, { useState } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import { fixturePaymentInquiry, fixtureInitiatePayment } from '../fixtures';

interface CheckoutProps {
  airports: any[];
  cityPairs: any[];
  masterDataError: string | null;
  masterDataLoading: boolean;
}

const Checkout: React.FC<CheckoutProps> = () => {
  const { navigateTo, updateBooking } = useStore();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice] = useState(6000000);
  const [bookingCode, setBookingCode] = useState('ABCD1234');

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const inquiryResult = await fixturePaymentInquiry();
      const paymentResult = await fixtureInitiatePayment();

      updateBooking({
        paymentResult: 'success',
        transactionId: paymentResult.transactionId,
        bookingCode: inquiryResult.booking_key,
        viaHost: true,
      });
      navigateTo('done');
    } catch (err: any) {
      setError(err.message || t('checkout.error'));
      updateBooking({
        paymentResult: 'failed',
        paymentError: err.message,
        viaHost: false,
      });
      // Navigate to done with failure state
      navigateTo('done');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="font-semibold mb-4">{t('checkout.paymentDetails')}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('checkout.subtotal')}</span>
            <span>5.000.000 VND</span>
          </div>
          <div className="flex justify-between">
            <span>{t('checkout.serviceFee')}</span>
            <span>1.000.000 VND</span>
          </div>
          <div className="flex justify-between">
            <span>{t('checkout.discount')}</span>
            <span>0 VND</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>{t('checkout.total')}</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span className="text-sm">{t('checkout.vatInvoice')}</span>
        </label>
      </div>

      <div className="mb-6 p-3 bg-gray-100 rounded text-xs text-gray-600">
        {t('checkout.terms')}
      </div>

      <button
        onClick={handlePayNow}
        disabled={paying}
        className="w-full p-3 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
        aria-label={t('checkout.payNow')}
      >
        {paying ? 'Processing...' : t('checkout.payNow')}
      </button>
    </div>
  );
};

export default Checkout;
