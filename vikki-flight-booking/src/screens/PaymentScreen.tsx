import React from 'react';
import { useAppContext, formatVND, formatDuration, calculateTotal } from '../store';
import { t } from '../i18n/vi';
import { Text, Divider, AlertNote } from '../components/ui';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';

export function PaymentScreen() {
  const { state, setState } = useAppContext();
  const {
    expiresAt,
    searchCriteria,
    selectedOutboundOffer,
    selectedOutboundFare,
    selectedReturnOffer,
    selectedReturnFare,
    outboundMeals,
    outboundBaggage,
    outboundSeats,
    returnMeals,
    returnBaggage,
    returnSeats,
    outboundAncillaryCatalog,
    returnAncillaryCatalog,
    passengers,
  } = state;

  const total = calculateTotal(
    selectedOutboundFare,
    selectedReturnFare,
    searchCriteria,
    outboundMeals,
    outboundBaggage,
    outboundSeats,
    returnMeals,
    returnBaggage,
    returnSeats,
    outboundAncillaryCatalog,
    returnAncillaryCatalog,
  );

  const renderLegSummary = (leg: 'outbound' | 'return') => {
    const offer = leg === 'outbound' ? selectedOutboundOffer : selectedReturnOffer;
    const fare = leg === 'outbound' ? selectedOutboundFare : selectedReturnFare;
    const meals = leg === 'outbound' ? outboundMeals : returnMeals;
    const baggage = leg === 'outbound' ? outboundBaggage : returnBaggage;
    const seats = leg === 'outbound' ? outboundSeats : returnSeats;
    const catalog = leg === 'outbound' ? outboundAncillaryCatalog : returnAncillaryCatalog;
    const origin = leg === 'outbound' ? searchCriteria.origin : searchCriteria.destination;
    const destination = leg === 'outbound' ? searchCriteria.destination : searchCriteria.origin;
    if (!offer || !fare) return null;

    const paxCount = searchCriteria.adultCount + searchCriteria.childCount;
    const ticketTotal = fare.priceAmount * paxCount;

    return (
      <div className="leg-summary-card">
        <Text variant="body-semibold">
          {leg === 'outbound' ? t('payment.outbound') : t('payment.return')}
        </Text>
        <div className="row-between">
          <Text variant="body">{origin} \u2192 {destination}</Text>
          <Text variant="body">{offer.departureTime} \u2014 {offer.arrivalTime}</Text>
        </div>
        <Text variant="footnote">{formatDuration(offer.durationMinutes)} \u00B7 {offer.flightNumber} \u00B7 {offer.aircraft}</Text>
        <Divider />
        <p className="text-caption-2">{t('payment.fares')}</p>
        <div className="row-between">
          <Text variant="body">
            {t('payment.adult')} x{searchCriteria.adultCount}
            {searchCriteria.childCount > 0 && `, ${t('payment.child')} x${searchCriteria.childCount}`}
          </Text>
          <Text variant="body-semibold">{formatVND(ticketTotal)}</Text>
        </div>
        {searchCriteria.infantCount > 0 && (
          <div className="row-between">
            <Text variant="body">{t('payment.infant')} (flat +10%)</Text>
            <Text variant="body-semibold">{formatVND(fare.priceAmount * 0.1)}</Text>
          </div>
        )}
        {(meals.length > 0 || baggage || seats.length > 0) && (
          <>
            <Divider />
            <p className="text-caption-2">{t('payment.services')}</p>
            {meals.map(m => {
              const meal = catalog?.meals.find(x => x.optionId === m.optionId);
              if (!meal) return null;
              return (
                <div key={m.optionId} className="row-between">
                  <Text variant="body">{meal.name} x{m.quantity}</Text>
                  <Text variant="body-semibold">{formatVND(meal.priceAmount * m.quantity)}</Text>
                </div>
              );
            })}
            {baggage && (() => {
              const bag = catalog?.baggage.find(b => b.optionId === baggage.optionId);
              return bag ? (
                <div className="row-between">
                  <Text variant="body">{bag.name}</Text>
                  <Text variant="body-semibold">{formatVND(bag.priceAmount)}</Text>
                </div>
              ) : null;
            })()}
            {seats.map(s => (
              <div key={s.seatNumber} className="row-between">
                <Text variant="body">Gh\u1EBF {s.seatNumber}</Text>
                <Text variant="body-semibold">{formatVND(s.priceAmount)}</Text>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="screen payment-screen">
      <div className="screen__content">
        <h1 className="text-title-1">{t('payment.title')}</h1>

        <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

        {/* Journey header */}
        <div className="journey-header-card">
          <div className="row-between">
            <Text variant="headline">{searchCriteria.origin}</Text>
            <Text variant="body">\u2192</Text>
            <Text variant="headline">{searchCriteria.destination}</Text>
          </div>
          <Text variant="body">
            {searchCriteria.tripType === 'round-trip' ? t('payment.roundTrip') : t('payment.oneWay')}
            {' \u00B7 '}
            {searchCriteria.adultCount} {t('payment.adult')}
            {searchCriteria.childCount > 0 && `, ${searchCriteria.childCount} ${t('payment.child')}`}
            {searchCriteria.infantCount > 0 && `, ${searchCriteria.infantCount} ${t('payment.infant')}`}
          </Text>
        </div>

        {renderLegSummary('outbound')}
        {searchCriteria.tripType === 'round-trip' && renderLegSummary('return')}

        {/* Total */}
        <div className="total-card row-between">
          <Text variant="body-semibold">{t('payment.total')}</Text>
          <Text variant="headline">{formatVND(total)}</Text>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          aria-label={t('payment.continue.ariaLabel')}
          data-testid="continue-button"
          onClick={() => setState(s => ({ ...s, currentScreen: 'checkout' }))}
        >
          {t('payment.continue')}
        </button>
      </div>
    </div>
  );
}
