import React, { useMemo } from 'react';
import type { ScreenProps, FlightOffer } from '../types';
import { t } from '../i18n';
import Text from '../components/Text';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import AlertNote from '../components/AlertNote';

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VND';
}

export default function SelectFlight(props: ScreenProps) {
  const { booking, navigate, handleSelectOutbound, handleSelectReturn, isReturn, resetBooking } = props;
  const session = isReturn ? booking.returnSession : booking.outboundSession;
  const offers = session?.offers ?? [];
  const title = isReturn ? t('selectFlight.title.return') : t('selectFlight.title.outbound');

  const handleSelect = (offer: FlightOffer) => {
    if (isReturn) { handleSelectReturn(offer); }
    else { handleSelectOutbound(offer); }
  };

  const holdExpired = session ? new Date(session.expiresAt).getTime() < Date.now() : false;

  return (
    <div className="screen">
      <div className="header-row">
        <IconButton icon="back" onClick={() => navigate('search-home')} ariaLabel={t('common.back.aria')} />
        <Text variant="title-2" as="h1">{title}</Text>
        <div style={{ width: 40 }} />
      </div>

      {session && (
        <Text variant="footnote" ariaLabel={t('selectFlight.holdTimer.aria')}>
          {new Date(session.expiresAt).toLocaleTimeString('vi-VN')}
        </Text>
      )}

      {offers.length === 0 && !holdExpired && (
        <div style={{ padding: 'var(--gap-032)', textAlign: 'center' }}>
          <Text ariaLabel={t('selectFlight.noFlights.aria')}>{t('selectFlight.noFlights')}</Text>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-012)' }}>
        {offers.map(offer => (
          <button
            key={offer.offerId}
            type="button"
            onClick={() => handleSelect(offer)}
            aria-label={`${offer.flightCode} ${offer.departureTime}-${offer.arrivalTime}`}
            style={{ padding: '14px 16px', borderRadius: 'var(--radius-012)', border: '1px solid var(--line-normal)', background: 'var(--common-100)', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{offer.flightCode}</div>
              <div style={{ fontSize: 13, color: 'var(--label-alternative)' }}>{offer.departureTime} - {offer.arrivalTime} | {offer.duration}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--main-primary)' }}>{formatPrice(offer.price)}</div>
              <div style={{ fontSize: 11, color: 'var(--label-alternative)' }}>{offer.seatsRemaining} {t('seat.available')}</div>
            </div>
          </button>
        ))}
      </div>

      <AlertNote visible={holdExpired} variant="warning" actionLabel={t('selectFlight.holdExpired.action')} onAction={resetBooking} ariaLabel={t('selectFlight.holdExpired.aria')}>
        {t('selectFlight.holdExpired')}
      </AlertNote>
    </div>
  );
}
