import React, { useCallback, useMemo } from 'react';
import { useBooking, useHoldTimer } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import { ButtonBig } from '../components/ButtonBig';
import { FlightSummaryCard } from '../components/FlightSummaryCard';
import { PassengerSummaryRow } from '../components/PassengerSummaryRow';
import { ServiceSummaryRow } from '../components/ServiceSummaryRow';
import { PriceLineRow } from '../components/PriceLineRow';
import { TextLink } from '../components/TextLink';
import type { ScreenId } from '../types';

interface ReviewScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

export function ReviewScreen({ onNavigate }: ReviewScreenProps) {
  const { t } = useI18n();
  const { state } = useBooking();

  const isRoundTrip = state.tripType === 'round';

  // Hold timer
  const earliestExpiry = useMemo(() => {
    if (isRoundTrip && state.returnSession) {
      const outboundTime = new Date(state.outboundSession?.expiresAt ?? '').getTime();
      const returnTime = new Date(state.returnSession.expiresAt).getTime();
      return outboundTime < returnTime
        ? state.outboundSession?.expiresAt ?? null
        : state.returnSession.expiresAt;
    }
    return state.outboundSession?.expiresAt ?? null;
  }, [state.outboundSession, state.returnSession, isRoundTrip]);

  const handleExpire = useCallback(() => {
    onNavigate('hold-expired');
  }, [onNavigate]);

  useHoldTimer(earliestExpiry, handleExpire);

  // Compute price breakdown per BR-05
  const priceLines = useMemo(() => {
    const lines: Array<{ label: string; amount: number }> = [];
    const outboundPrice = state.selectedOutboundOffer?.price ?? 0;
    const returnPrice = isRoundTrip ? (state.selectedReturnOffer?.price ?? 0) : 0;
    const paxCount = state.passengerCount.adults + state.passengerCount.children;

    // Ticket price = (outbound + return) × (adults + children)
    const ticketTotal = (outboundPrice + returnPrice) * paxCount;
    lines.push({ label: t('review.ticketPrice'), amount: ticketTotal });

    // Infant surcharge: +10% of offer price per BR-04 (flat, not per infant)
    if (state.passengerCount.infants > 0) {
      const infantSurcharge = Math.round((outboundPrice + returnPrice) * 0.1);
      lines.push({ label: t('review.infantSurcharge'), amount: infantSurcharge });
    }

    // Services total
    const servicesTotal = state.selectedServices.reduce((sum, s) => sum + s.price, 0)
      + state.returnSelectedServices.reduce((sum, s) => sum + s.price, 0);
    if (servicesTotal > 0) {
      lines.push({ label: t('review.servicesPrice'), amount: servicesTotal });
    }

    // Seat total
    const seatTotal = state.selectedSeats.reduce((sum, s) => sum + s.price, 0)
      + state.returnSelectedSeats.reduce((sum, s) => sum + s.price, 0);
    if (seatTotal > 0) {
      lines.push({ label: t('review.seatPrice'), amount: seatTotal });
    }

    return lines;
  }, [state, isRoundTrip, t]);

  const totalPrice = useMemo(() => {
    return priceLines.reduce((sum, line) => sum + line.amount, 0);
  }, [priceLines]);

  // Passenger type label mapper
  const passengerTypeLabel = (type: string): string => {
    switch (type) {
      case 'adult': return t('passengers.type.adult');
      case 'child': return t('passengers.type.child');
      case 'infant': return t('passengers.type.infant');
      default: return type;
    }
  };

  const handleContinue = useCallback(() => {
    onNavigate('checkout');
  }, [onNavigate]);

  const handleEdit = useCallback(() => {
    onNavigate('services');
  }, [onNavigate]);

  return (
    <div className="screen screen--review">
      <TopBar
        title={t('review.title')}
        showBackArrow
        onBack={() => onNavigate('services')}
        ariaLabel={t('review.title')}
      />
      <div className="screen__content">
        {/* Flight section */}
        <section className="review__section">
          <h2 className="review__section-title">{t('review.flightSection')}</h2>

          {state.selectedOutboundOffer && (
            <FlightSummaryCard
              leg="outbound"
              airline={state.selectedOutboundOffer.airline}
              departureTime={state.selectedOutboundOffer.departureTime}
              arrivalTime={state.selectedOutboundOffer.arrivalTime}
              date={state.departureDate}
              duration={state.selectedOutboundOffer.duration}
              flightNumber={state.selectedOutboundOffer.flightNumber}
              ariaLabel={t('review.outboundFlight.ariaLabel')
                .replace('{airline}', state.selectedOutboundOffer.airline)
                .replace('{flightNumber}', state.selectedOutboundOffer.flightNumber)}
            />
          )}

          {isRoundTrip && state.selectedReturnOffer && (
            <FlightSummaryCard
              leg="return"
              airline={state.selectedReturnOffer.airline}
              departureTime={state.selectedReturnOffer.departureTime}
              arrivalTime={state.selectedReturnOffer.arrivalTime}
              date={state.returnDate}
              duration={state.selectedReturnOffer.duration}
              flightNumber={state.selectedReturnOffer.flightNumber}
              ariaLabel={t('review.returnFlight.ariaLabel')
                .replace('{airline}', state.selectedReturnOffer.airline)
                .replace('{flightNumber}', state.selectedReturnOffer.flightNumber)}
            />
          )}
        </section>

        {/* Passengers section */}
        <section className="review__section">
          <h2 className="review__section-title">{t('review.passengersSection')}</h2>
          {state.passengers.map((pax, idx) => (
            <PassengerSummaryRow
              key={idx}
              name={pax.fullName}
              type={passengerTypeLabel(pax.type)}
              ariaLabel={`${pax.fullName}, ${passengerTypeLabel(pax.type)}`}
            />
          ))}
        </section>

        {/* Services section */}
        <section className="review__section">
          <h2 className="review__section-title">{t('review.servicesSection')}</h2>
          {state.selectedServices.length === 0 && state.returnSelectedServices.length === 0 ? (
            <p className="review__no-services">{t('review.noServices')}</p>
          ) : (
            <>
              {state.selectedServices.map((svc, idx) => (
                <ServiceSummaryRow
                  key={`out-${idx}`}
                  name={svc.name}
                  price={formatPrice(svc.price)}
                  ariaLabel={`${svc.name}: ${formatPrice(svc.price)}`}
                />
              ))}
              {state.returnSelectedServices.map((svc, idx) => (
                <ServiceSummaryRow
                  key={`ret-${idx}`}
                  name={`${svc.name} (${t('review.return')})`}
                  price={formatPrice(svc.price)}
                  ariaLabel={`${svc.name} (${t('review.return')}): ${formatPrice(svc.price)}`}
                />
              ))}
            </>
          )}
        </section>

        {/* Price section */}
        <section className="review__section">
          <h2 className="review__section-title">{t('review.priceSection')}</h2>
          {priceLines.map((line, idx) => (
            <PriceLineRow
              key={idx}
              label={line.label}
              amount={formatPrice(line.amount)}
              ariaLabel={`${line.label}: ${formatPrice(line.amount)}`}
            />
          ))}
          <PriceLineRow
            label={t('review.total')}
            amount={formatPrice(totalPrice)}
            variant="total"
            ariaLabel={`${t('review.total')}: ${formatPrice(totalPrice)}`}
          />
        </section>

        {/* Actions */}
        <div className="review__actions">
          <ButtonBig
            variant="Active"
            onClick={handleContinue}
            ariaLabel={t('review.continue.ariaLabel')}
          >
            {t('review.continue')}
          </ButtonBig>
          <TextLink
            onClick={handleEdit}
            ariaLabel={t('review.edit.ariaLabel')}
          >
            {t('review.edit')}
          </TextLink>
        </div>
      </div>
    </div>
  );
}
