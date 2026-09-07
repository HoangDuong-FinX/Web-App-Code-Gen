import React from 'react';
import { t } from '../i18n';
import type { AppState } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Divider } from '../components/ui/Divider';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { BookingSummaryBar } from '../components/BookingSummaryBar';

interface PaymentProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function PaymentScreen({ state, onNavigate, onUpdateState }: PaymentProps) {
  const session = state.outboundSession;
  const { searchCriteria, selectedOutboundOffer, selectedReturnOffer } = state;

  if (!session || !selectedOutboundOffer) {
    onNavigate('search');
    return null;
  }

  const outboundOffer = session.offers.find(o => o.offerId === selectedOutboundOffer.offerId);
  const returnOffer = state.returnSession?.offers.find(o =>
    o.offerId === selectedReturnOffer?.offerId
  );

  const paxCount = searchCriteria.adults + searchCriteria.children;
  let totalFare = selectedOutboundOffer.fareClass.priceAmount;
  if (selectedReturnOffer) totalFare += selectedReturnOffer.fareClass.priceAmount;
  totalFare *= paxCount;
  if (searchCriteria.infants > 0) totalFare += Math.round(totalFare * 0.1);

  const handleContinue = () => {
    onNavigate('checkout');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 flex-1">
        <h1 className="text-[28px] font-bold leading-[1.35] font-display">{t('payment.title')}</h1>

        <PriceHoldCountdown
          expiresAt={session.expiresAt}
          data-testid="price-hold-countdown"
        />

        {/* Journey header card */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
          <div className="flex items-center justify-center gap-4">
            <Text variant="headline" as="span">{searchCriteria.origin?.code}</Text>
            <Text variant="body" as="span">→</Text>
            <Text variant="headline" as="span">{searchCriteria.destination?.code}</Text>
          </div>
          <Text variant="body" as="p" className="text-center">
            {searchCriteria.tripType === 'round-trip' ? t('payment.roundTrip') : t('payment.oneWay')}
            {' · '}
            {searchCriteria.adults} Người lớn
            {searchCriteria.children > 0 ? `, ${searchCriteria.children} Trẻ em` : ''}
          </Text>
        </div>

        {/* Outbound leg card */}
        {outboundOffer && (
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
            <Text variant="body-semibold" as="span">{t('payment.leg.outbound')}</Text>
            <Text variant="body" as="span">
              {searchCriteria.origin?.code} → {searchCriteria.destination?.code}
            </Text>
            <Text variant="body" as="span">
              {outboundOffer.departureTime} — {outboundOffer.arrivalTime}
            </Text>
            <Text variant="body" as="span">{formatDuration(outboundOffer.durationMin)}</Text>
            <Text variant="footnote" as="span">
              {outboundOffer.flightNumber} · {outboundOffer.aircraft}
            </Text>
            <Divider />
            <div className="flex justify-between">
              <Text variant="body" as="span">{t('payment.fare')}</Text>
              <Text variant="body-semibold" as="span">
                {formatPrice(selectedOutboundOffer.fareClass.priceAmount * paxCount)}
              </Text>
            </div>
          </div>
        )}

        {/* Return leg card */}
        {returnOffer && selectedReturnOffer && (
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
            <Text variant="body-semibold" as="span">{t('payment.leg.return')}</Text>
            <Text variant="body" as="span">
              {searchCriteria.destination?.code} → {searchCriteria.origin?.code}
            </Text>
            <Text variant="body" as="span">
              {returnOffer.departureTime} — {returnOffer.arrivalTime}
            </Text>
            <Text variant="body" as="span">{formatDuration(returnOffer.durationMin)}</Text>
            <Text variant="footnote" as="span">
              {returnOffer.flightNumber} · {returnOffer.aircraft}
            </Text>
            <Divider />
            <div className="flex justify-between">
              <Text variant="body" as="span">{t('payment.fare')}</Text>
              <Text variant="body-semibold" as="span">
                {formatPrice(selectedReturnOffer.fareClass.priceAmount * paxCount)}
              </Text>
            </div>
          </div>
        )}

        {/* Total card */}
        <div
          className="flex justify-between items-center p-3 rounded-xl"
          style={{ backgroundColor: 'var(--vikki-vkblue-50)', borderTop: '2px solid var(--vikki-vkblue-500)' }}
        >
          <Text variant="body-semibold" as="span">{t('payment.total')}</Text>
          <Text variant="headline" as="span">{formatPrice(totalFare)}</Text>
        </div>

        <Button
          variant="primary"
          fullWidth
          aria-label={t('payment.continue.aria')}
          data-testid="continue-button"
          onClick={handleContinue}
        >
          {t('payment.continue')}
        </Button>
      </div>

      {/* Desktop summary sidebar */}
      <BookingSummaryBar state={state} />
    </div>
  );
}
