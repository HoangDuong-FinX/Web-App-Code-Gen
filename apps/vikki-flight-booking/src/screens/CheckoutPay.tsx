import React, { useEffect, useState, useMemo } from 'react';
import type { ScreenProps, PaymentInquiryPayload } from '../types';
import { t } from '../i18n';
import { httpGet, unwrap } from '../sdk/http';
import { promoCodeFixture } from '../fixtures/promo-code';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import AlertNote from '../components/AlertNote';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function CheckoutPay(props: ScreenProps) {
  const { booking, setBooking, navigate, handlePay, ancillaryOptions, returnAncillaryOptions, resetBooking } = props;
  const [payloadError, setPayloadError] = useState(false);
  const [loadingPayload, setLoadingPayload] = useState(true);
  const [paying, setPaying] = useState(false);
  const [vatChecked, setVatChecked] = useState(booking.vatRequested);

  const fareTotal = (booking.selectedOutboundOffer?.price ?? 0) + (booking.selectedReturnOffer?.price ?? 0);

  const serviceTotal = useMemo(() => {
    let total = 0;
    for (const sel of booking.ancillarySelections) {
      const opt = ancillaryOptions.find(o => o.optionId === sel.optionId);
      if (opt) total += opt.unitPrice;
    }
    for (const sel of booking.returnAncillarySelections) {
      const opt = returnAncillaryOptions.find(o => o.optionId === sel.optionId);
      if (opt) total += opt.unitPrice;
    }
    return total;
  }, [booking.ancillarySelections, booking.returnAncillarySelections, ancillaryOptions, returnAncillaryOptions]);

  const grandTotal = fareTotal + serviceTotal;

  const fetchBookingKeys = async () => {
    setLoadingPayload(true);
    setPayloadError(false);
    try {
      const outboundRes = await httpGet<PaymentInquiryPayload>(`/sessions/${booking.outboundSession?.sessionId}/payment-inquiry-payload`, 'booking');
      const outbound = unwrap(outboundRes);
      let returnKey: string | undefined;
      if (booking.tripType === 'round' && booking.returnSession) {
        const returnRes = await httpGet<PaymentInquiryPayload>(`/sessions/${booking.returnSession.sessionId}/payment-inquiry-payload`, 'booking');
        const ret = unwrap(returnRes);
        returnKey = ret.bookingKey;
      }
      setBooking(prev => ({ ...prev, bookingKeys: { outbound: outbound.bookingKey, return: returnKey } }));
      setLoadingPayload(false);
    } catch {
      setPayloadError(true);
      setLoadingPayload(false);
    }
  };

  useEffect(() => { fetchBookingKeys(); }, []);

  const canPay = !loadingPayload && !payloadError && !!booking.bookingKeys.outbound && (booking.tripType === 'oneway' || !!booking.bookingKeys.return);

  const handlePayClick = async () => {
    setPaying(true);
    setBooking(prev => ({ ...prev, vatRequested: vatChecked }));
    await handlePay();
    setPaying(false);
  };

  const holdExpired = booking.outboundSession ? new Date(booking.outboundSession.expiresAt).getTime() < Date.now() : false;

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('review-detail')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('checkout.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-008)' }}>
        <Text variant="headline">{t('checkout.detail.title')}</Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>{t('checkout.subtotal')}</Text><Text>{formatPrice(fareTotal)}</Text></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>{t('checkout.serviceFee')}</Text><Text>{formatPrice(serviceTotal)}</Text></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>{t('checkout.discount')}</Text><Text>{formatPrice(promoCodeFixture.discountAmount)}</Text></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--gap-008)', borderTop: '1px solid var(--line-normal)' }}><Text variant="headline" bold>{t('checkout.total')}</Text><Text variant="headline" bold>{formatPrice(grandTotal)}</Text></div>
      </div>

      <Text variant="body">{t('checkout.merchantInfo')}</Text>

      <div style={{ display: 'flex', gap: 'var(--gap-008)', alignItems: 'center' }}>
        <input
          type="text"
          placeholder={t('checkout.promo.placeholder')}
          disabled={promoCodeFixture.inputDisabled}
          aria-label={t('checkout.promo.aria')}
          style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-008)', border: '1px solid var(--line-normal)', fontSize: 14, opacity: 0.5 }}
        />
        <Button variant="secondary" disabled={promoCodeFixture.buttonDisabled} ariaLabel={t('checkout.promo.apply.aria')}>
          {t('checkout.promo.apply')}
        </Button>
      </div>

      <Text variant="body">{t('checkout.paymentSource')}</Text>

      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-008)', cursor: 'pointer' }}>
        <input type="checkbox" checked={vatChecked} onChange={e => setVatChecked(e.target.checked)} aria-label={t('checkout.vat.aria')} />
        <span style={{ fontSize: 14 }}>{t('checkout.vat')}</span>
      </label>

      <Text variant="footnote" ariaLabel={t('checkout.finePrint.aria')}>{t('checkout.finePrint')}</Text>

      <Button variant="gradient" disabled={!canPay || paying} onClick={handlePayClick} ariaLabel={t('checkout.pay.aria')}>
        {paying ? t('checkout.paying') : t('checkout.pay')}
      </Button>

      <AlertNote visible={payloadError} variant="error" actionLabel={t('checkout.payloadError.retry')} onAction={fetchBookingKeys} ariaLabel={t('checkout.payloadError.aria')}>
        {t('checkout.payloadError')}
      </AlertNote>

      <AlertNote visible={!loadingPayload && !payloadError && !booking.bookingKeys.outbound} variant="warning" ariaLabel={t('checkout.noBookingKey.aria')}>
        {t('checkout.noBookingKey')}
      </AlertNote>

      <AlertNote visible={holdExpired} variant="warning" actionLabel={t('holdExpired.action')} onAction={resetBooking} ariaLabel={t('checkout.holdExpired.aria')}>
        {t('holdExpired.title')}
      </AlertNote>
    </div>
  );
}
