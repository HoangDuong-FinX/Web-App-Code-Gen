import React, { useEffect } from 'react';
import { useStore } from '../store';
import { t } from '../i18n';

interface DoneProps {
  airports: any[];
  cityPairs: any[];
  masterDataError: string | null;
  masterDataLoading: boolean;
}

const Done: React.FC<DoneProps> = () => {
  const { navigateTo, resetBooking, booking } = useStore();

  const isSuccess = booking.paymentResult === 'success';
  const isFailed = booking.paymentResult === 'failed';
  const isPartial = booking.paymentResult === 'partial';
  const isSimulated = booking.paymentResult === 'simulated';

  const handleBookAnother = () => {
    resetBooking();
    navigateTo('search');
  };

  const handleHome = () => {
    resetBooking();
    navigateTo('search');
  };

  const handleRetry = () => {
    navigateTo('checkout');
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      {isSuccess && (
        <>
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">{t('done.success')}</h1>
          <div className="text-xl font-semibold mb-2 text-green-600">
            {t('done.amount', { amount: '6.000.000' })}
          </div>
          <div className="text-sm text-gray-600 mb-6">12:42, 20 tháng 8 2026</div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
            <h2 className="font-semibold mb-3">Chi tiết giao dịch</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Thanh toán cho</span>
                <span>Vikki Flights</span>
              </div>
              <div className="flex justify-between">
                <span>Mã đặt chỗ</span>
                <span className="font-mono">{booking.bookingCode || 'ABCD1234'}</span>
              </div>
              <div className="flex justify-between">
                <span>Mã GD</span>
                <span className="font-mono">{booking.transactionId || 'TXN123456'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 text-xs text-gray-600">{t('done.vatInfo')}</div>

          {isSimulated && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded text-sm" role="alert">
              {t('done.simulatedBanner')}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleBookAnother}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded font-medium"
            >
              {t('done.bookAnother')}
            </button>
            <button
              onClick={handleHome}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded font-medium"
            >
              {t('done.home')}
            </button>
          </div>
        </>
      )}

      {isFailed && (
        <>
          <div className="text-6xl mb-4 text-red-600">✕</div>
          <h1 className="text-2xl font-bold mb-2 text-red-600">{t('done.failed')}</h1>
          <div className="text-xl font-semibold mb-4 text-red-600">
            {t('done.amount', { amount: '6.000.000' })}
          </div>
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-sm text-red-700">{booking.paymentError || 'Payment was rejected'}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleRetry}
              className="w-full p-3 bg-blue-600 text-white rounded font-medium"
            >
              {t('done.retry')}
            </button>
            <button
              onClick={handleHome}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded font-medium"
            >
              {t('done.home')}
            </button>
          </div>
        </>
      )}

      {isPartial && (
        <>
          <div className="text-6xl mb-4 text-yellow-600">⚠</div>
          <h1 className="text-2xl font-bold mb-2 text-yellow-600">{t('done.partial')}</h1>
          <div className="text-xl font-semibold mb-4">
            {t('done.amount', { amount: '6.000.000' })}
          </div>
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg text-left">
            <p className="text-sm text-yellow-700">Outbound flight was paid, return flight failed</p>
          </div>
          <button
            onClick={handleHome}
            className="w-full p-3 bg-gray-200 text-gray-800 rounded font-medium"
          >
            {t('done.home')}
          </button>
        </>
      )}
    </div>
  );
};

export default Done;
