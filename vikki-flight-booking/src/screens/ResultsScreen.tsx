import React, { useEffect, useState } from 'react';
import { useAppContext, formatVND, formatDuration, isHoldExpired } from '../store';
import { t } from '../i18n/vi';
import { Text, Button, AlertNote } from '../components/ui';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { submitSearch } from '../fixtures/bookingService';
import type { FlightOffer, FareClass } from '../types';

interface ResultsScreenProps {
  leg: 'outbound' | 'return';
}

function get7DayStrip(centerDate: string): string[] {
  const dates: string[] = [];
  const center = new Date(centerDate);
  for (let i = -3; i <= 3; i++) {
    const d = new Date(center);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[d.getDay()];
}

export function ResultsScreen({ leg }: ResultsScreenProps) {
  const { state, setState, navigate } = useAppContext();
  const {
    searchCriteria,
    outboundSessionId,
    expiresAt,
    outboundOffers,
    returnOffers,
    selectedOutboundFare,
    dailyPrices,
  } = state;

  const isReturn = leg === 'return';
  const offers = isReturn ? returnOffers : outboundOffers;
  const title = isReturn ? t('results.titleReturn') : t('results.title');
  const centerDate = isReturn ? searchCriteria.returnDate : searchCriteria.departureDate;
  const stripDates = get7DayStrip(centerDate);

  const [stripPrices, setStripPrices] = useState<Record<string, number>>(dailyPrices);
  const [loadingReturn, setLoadingReturn] = useState(false);
  const [returnError, setReturnError] = useState<string | null>(null);
  const expired = isHoldExpired(expiresAt);

  // For return leg, fetch return offers
  useEffect(() => {
    if (!isReturn) return;
    if (returnOffers.length > 0) return;
    if (!outboundSessionId) return;
    setLoadingReturn(true);
    submitSearch({
      tripType: 'one-way',
      origin: searchCriteria.destination,
      destination: searchCriteria.origin,
      departureDate: searchCriteria.returnDate,
      adultCount: searchCriteria.adultCount,
      childCount: searchCriteria.childCount,
      infantCount: searchCriteria.infantCount,
    }).then(result => {
      setState(s => ({
        ...s,
        returnSessionId: result.sessionId,
        returnOffers: result.offers,
        // Keep earliest expiry
        expiresAt: s.expiresAt && result.expiresAt < s.expiresAt ? result.expiresAt : s.expiresAt,
      }));
    }).catch(() => {
      setReturnError(t('search.error'));
    }).finally(() => {
      setLoadingReturn(false);
    });
  }, [isReturn, returnOffers.length, outboundSessionId]);

  const handleSelectFare = (offer: FlightOffer, fare: FareClass) => {
    if (expired) return;
    if (isReturn) {
      setState(s => ({
        ...s,
        selectedReturnOffer: offer,
        selectedReturnFare: fare,
        // Clear return services when offer changes
        returnMeals: [],
        returnBaggage: null,
        returnSeats: [],
        currentScreen: 'passengers',
      }));
    } else {
      const isRoundTrip = searchCriteria.tripType === 'round-trip';
      setState(s => ({
        ...s,
        selectedOutboundOffer: offer,
        selectedOutboundFare: fare,
        // Clear outbound services when offer changes
        outboundMeals: [],
        outboundBaggage: null,
        outboundSeats: [],
        currentScreen: isRoundTrip ? 'results-return' : 'passengers',
      }));
    }
  };

  const handleStripDateClick = (date: string) => {
    if (isReturn) {
      setState(s => ({ ...s, searchCriteria: { ...s.searchCriteria, returnDate: date } }));
    } else {
      setState(s => ({ ...s, searchCriteria: { ...s.searchCriteria, departureDate: date } }));
    }
  };

  return (
    <div className="screen results-screen">
      <div className="screen__content">
        <h1 className="text-title-1" data-testid="results-title">{title}</h1>

        <PriceHoldCountdown
          expiresAt={expiresAt}
          data-testid="price-hold-countdown"
        />

        {expired && (
          <AlertNote visible tone="warning" data-testid="hold-expired-banner">
            {t('results.priceHold.expired')}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('search')}
            >
              {t('results.expired.searchAgain')}
            </button>
          </AlertNote>
        )}

        {/* 7-day price strip */}
        <div className="stack stack--col gap-12">
          <Text variant="headline" semantic="h2" data-testid="date-strip-header">
            {t('results.dateStrip.header')}
          </Text>
          <div className="date-strip" role="group" aria-label={t('results.dateStrip.header')}>
            {stripDates.map(date => {
              const price = stripPrices[date];
              const isSelected = date === centerDate;
              return (
                <button
                  key={date}
                  type="button"
                  className={`date-strip__day ${isSelected ? 'date-strip__day--selected' : ''}`}
                  aria-label={`${formatDayLabel(date)}, ng\u00E0y ${date}${price ? ', gi\u00E1 t\u1EEB ' + formatVND(price) : ''}`}
                  aria-pressed={isSelected}
                  data-testid="date-strip-day-button"
                  onClick={() => handleStripDateClick(date)}
                >
                  <span>{formatDayLabel(date)}</span>
                  <span>{new Date(date).getDate()}</span>
                  {price && <span className="date-strip__price">{t('results.from')} {(price / 1000000).toFixed(1)}M</span>}
                </button>
              );
            })}
          </div>
        </div>

        {loadingReturn && (
          <div className="loading-state">{t('results.loading')}</div>
        )}

        <AlertNote visible={!!returnError} tone="error">
          {returnError}
        </AlertNote>

        {/* Flight cards */}
        <div data-testid="flight-card-list">
          {offers.map(offer => (
            <div key={offer.offerId} className="flight-card">
              <div className="flight-card__header">
                <Text variant="body-semibold">{offer.flightNumber}</Text>
                <Text variant="body">
                  {offer.departureTime} \u2014 {offer.arrivalTime} \u00B7 {formatDuration(offer.durationMinutes)}
                </Text>
              </div>
              <Text variant="footnote">
                {offer.aircraft} \u00B7 {offer.stops === 0 ? t('results.directFlight') : `${offer.stops} ${t('results.stops')}`}
              </Text>
              <div className="flight-card__fares">
                {offer.fareClasses.map(fare => (
                  <div key={fare.fareId} className="fare-option">
                    <Text variant="body-semibold">{fare.name}</Text>
                    <Text variant="body">{formatVND(fare.priceAmount)}</Text>
                    <Text variant="footnote">{fare.baggageIncluded}</Text>
                    <button
                      type="button"
                      className="btn btn-primary"
                      aria-label={`${t('results.selectFare.ariaLabel')} ${fare.name}`}
                      data-testid="select-fare-button"
                      disabled={expired}
                      onClick={() => handleSelectFare(offer, fare)}
                    >
                      {t('results.selectFare')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary sidebar for desktop */}
        {selectedOutboundFare && !isReturn && (
          <div className="booking-summary-sidebar">
            <Text variant="headline" semantic="h2">Booking Summary</Text>
            <Text variant="body">
              {searchCriteria.origin} \u2192 {searchCriteria.destination}
            </Text>
            <Text variant="body-semibold">
              {t('common.outbound')}: {formatVND(selectedOutboundFare.priceAmount)}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
