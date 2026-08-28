import React, { useState, useEffect } from 'react';
import { ScreenId } from '../App';
import { useStore } from '../store/useStore';
import { t } from '../i18n';
import { useTimer } from '../hooks/useTimer';
import { fetchPaymentInquiryPayload } from '../sdk/http';
import { startPayment, PaymentCancelledError, PaymentFailedError } from '../sdk/payment';
import { formatCurrency } from '../utils/format';

interface Props {
  navigate: (screen: ScreenId) => void;
}

export const Checkout: React.FC<Props> = ({ navigate }) => {
  const store = useStore();
  const { isExpired, formattedTime } = useTimer(store.expiresAt);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [vatInvoice, setVatInvoice] = useState(false);
  const [bookingKeyLoaded, setBookingKeyLoaded] = useState(false);

  const outboundOffer = store.offers.find((o) => o.offerId === store.selectedOfferId);
  const returnOffer = store.tripType === 'round-trip'
    ? store.returnOffers.find((o) => o.offerId === store.selectedReturnOfferId)
    : null;

  const paxCount = store.adults + store.children;
  const fareSubtotal = ((outboundOffer?.farePrice ?? 0) + (returnOffer?.farePrice ?? 0)) * paxCount;
  const servicesTotal = store.ancillarySelections.reduce((sum, s) => sum + s.price * s.quantity, 0)
    + store.returnAncillarySelections.reduce((sum, s) => sum + s.price * s.quantity, 0)
    + store.seatSelections.reduce((sum, s) => sum + s.price, 0)
    + store.returnSeatSelections.reduce((sum, s) => sum + s.price, 0);
  const totalAmount = fareSubtotal + servicesTotal;

  const fetchPayload = async () => {
    setPayloadError(null);
    try {
      const result = await fetchPaymentInquiryPayload(store.sessionId!);
      store.update({ bookingKey: result.bookingKey });
      if (store.tripType === 'round-trip' && store.returnSessionId) {
        const returnResult = await fetchPaymentInquiryPayload(store.returnSessionId);
        store.update({ returnBookingKey: returnResult.bookingKey });
      }
      setBookingKeyLoaded(true);
    } catch {
      setPayloadError(t('checkout.error.payload'));
    }
  };

  useEffect(() => {
    fetchPayload();
  }, []);

  const canPay = bookingKeyLoaded && !isExpired && !payLoading && !payloadError;

  const handlePay = async () => {
    if (!canPay) return;
    setPayLoading(true);
    try {
      const outboundResult = await startPayment(store.sessionId!, store.selectedOfferId!);
      store.update({
        viaHost: outboundResult.viaHost,
        outboundBookingCode: outboundResult.bookingCode,
        transactionId: outboundResult.transactionId,
      });

      if (store.tripType === 'round-trip' && store.returnSessionId && store.selectedReturnOfferId) {
        try {
          const returnResult = await startPayment(store.returnSessionId, store.selectedReturnOfferId);
          store.update({
            returnBookingCode: returnResult.bookingCode,
            returnTransactionId: returnResult.transactionId,
          });
          navigate('done-success');
        } catch (e) {
          if (e instanceof PaymentCancelledError) {
            navigate('done-partial');
          } else {
            navigate('done-partial');
          }
        }
      } else {
        navigate('done-success');
      }
    } catch (e) {
      if (e instanceof PaymentCancelledError) {
        setPayLoading(false);
        return;
      }
      if (e instanceof PaymentFailedError) {
        store.update({ paymentError: e.message });
        navigate('done-failure');
      } else {
        store.update({ paymentError: t('common.error.generic') });
        navigate('done-failure');
      }
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button type="button" onClick={() => navigate('review')} aria-label={t('common.back.ariaLabel')} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 20 }}>
          ←
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>{t('checkout.title')}</h1>
      </div>

      {/* Payment details card */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12 }}>{t('checkout.details.heading')}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13 }}>{t('checkout.fare')}</span>
          <span style={{ fontSize: 13 }}>{formatCurrency(fareSubtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13 }}>{t('checkout.services')}</span>
          <span style={{ fontSize: 13 }}>{formatCurrency(servicesTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#666' }}>{t('checkout.discount')}</span>
          <span style={{ fontSize: 13, color: '#666' }}>{t('checkout.discountValue')}</span>
        </div>
        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 'bold' }}>{t('checkout.total')}</span>
          <span style={{ fontSize: 15, fontWeight: 'bold', color: '#E31837' }}>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Merchant info */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 'bold', display: 'block' }}>{t('checkout.merchant')}</span>
        <span style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 8 }}>{t('checkout.merchantDesc')}</span>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13 }}>{t('checkout.paymentSource')}</span>
          <span style={{ fontSize: 13, color: '#666' }}>{t('checkout.paymentSourceValue')}</span>
        </div>
      </div>

      {/* Fine print */}
      <p style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>{t('checkout.finePrint')}</p>

      {/* VAT checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, cursor: 'pointer', fontSize: 14 }}>
        <input
          type="checkbox"
          checked={vatInvoice}
          onChange={(e) => setVatInvoice(e.target.checked)}
          aria-label={t('checkout.vatInvoice.ariaLabel')}
        />
        {t('checkout.vatInvoice')}
      </label>

      {/* Errors */}
      {payloadError && (
        <div role="alert" style={{ padding: 12, backgroundColor: '#ffebee', borderRadius: 8, color: '#c62828', fontSize: 13, marginBottom: 12 }}>
          {payloadError}
          <button type="button" onClick={fetchPayload} style={{ marginLeft: 8, color: '#c62828', textDecoration: 'underline', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: 13 }}>
            {t('checkout.retry')}
          </button>
        </div>
      )}
      {isExpired && (
        <div role="alert" style={{ padding: 12, backgroundColor: '#fff3e0', borderRadius: 8, color: '#e65100', fontSize: 13, marginBottom: 12 }}>
          {t('checkout.holdExpired')}
        </div>
      )}

      {/* Pay button */}
      <button
        type="button"
        onClick={handlePay}
        disabled={!canPay}
        aria-label={t('checkout.pay.ariaLabel')}
        style={{
          width: '100%', padding: 14, borderRadius: 8, border: 'none',
          backgroundColor: canPay ? '#E31837' : '#e0e0e0',
          color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: canPay ? 'pointer' : 'not-allowed',
        }}
      >
        {payLoading ? '...' : t('checkout.pay')}
      </button>
    </div>
  );
};
