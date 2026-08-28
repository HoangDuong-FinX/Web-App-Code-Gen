import React from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function ResultPartial(props: ScreenProps) {
  const { booking, resetBooking } = props;
  const amount = booking.selectedOutboundOffer?.price ?? 0;
  const bookingCode = booking.outboundSession?.sessionId ?? '';
  const hasTransactionId = !!booking.transactionId;

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, color: 'var(--status-cautionary)' }} aria-label={t('result.partial.icon.aria')}>\u26A0</div>

      <Text variant="title-2" as="h1">{t('result.partial.title')}</Text>

      <Text variant="headline">{formatPrice(amount)}</Text>

      <Text variant="body">{t('result.partial.bookingCode')}: {bookingCode}</Text>

      <Text variant="footnote" visible={hasTransactionId}>
        {t('result.partial.transactionId')}: {booking.transactionId}
      </Text>

      <Text variant="footnote">{t('result.partial.vatNote')}</Text>

      <Button variant="secondary" onClick={resetBooking} ariaLabel={t('result.partial.goHome.aria')}>
        {t('result.partial.goHome')}
      </Button>

      <Button variant="gradient" onClick={resetBooking} ariaLabel={t('result.partial.bookAnother.aria')}>
        {t('result.partial.bookAnother')}
      </Button>
    </div>
  );
}
