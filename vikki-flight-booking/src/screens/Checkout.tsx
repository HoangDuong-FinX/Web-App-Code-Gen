import React, { useState, useEffect } from 'react';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Checkbox } from '../components/Checkbox';
import { StatusNote } from '../components/StatusNote';
import { Layout } from '../components/Layout';
import { useStore } from '../store/store';

interface CheckoutProps {
  navigate: (screen: string) => void;
  t: Record<string, string>;
}

export const Checkout: React.FC<CheckoutProps> = ({ navigate, t }) => {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [vatInvoice, setVatInvoice] = useState(false);
  const [bookingKeysReady, setBookingKeysReady] = useState(false);

  // Fetch booking payloads on mount
  useEffect(() => {
    const fetchPayloads = async () => {
      try {
        // Simulate API call
        store.setOutboundBookingKey('VJ12345678', 500000);
        if (store.tripType === 'roundTrip') {
          store.setReturnBookingKey('VJ87654321', 420000);
        }
        setBookingKeysReady(true);
      } catch (err) {
        setPayloadError(t['checkout.payloadError']);
      }
    };
    fetchPayloads();
  }, []);

  const subtotal = 500000;
  const serviceFees = 50000;
  const promoDiscount = 0;
  const total = subtotal + serviceFees - promoDiscount;

  const handlePay = async () => {
    if (!bookingKeysReady) {
      setError(t['checkout.noBookingKey']);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate payment
      store.setOutboundTransactionId('TXN20240907001');
      if (store.tripType === 'roundTrip') {
        store.setReturnTransactionId('TXN20240907002');
        store.setPaymentOutcome('success');
      } else {
        store.setPaymentOutcome('success');
      }
      navigate('done');
    } catch (err) {
      setError(t['checkout.payloadError']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Layout layoutType="stack" gap={16}>
        <Text variant="title-2" testId="checkout-title">
          {t['checkout.title']}
        </Text>

        <Text variant="subheadline" testId="checkout-subtitle">
          {t['checkout.subtitle']}
        </Text>

        <StatusNote
          tone="warning"
          visible={store.holdExpired}
          testId="hold-expired-alert"
        >
          {t['checkout.holdExpired']}
        </StatusNote>

        {/* Payment breakdown */}
        <Layout layoutType="stack" gap={12}>
          <Text variant="body" testId="payment-source">
            {t['checkout.from']}
          </Text>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['checkout.amount']}</Text>
            <Text variant="body-semibold" testId="amount-due">
              {total.toLocaleString()} VND
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['checkout.payingTo']}</Text>
            <Text variant="body-semibold">Vikki Flights</Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['checkout.content']}</Text>
            <Text variant="body-semibold">{t['checkout.flightTicket']}</Text>
          </Layout>
        </Layout>

        {/* Promo code (disabled) */}
        <Layout layoutType="stack" gap={12}>
          <Text variant="headline">{t['checkout.promoCode']}</Text>
          <Layout layoutType="stack" direction="row" gap={10}>
            <Input
              type="text"
              placeholder={t['checkout.promoPlaceholder']}
              disabled
              testId="promo-code-input"
            />
            <Button
              variant="primary"
              size="medium"
              disabled
              testId="promo-apply-button"
            >
              {t['checkout.apply']}
            </Button>
          </Layout>
        </Layout>

        {/* VAT invoice */}
        <Checkbox
          label={t['checkout.vatInvoice']}
          checked={vatInvoice}
          onChange={setVatInvoice}
          testId="vat-invoice-checkbox"
        />

        {/* Payment method */}
        <Layout layoutType="stack" gap={12}>
          <Text variant="body" testId="payment-method-label">
            {t['checkout.paymentMethod']}
          </Text>
          <Text variant="footnote" testId="payment-method-placeholder">
            [Placeholder: Payment method rail to be decided by Payment Hub]
          </Text>
        </Layout>

        {/* Breakdown */}
        <Layout layoutType="stack" gap={12}>
          <Text variant="headline">{t['checkout.breakdown']}</Text>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['checkout.subtotal']}</Text>
            <Text variant="body" testId="subtotal">
              {subtotal.toLocaleString()} VND
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['checkout.serviceFees']}</Text>
            <Text variant="body" testId="service-fees">
              {serviceFees.toLocaleString()} VND
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between">
            <Text variant="body">{t['checkout.discount']}</Text>
            <Text variant="body" testId="promo-discount">
              {promoDiscount === 0 ? '0 VND' : `-${promoDiscount.toLocaleString()} VND`}
            </Text>
          </Layout>
          <Layout layoutType="stack" direction="row" gap={12} justifyContent="space-between" className="border-t border-gray-100 pt-3">
            <Text variant="title-1">{t['checkout.total']}</Text>
            <Text variant="title-1" testId="grand-total">
              {total.toLocaleString()} VND
            </Text>
          </Layout>
        </Layout>

        {/* Terms */}
        <Text variant="footnote" testId="fine-print-terms">
          {t['checkout.terms']}
        </Text>

        {/* Error messages */}
        <StatusNote
          tone="error"
          visible={!!payloadError}
          testId="payload-error-alert"
        >
          {payloadError}
        </StatusNote>

        <StatusNote
          tone="error"
          visible={!!error}
          testId="error-alert"
        >
          {error}
        </StatusNote>

        {/* Pay button */}
        <Button
          variant="primary"
          size="large"
          onClick={handlePay}
          disabled={!bookingKeysReady || store.holdExpired || loading}
          testId="pay-button"
        >
          {loading ? 'Xử lý...' : t['checkout.pay']}
        </Button>
      </Layout>
    </div>
  );
};