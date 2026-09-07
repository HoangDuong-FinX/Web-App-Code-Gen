import React from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction, FlightOffer, LegServices } from '../types';
import { Button } from '../components/ui/Button';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { Divider } from '../components/ui/Divider';
import { formatVND } from '../utils/format';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

function calcLegTotal(offer: FlightOffer, services: LegServices, paxCount: number): number {
  const fare = offer.priceAmount * paxCount;
  const meals = services.meals.reduce((s, m) => s + m.priceAmount * m.quantity, 0);
  const baggage = services.baggage.reduce((s, b) => s + b.priceAmount, 0);
  const seats = services.seats.reduce((s, seat) => s + seat.priceAmount, 0);
  return fare + meals + baggage + seats;
}

interface LegCardProps {
  label: string;
  offer: FlightOffer;
  services: LegServices;
  paxCount: number;
  infantCount: number;
}

const LegCard: React.FC<LegCardProps> = ({ label, offer, services, paxCount, infantCount }) => {
  const fare = offer.priceAmount * paxCount * (infantCount >= 1 ? 1.1 : 1);
  const mealTotal = services.meals.reduce((s, m) => s + m.priceAmount * m.quantity, 0);
  const bagTotal = services.baggage.reduce((s, b) => s + b.priceAmount, 0);
  const seatTotal = services.seats.reduce((s, seat) => s + seat.priceAmount, 0);
  const legTotal = fare + mealTotal + bagTotal + seatTotal;

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
      <span className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">
          {offer.origin} → {offer.destination}
        </span>
        <span className="text-[var(--color-text-secondary)]">
          {offer.departureTime} — {offer.arrivalTime} · {offer.duration}
        </span>
      </div>
      <span className="text-xs text-[var(--color-text-secondary)]">
        {offer.flightNumber} · {offer.aircraft}
      </span>
      <Divider />
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{vi.payment.fareLabel}</span>
        <span className="font-semibold text-[var(--color-text-primary)]">{formatVND(fare)}</span>
      </div>
      {mealTotal > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.services.meals}</span>
          <span className="font-semibold text-[var(--color-text-primary)]">{formatVND(mealTotal)}</span>
        </div>
      )}
      {bagTotal > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.services.baggage}</span>
          <span className="font-semibold text-[var(--color-text-primary)]">{formatVND(bagTotal)}</span>
        </div>
      )}
      {seatTotal > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.payment.preferredSeat}</span>
          <span className="font-semibold text-[var(--color-text-primary)]">{formatVND(seatTotal)}</span>
        </div>
      )}
      <Divider />
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{vi.payment.total}</span>
        <span className="text-[var(--text-headline)] text-[var(--color-text-primary)]">{formatVND(legTotal)}</span>
      </div>
    </div>
  );
};

export const PaymentScreen: React.FC<Props> = ({ state, dispatch }) => {
  const expiresAt = state.outboundSession?.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const { selectedOutboundOffer, selectedReturnOffer, searchCriteria } = state;
  const paxCount = searchCriteria.passengers.adults + searchCriteria.passengers.children;
  const infantCount = searchCriteria.passengers.infants;
  const isRoundTrip = searchCriteria.tripType === 'round-trip';

  if (!selectedOutboundOffer) {
    return (
      <div className="p-4">
        <AlertNote visible tone="error">
          {vi.common.error}
        </AlertNote>
        <Button variant="primary" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })} fullWidth>
          {vi.results.searchAgain}
        </Button>
      </div>
    );
  }

  const outboundTotal = calcLegTotal(selectedOutboundOffer, state.outboundServices, paxCount);
  const returnTotal = selectedReturnOffer ? calcLegTotal(selectedReturnOffer, state.returnServices, paxCount) : 0;
  const grandTotal = outboundTotal + returnTotal + (infantCount >= 1 ? selectedOutboundOffer.priceAmount * 0.1 : 0);

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)]">
        {vi.payment.title}
      </h1>

      <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

      {/* Journey header */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-headline)] text-[var(--color-text-primary)]">
            {selectedOutboundOffer.origin}
          </span>
          <span className="text-sm text-[var(--color-text-secondary)]"> → </span>
          <span className="text-[var(--text-headline)] text-[var(--color-text-primary)]">
            {selectedOutboundOffer.destination}
          </span>
        </div>
        <span className="text-sm text-[var(--color-text-secondary)]">
          {isRoundTrip ? vi.payment.roundTrip : vi.payment.oneWay} ·
          {` ${searchCriteria.passengers.adults} ${vi.payment.adult}`}
          {searchCriteria.passengers.children > 0 && `, ${searchCriteria.passengers.children} ${vi.payment.child}`}
          {searchCriteria.passengers.infants > 0 && `, ${searchCriteria.passengers.infants} ${vi.payment.infant}`}
        </span>
      </div>

      {/* Outbound leg */}
      <LegCard
        label={vi.payment.outbound}
        offer={selectedOutboundOffer}
        services={state.outboundServices}
        paxCount={paxCount}
        infantCount={infantCount}
      />

      {/* Return leg */}
      {isRoundTrip && selectedReturnOffer && (
        <LegCard
          label={vi.payment.returnLeg}
          offer={selectedReturnOffer}
          services={state.returnServices}
          paxCount={paxCount}
          infantCount={infantCount}
        />
      )}

      {/* Grand total */}
      <div
        className="flex items-center justify-between p-3 rounded-xl bg-[var(--vikki-vkblue-50)] border-t-2 border-[var(--vikki-vkblue-500)]"
      >
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">{vi.payment.total}</span>
        <span className="text-[var(--text-headline)] text-[var(--vikki-vkblue-700)]">{formatVND(grandTotal)}</span>
      </div>

      <Button
        variant="primary"
        ariaLabel={vi.payment.continueLabel}
        data-testid="continue-button"
        onClick={() => dispatch({ type: 'NAVIGATE', screen: 'checkout' })}
        fullWidth
      >
        {vi.payment.continueButton}
      </Button>
    </div>
  );
};
