import React from 'react';
import { useStore } from '../store';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import AlertNote from '../components/AlertNote';
import ResultIcon from '../components/ResultIcon';

function Done() {
  const store = useStore();
  const result = store.paymentResult || 'success';

  const handleReset = () => {
    store.reset();
    store.setCurrentScreen('search');
  };

  const handleRetry = () => {
    store.setCurrentScreen('checkout');
  };

  const isSuccess = result === 'success' || result === 'simulated';
  const isFailed = result === 'failed';
  const isPartial = result === 'partial';

  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <ResultIcon state={isSuccess ? 'success' : isFailed ? 'failed' : 'partial'} testId="result-status-icon" />

      <Text variant="title-1" semantic="h1" testId="result-title" className="mt-4">
        {isSuccess ? t('done.success') : isFailed ? t('done.failed') : t('done.partial')}
      </Text>

      {isSuccess && (
        <>
          <Text variant="title-2" testId="result-amount" className="mt-2">
            −10.500.000 VND
          </Text>
          <Text variant="body" testId="result-timestamp" className="mt-2">
            12:42, 20 tháng 8 2026
          </Text>
        </>
      )}

      {isSuccess && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2 text-left">
          <Text variant="body-semibold">Chi tiết giao dịch</Text>
          <div className="flex justify-between">
            <Text variant="body">Thanh toán cho</Text>
            <Text variant="body">Vikki Flights</Text>
          </div>
          <div className="flex justify-between">
            <Text variant="body">Mã đặt chỗ</Text>
            <Text variant="mono-label">{store.bookingCode || 'ABCD1234'}</Text>
          </div>
          {store.transactionId && (
            <div className="flex justify-between">
              <Text variant="body">Mã GD</Text>
              <Text variant="mono-label">{store.transactionId}</Text>
            </div>
          )}
          <div className="flex gap-1">
            <Text variant="body">💬</Text>
            <Text variant="body">Mua vé máy bay — Vikki Flights</Text>
          </div>
        </div>
      )}

      <Text variant="footnote" className="mt-4">
        Nếu bạn muốn xuất hoá đơn VAT vui lòng liên hệ Vikki Care. Nếu bạn cần hỗ trợ thay đổi thông tin chuyến bay, vui lòng liên hệ tổng đài 1900 1886.
      </Text>

      <AlertNote visible={result === 'simulated'} testId="simulated-payment-banner">
        {t('done.simulated')}
      </AlertNote>

      <div className="mt-4 space-y-2">
        {isSuccess && (
          <Button variant="secondary" testId="share-button" className="w-full">
            {t('done.share')}
          </Button>
        )}
        <Button variant="secondary" testId="book-another-button" className="w-full" onClick={handleReset}>
          {t('done.book-another')}
        </Button>
        <Button variant="secondary" testId="home-button" className="w-full" onClick={handleReset}>
          {t('done.home')}
        </Button>
        {isFailed && (
          <Button variant="primary" testId="retry-button" className="w-full" onClick={handleRetry}>
            {t('done.retry')}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Done;
