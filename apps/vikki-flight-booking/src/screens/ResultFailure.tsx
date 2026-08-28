import React from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function ResultFailure(props: ScreenProps) {
  const { booking, navigate, resetBooking, paymentFailureReason } = props;
  const amount = (booking.selectedOutboundOffer?.price ?? 0) + (booking.selectedReturnOffer?.price ?? 0);
  const bookingCode = booking.outboundSession?.sessionId ?? '';

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, color: 'var(--status-negative)' }} aria-label={t('result.failure.icon.aria')}>\u2717</div>

      <Text variant="title-2" as="h1">{t('result.failure.title')}</Text>

      <Text variant="headline">{formatPrice(amount)}</Text>

      {paymentFailureReason && (
        <Text variant="body" ariaLabel={t('result.failure.reason.aria')}>{paymentFailureReason}</Text>
      )}

      <Text variant="body">{t('result.failure.bookingCode')}: {bookingCode}</Text>

      <Button variant="secondary" onClick={resetBooking} ariaLabel={t('result.failure.goHome.aria')}>
        {t('result.failure.goHome')}
      </Button>

      <Button variant="gradient" onClick={() => navigate('checkout-pay')} ariaLabel={t('result.failure.retry.aria')}>
        {t('result.failure.retry')}
      </Button>
    </div>
  );
}
