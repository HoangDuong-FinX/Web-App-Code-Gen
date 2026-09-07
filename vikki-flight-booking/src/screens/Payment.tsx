import React from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';

interface PaymentProps {
  navigate: (screen: string) => void;
  t: Record<string, string>;
}

export const Payment: React.FC<PaymentProps> = ({ navigate, t }) => {
  const store = useStore();

  // Mock data for review
  const outboundFare = 450000;
  const returnFare = store.tripType === 'roundTrip' ? 420000 : 0;
  const subtotal = (outboundFare + returnFare) * (store.adultCount + store.childCount);
  const serviceFees = 50000;
  const total = subtotal + serviceFees;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={16}>
        <Text variant="title-2" testId="payment-step-header">
          {t['payment.title']}
        </Text>

        <Layout layoutType="stack" direction="row" gap={8} alignItems="center" justifyContent="center">
          <Text variant="headline" testId="journey-origin">
            {store.origin}
          </Text>
          <Text variant="headline">⇄</Text>
          <Text variant="headline" testId="journey-destination">
            {store.destination}
          </Text>
        </Layout>

        {/* Outbound leg */}
        <Layout layoutType="stack" gap={12}>
          <Text variant="headline" testId="leg-title">
            {t['payment.outbound']}
          </Text>
          <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
            <Text variant="body-semibold" testId="leg-departure-time">
              08:00
            </Text>
            <Text variant="body" testId="leg-origin-code">
              {store.origin}
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
            <Text variant="body" testId="leg-duration">
              2h
            </Text>
            <Text variant="body-semibold" testId="leg-flight-code">
              VJ101
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
            <Text variant="body-semibold" testId="leg-arrival-time">
              10:00
            </Text>
            <Text variant="body" testId="leg-destination-code">
              {store.destination}
            </Text>
          </Layout>

          <Text variant="headline" testId="fare-section-header">
            GIÁ VÉ
          </Text>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body" testId="fare-line-label">
              {store.adultCount} Người lớn
            </Text>
            <Text variant="body-semibold" testId="fare-line-amount">
              {(outboundFare * store.adultCount).toLocaleString()} VND
            </Text>
          </Layout>
        </Layout>

        {/* Return leg */}
        {store.tripType === 'roundTrip' && (
          <Layout layoutType="stack" gap={12}>
            <Text variant="headline" testId="leg-title">
              {t['payment.return']}
            </Text>
            <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
              <Text variant="body-semibold" testId="leg-departure-time">
                14:00
              </Text>
              <Text variant="body" testId="leg-origin-code">
                {store.destination}
              </Text>
            </Layout>
            <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
              <Text variant="body" testId="leg-duration">
                2h
              </Text>
              <Text variant="body-semibold" testId="leg-flight-code">
                VJ102
              </Text>
            </Layout>
            <Layout layoutType="stack" direction="row" gap={12} alignItems="center">
              <Text variant="body-semibold" testId="leg-arrival-time">
                16:00
              </Text>
              <Text variant="body" testId="leg-destination-code">
                {store.origin}
              </Text>
            </Layout>

            <Text variant="headline" testId="fare-section-header">
              GIÁ VÉ
            </Text>
            <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
              <Text variant="body" testId="fare-line-label">
                {store.adultCount} Người lớn
              </Text>
              <Text variant="body-semibold" testId="fare-line-amount">
                {(returnFare * store.adultCount).toLocaleString()} VND
              </Text>
            </Layout>
          </Layout>
        )}

        {/* Summary */}
        <Layout layoutType="stack" gap={12}>
          <Text variant="headline" testId="taxes-section-header">
            TÓM TắT
          </Text>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body" testId="tax-line-label">
              Tạm tính
            </Text>
            <Text variant="body-semibold" testId="tax-line-amount">
              {subtotal.toLocaleString()} VND
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body" testId="tax-line-label">
              Phí dịch vụ
            </Text>
            <Text variant="body-semibold" testId="tax-line-amount">
              {serviceFees.toLocaleString()} VND
            </Text>
          </Layout>
        </Layout>

        <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between" className="border-t border-gray-100 pt-4">
          <Text variant="title-1" testId="total-label">
            Tổng cộng:
          </Text>
          <Text variant="title-1" testId="grand-total-amount">
            {total.toLocaleString()} VND
          </Text>
        </Layout>

        <Button
          variant="primary"
          size="large"
          onClick={() => navigate('checkout')}
          testId="payment-continue-button"
        >
          {t['payment.continue']}
        </Button>
      </Layout>
    </div>
  );
};
