import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import type { AppState, FlightOffer, FareClass } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { AlertNote } from '../components/ui/AlertNote';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { Divider } from '../components/ui/Divider';
import { defaultServicesData } from '../types/state';

interface ResultsProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
  isReturn?: boolean;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function ResultsScreen({ state, onNavigate, onUpdateState, isReturn = false }: ResultsProps) {
  const session = isReturn ? state.returnSession : state.outboundSession;
  const [holdExpired, setHoldExpired] = useState(false);

  useEffect(() => {
    if (!session) {
      onNavigate('search');
    }
  }, [session, onNavigate]);

  if (!session) return null;

  const handleSelectFare = (offer: FlightOffer, fare: FareClass) => {
    if (holdExpired) return;
    if (isReturn) {
      onUpdateState({
        selectedReturnOffer: { offerId: offer.offerId, fareClass: fare },
        services: defaultServicesData(),
      });
      onNavigate('passengers');
    } else {
      onUpdateState({
        selectedOutboundOffer: { offerId: offer.offerId, fareClass: fare },
        services: defaultServicesData(),
      });
      if (state.searchCriteria.tripType === 'round-trip') {
        // Trigger return search with same session placeholder
        // For fixture: use the same session as outbound (real app would re-search)
        onUpdateState({ returnSession: session });
        onNavigate('results-return');
      } else {
        onNavigate('passengers');
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[28px] font-bold leading-[1.35] font-display" data-testid="results-title">
        {isReturn ? t('results.title.return') : t('results.title.outbound')}
      </h1>

      <PriceHoldCountdown
        expiresAt={session.expiresAt}
        onExpired={() => setHoldExpired(true)}
        data-testid="price-hold-countdown"
      />

      {holdExpired && (
        <AlertNote tone="error" role="alert" data-testid="hold-expired-banner">
          {t('results.holdExpired')}
          <Button variant="ghost" onClick={() => onNavigate('search')} className="ml-2 !py-0 !px-1 text-[12px]">
            {t('results.searchAgain')}
          </Button>
        </AlertNote>
      )}

      {/* Flight cards */}
      <div className="flex flex-col gap-3" data-testid="flight-card-list">
        {session.offers.length === 0 && (
          <Text variant="body" as="p">{t('results.noFlights')}</Text>
        )}
        {session.offers.map(offer => (
          <div
            key={offer.offerId}
            className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]"
          >
            <div className="flex justify-between items-center">
              <Text variant="body-semibold" as="span">{offer.flightNumber}</Text>
              <Text variant="body" as="span">
                {offer.departureTime} — {offer.arrivalTime} · {formatDuration(offer.durationMin)}
              </Text>
            </div>
            <Text variant="footnote" as="span">
              {offer.aircraft} · {offer.stops === 0 ? t('common.straightFlight') : `${offer.stops} điểm dừng`}
            </Text>
            <Divider />
            {/* Fare classes */}
            <div className="flex flex-col gap-2">
              {offer.fareClasses.map(fare => (
                <div
                  key={fare.fareClass}
                  className="flex flex-col gap-1 p-3 rounded-xl bg-[var(--vikki-vkblue-50)] border border-[var(--vikki-vkblue-200)]"
                >
                  <div className="flex justify-between items-start">
                    <Text variant="body-semibold" as="span">{fare.fareClass}</Text>
                    <Text variant="body-semibold" as="span">{formatPrice(fare.priceAmount)}</Text>
                  </div>
                  <Text variant="footnote" as="span">{fare.baggageInfo}</Text>
                  <Button
                    variant="primary"
                    aria-label={t('results.flightCard.selectFare.aria', { fareClass: fare.fareClass })}
                    data-testid="select-fare-button"
                    onClick={() => handleSelectFare(offer, fare)}
                    disabled={holdExpired}
                    className="mt-1"
                  >
                    {t('results.flightCard.selectFare')}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
