import React from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function BookingSummary(props: ScreenProps) {
  const { booking, navigate } = props;
  const outbound = booking.selectedOutboundOffer;
  const returnOffer = booking.selectedReturnOffer;
  const totalPrice = (outbound?.price ?? 0) + (returnOffer?.price ?? 0);

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('select-flight')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('bookingSummary.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      {outbound && (
        <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)', background: 'var(--common-100)' }}>
          <Text variant="body-semibold">{t('bookingSummary.outbound')}</Text>
          <Text variant="body">{outbound.flightCode} | {outbound.departureTime} - {outbound.arrivalTime}</Text>
          <Text variant="headline">{formatPrice(outbound.price)}</Text>
        </div>
      )}

      {returnOffer && (
        <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)', background: 'var(--common-100)' }}>
          <Text variant="body-semibold">{t('bookingSummary.return')}</Text>
          <Text variant="body">{returnOffer.flightCode} | {returnOffer.departureTime} - {returnOffer.arrivalTime}</Text>
          <Text variant="headline">{formatPrice(returnOffer.price)}</Text>
        </div>
      )}

      <div style={{ padding: '12px 0', borderTop: '1px solid var(--line-normal)' }}>
        <Text variant="headline" ariaLabel={t('bookingSummary.total.aria')}>{t('review.total')}: {formatPrice(totalPrice)}</Text>
      </div>

      <Button variant="gradient" onClick={() => navigate('enter-passengers')} ariaLabel={t('bookingSummary.continue.aria')}>
        {t('bookingSummary.continue')}
      </Button>
    </div>
  );
}
