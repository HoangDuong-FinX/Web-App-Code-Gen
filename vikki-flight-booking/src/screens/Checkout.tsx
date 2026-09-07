import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { fetchPaymentInquiry, initiatePayment } from '../fixtures';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import TextField from '../components/TextField';
import Checkbox from '../components/Checkbox';
import Divider from '../components/Divider';
import AlertNote from '../components/AlertNote';
import PriceHoldCountdown from '../components/PriceHoldCountdown';
import PaymentMethodRail from '../components/PaymentMethodRail';

function Checkout() {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInquiry, setPaymentInquiry] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchPaymentInquiry(store.outboundSession?.session_id);
        setPaymentInquiry(result);
      } catch (err) {
        setError('load');
      }
    };
    load();
  }, [store.outboundSession?.session_id]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const result = await initiatePayment({
        transactionType: 'booking',
        provider: 'VJA',
        sessionId: store.outboundSession?.session_id,
        offerId: store.outboundOffer?.offer_id,
      });
      store.setBookingCode('ABCD1234');
      if (result.simulated) {
        store.setPaymentResult('simulated');
      } else {
        store.setTransactionId(result.transactionId);
        store.setPaymentResult('success');
      }
      store.setCurrentScreen('done');
    } catch (err) {
      store.setPaymentResult('failed');
      store.setCurrentScreen('done');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Text variant="title-1" semantic="h1">
        {t('checkout.title')}
      </Text>
      <PriceHoldCountdown expiresAt={store.outboundSession?.expires_at} testId="price-hold-countdown" />

      <div className="mt-4 space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <Text variant="body-semibold">Chi tiết thanh toán</Text>
          <div className="flex justify-between">
            <Text variant="body">Tạm tính</Text>
            <Text variant="body">5.000.000 VND</Text>
          </div>
          <div className="flex justify-between">
            <Text variant="body">Phí dịch vụ</Text>
            <Text variant="body">1.000.000 VND</Text>
          </div>
          <div className="flex justify-between">
            <Text variant="body">Mã giảm giá</Text>
            <Text variant="body">0 VND</Text>
          </div>
          <Divider />
          <div className="flex justify-between">
            <Text variant="body-semibold">Tổng thanh toán</Text>
            <Text variant="headline">6.000.000 VND</Text>
          </div>
        </div>

        <div className="space-y-2">
          <Text variant="body">Mã giảm giá</Text>
          <TextField placeholder="Nhập mã giảm giá" disabled testId="promo-code-input" />
          <Button variant="secondary" disabled testId="promo-code-apply-button">
            Áp dụng
          </Button>
        </div>

        <Checkbox label={t('checkout.vat')} testId="vat-invoice-checkbox" />

        <div className="space-y-2">
          <Text variant="body-semibold">{t('checkout.payment-method')}</Text>
          <PaymentMethodRail testId="payment-method-rail" />
        </div>

        <Text variant="footnote">{t('checkout.terms')}</Text>

        <Button
          variant="primary"
          onClick={handlePay}
          disabled={loading || !paymentInquiry}
          testId="pay-now-button"
          className="w-full"
        >
          {t('checkout.button')}
        </Button>

        <AlertNote visible={error === 'load'} testId="payment-error">
          {t('checkout.error')}
        </AlertNote>
      </div>
    </div>
  );
}

export default Checkout;
