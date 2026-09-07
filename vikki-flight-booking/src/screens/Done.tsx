import React from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { StatusNote } from '../components/StatusNote';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';

interface DoneProps {
  navigate: (screen: string) => void;
  handleResetAndNavigate: (screen: string) => void;
  t: Record<string, string>;
}

export const Done: React.FC<DoneProps> = ({ navigate, handleResetAndNavigate, t }) => {
  const store = useStore();

  const isSuccess = store.paymentOutcome === 'success';
  const isFailure = store.paymentOutcome === 'failure';
  const isPartial = store.paymentOutcome === 'partial';
  const isSimulated = store.paymentOutcome === 'simulated';

  const badge = isSuccess ? '✓' : isFailure ? '✗' : isPartial ? '⚠' : '!';
  const badgeColor = isSuccess ? 'text-green-600' : isFailure ? 'text-red-600' : isPartial ? 'text-yellow-600' : 'text-blue-600';
  const title = isSuccess
    ? t['done.success']
    : isFailure
      ? t['done.failure']
      : isPartial
        ? t['done.partial']
        : t['done.simulated'];

  const amount = 500000;
  const amountDisplay = isSuccess ? `-${amount.toLocaleString()} VND` : `${amount.toLocaleString()} VND`;
  const timestamp = new Date().toLocaleString('vi-VN');

  const bookingCode = 'VJ12345678';
  const transactionId = store.outboundTransactionId || null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={16} alignItems="center">
        <Text variant="large-title" className={`text-5xl ${badgeColor}`} testId="result-badge">
          {badge}
        </Text>

        <Text variant="title-1" testId="result-title">
          {title}
        </Text>

        {(isSuccess || isFailure) && (
          <Text variant="title-1" testId="result-amount">
            {amountDisplay}
          </Text>
        )}

        {isSuccess && (
          <Text variant="body" testId="result-timestamp">
            {timestamp}
          </Text>
        )}

        {isSimulated && (
          <StatusNote tone="warning" testId="simulated-payment-warning">
            {t['done.simulated']}
          </StatusNote>
        )}

        {/* Details section */}
        <Layout layoutType="stack" gap={8} className="w-full">
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['done.payingTo']}</Text>
            <Text variant="body-semibold">Vikki Flights</Text>
          </Layout>

          {(isSuccess || isPartial) && bookingCode && (
            <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
              <Text variant="body">{t['done.bookingCode']}</Text>
              <Text variant="body-semibold" testId="booking-code">
                {bookingCode}
              </Text>
            </Layout>
          )}

          {isSuccess && transactionId && (
            <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
              <Text variant="body">{t['done.transactionId']}</Text>
              <Text variant="body-semibold" testId="transaction-id">
                {transactionId}
              </Text>
            </Layout>
          )}

          <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
            <Text variant="body">✓</Text>
            <Text variant="body">Mua vé máy bay — Vikki Flights</Text>
          </Layout>
        </Layout>

        {/* VAT note */}
        {(isSuccess || isPartial) && (
          <StatusNote tone="info" testId="vat-note">
            {t['done.vatNote']}
          </StatusNote>
        )}

        {/* Failure reason */}
        {isFailure && (
          <StatusNote tone="error" testId="failure-reason">
            Thanh toán không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ.
          </StatusNote>
        )}

        {/* Action buttons */}
        {isSuccess && (
          <Button
            variant="secondary"
            size="medium"
            onClick={() => console.log('Share booking')}
            testId="share-button"
          >
            {t['done.share']}
          </Button>
        )}

        {isFailure && (
          <Button
            variant="secondary"
            size="medium"
            onClick={() => navigate('checkout')}
            testId="retry-button"
          >
            {t['done.retry']}
          </Button>
        )}

        <Button
          variant="secondary"
          size="medium"
          onClick={() => handleResetAndNavigate('search')}
          testId="book-another-button"
        >
          {t['done.bookAnother']}
        </Button>

        <Button
          variant="secondary"
          size="medium"
          onClick={() => handleResetAndNavigate('search')}
          testId="go-home-button"
        >
          {t['done.goHome']}
        </Button>
      </Layout>
    </div>
  );
};
