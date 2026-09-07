import React from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { Divider } from '../components/Divider';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { BookingSummary } from '../components/BookingSummary';
import { t, formatVnd } from '../i18n';
import { calculateTotal, calculateSubtotal, calculateServiceFee } from '../utils/price';
import type { AppState, AppAction, ScreenId } from '../types/state';

interface PaymentScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
}

export function PaymentScreen({ state, dispatch, navigate }: PaymentScreenProps): React.ReactElement {
  const total = calculateTotal(state);
  const { selectedOutboundOffer, selectedReturnOffer, tripType, origin, destination, adults, children, infants } = state;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      {/* Main content */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
        <Text variant="title-1" semantic="h1">{t('payment.title')}</Text>

        {state.expiresAt && (
          <PriceHoldCountdown
            expiresAt={state.expiresAt}
            data-testid="price-hold-countdown"
          />
        )}

        {/* Journey header card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="headline">{origin?.code ?? ''}</Text>
            <Text variant="body">→</Text>
            <Text variant="headline">{destination?.code ?? ''}</Text>
          </div>
          <Text variant="body">
            {tripType === 'round-trip' ? t('payment.roundTrip') : t('payment.oneWay')}
            {' · '}
            {t('payment.adults', { count: adults })}
            {children > 0 ? `, ${t('payment.children', { count: children })}` : ''}
            {infants > 0 ? `, ${t('payment.infants', { count: infants })}` : ''}
          </Text>
        </div>

        {/* Outbound leg card */}
        {selectedOutboundOffer && (
          <LegCard
            label={t('payment.outbound')}
            offer={selectedOutboundOffer}
            services={state.outboundServices}
            adults={adults}
            children={children}
            infants={infants}
          />
        )}

        {/* Return leg card */}
        {tripType === 'round-trip' && selectedReturnOffer && (
          <LegCard
            label={t('payment.return')}
            offer={selectedReturnOffer}
            services={state.returnServices}
            adults={adults}
            children={children}
            infants={infants}
          />
        )}

        {/* Total */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
            background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-12)',
            borderTop: '2px solid var(--vikki-vkblue-500)',
          }}
        >
          <Text variant="body-semibold">{t('payment.totalLabel')}</Text>
          <Text variant="headline">{formatVnd(total)}</Text>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('checkout')}
          ariaLabel={t('payment.continue.ariaLabel')}
          data-testid="continue-button"
          fullWidth
        >
          {t('payment.continue')}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div
        style={{ width: '330px', flexShrink: 0, position: 'sticky', top: '16px', padding: '16px', display: 'none' }}
        className="payment-sidebar"
      >
        <BookingSummary state={state} />
      </div>

      <style>{`@media (min-width: 768px) { .payment-sidebar { display: block !important; } }`}</style>
    </div>
  );

  function LegCard({
    label,
    offer,
    services,
    adults: a,
    children: c,
    infants: inf,
  }: {
    label: string;
    offer: NonNullable<typeof selectedOutboundOffer>;
    services: AppState['outboundServices'];
    adults: number;
    children: number;
    infants: number;
  }) {
    const fareTotal = offer.priceAmount * (a + c) + (inf >= 1 ? offer.priceAmount * 0.1 : 0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-12)' }}>
        <Text variant="body-semibold">{label}</Text>
        <Text variant="body">{offer.origin} → {offer.destination}</Text>
        <Text variant="body">{offer.departureTime} — {offer.arrivalTime}</Text>
        <Text variant="body">{offer.duration}</Text>
        <Text variant="footnote">{offer.flightNumber} · {offer.aircraft}</Text>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('payment.farePrice')}</Text>
          <Text variant="body-semibold">{formatVnd(Math.round(fareTotal))}</Text>
        </div>
        {services.meals.map(m => (
          <div key={m.optionId} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{m.name} ×{m.quantity}</Text>
            <Text variant="body-semibold">{formatVnd(m.priceAmount * m.quantity)}</Text>
          </div>
        ))}
        {services.baggage && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{services.baggage.name}</Text>
            <Text variant="body-semibold">{formatVnd(services.baggage.priceAmount)}</Text>
          </div>
        )}
        {services.seats.map(s => (
          <div key={s.seatNumber} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">Ghế {s.seatNumber}</Text>
            <Text variant="body-semibold">{formatVnd(s.priceAmount)}</Text>
          </div>
        ))}
      </div>
    );
  }
}
