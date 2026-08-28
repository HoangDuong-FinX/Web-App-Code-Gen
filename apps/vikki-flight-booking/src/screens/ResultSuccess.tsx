import React from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import { canShare, shareResult } from '../sdk/host';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import AlertNote from '../components/AlertNote';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function ResultSuccess(props: ScreenProps) {
  const { booking, resetBooking } = props;
  const amount = (booking.selectedOutboundOffer?.price ?? 0) + (booking.selectedReturnOffer?.price ?? 0);
  const bookingCode = booking.outboundSession?.sessionId ?? '';
  const isSimulated = booking.paymentResult?.paymentSessionId?.startsWith('sim_') ?? false;
  const hasTransactionId = !!booking.transactionId;
  const shareAvailable = canShare();

  const handleShare = () => {
    const text = `${t('result.success.title')} ${t('result.success.bookingCode')}: ${bookingCode}`;
    shareResult(text);
  };

  return (
    <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 48, color: 'var(--status-positive)' }} aria-label={t('result.success.icon.aria')}>\u2713</div>

      <Text variant="title-2" as="h1">{t('result.success.title')}</Text>

      <Text variant="headline" ariaLabel={t('result.success.amount.aria')}>-{formatPrice(amount)}</Text>

      <Text variant="body" ariaLabel={t('result.success.bookingCode.aria')}>
        {t('result.success.bookingCode')}: {bookingCode}
      </Text>

      <Text variant="footnote" visible={hasTransactionId}>
        {t('result.success.transactionId')}: {booking.transactionId}
      </Text>

      <Text variant="footnote">{t('result.success.vatNote')}</Text>

      <AlertNote visible={isSimulated} variant="warning" ariaLabel={t('result.success.simulated.aria')}>
        {t('result.success.simulated')}
      </AlertNote>

      <IconButton icon="share" visible={shareAvailable} onClick={handleShare} ariaLabel={t('result.success.share.aria')} />

      <Button variant="gradient" onClick={resetBooking} ariaLabel={t('result.success.bookAnother.aria')}>
        {t('result.success.bookAnother')}
      </Button>

      <Button variant="secondary" onClick={resetBooking} ariaLabel={t('result.success.goHome.aria')}>
        {t('result.success.goHome')}
      </Button>
    </div>
  );
}
