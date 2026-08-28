import React, { useMemo } from 'react';
import type { ScreenProps } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function ReviewDetail(props: ScreenProps) {
  const { booking, navigate, ancillaryOptions, returnAncillaryOptions } = props;

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

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('services-hub')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{t('review.title')}</Text>
        <div style={{ width: 40 }} />
      </div>

      <Text variant="footnote" ariaLabel={t('review.step.aria')}>{t('review.step.aria')}</Text>

      {booking.selectedOutboundOffer && (
        <div style={{ padding: '12px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)' }}>
          <Text variant="body-semibold">{t('bookingSummary.outbound')}</Text>
          <Text variant="body">{booking.selectedOutboundOffer.flightCode} | {booking.selectedOutboundOffer.departureTime} - {booking.selectedOutboundOffer.arrivalTime}</Text>
        </div>
      )}

      {booking.selectedReturnOffer && (
        <div style={{ padding: '12px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)' }}>
          <Text variant="body-semibold">{t('bookingSummary.return')}</Text>
          <Text variant="body">{booking.selectedReturnOffer.flightCode} | {booking.selectedReturnOffer.departureTime} - {booking.selectedReturnOffer.arrivalTime}</Text>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-008)', padding: '12px 0', borderTop: '1px solid var(--line-normal)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>{t('review.fare')}</Text><Text>{formatPrice(fareTotal)}</Text></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text>{t('review.services')}</Text><Text>{formatPrice(serviceTotal)}</Text></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><Text variant="headline" bold>{t('review.total')}</Text><Text variant="headline" bold>{formatPrice(grandTotal)}</Text></div>
      </div>

      <Button variant="gradient" onClick={() => navigate('checkout-pay')} ariaLabel={t('review.continue.aria')}>
        {t('review.continue')}
      </Button>
    </div>
  );
}
