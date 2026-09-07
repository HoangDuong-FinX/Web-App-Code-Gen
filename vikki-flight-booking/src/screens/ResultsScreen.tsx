import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { AlertNote } from '../components/AlertNote';
import { HoldExpiredNote } from '../components/HoldExpiredNote';
import { Divider } from '../components/Divider';
import { BookingSummary } from '../components/BookingSummary';
import { t, formatVnd } from '../i18n';
import { formatDateVi, formatDayOfWeek, get7DayStrip, isExpired } from '../utils/date';
import { fixtureFetchDailyPrices, fixtureSearchReturn } from '../fixtures/flights';
import type { AppState, AppAction, ScreenId, FlightOffer } from '../types/state';

interface ResultsScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
  isReturn: boolean;
}

export function ResultsScreen({ state, dispatch, navigate, isReturn }: ResultsScreenProps): React.ReactElement {
  const offers = isReturn ? state.returnOffers : state.outboundOffers;
  const [holdExpired, setHoldExpired] = useState(isExpired(state.expiresAt));
  const [dailyPrices, setDailyPrices] = useState<Record<string, number | null>>({});
  const [selectedDate, setSelectedDate] = useState(
    isReturn ? state.returnDate : state.departureDate
  );

  // Load return offers on first render if isReturn and no returnOffers yet
  useEffect(() => {
    if (!isReturn || state.returnOffers.length > 0) return;
    if (!state.origin || !state.destination) return;
    fixtureSearchReturn({
      tripType: state.tripType,
      origin: state.origin.code,
      destination: state.destination.code,
      departureDate: state.departureDate,
      returnDate: state.returnDate,
      adults: state.adults,
      children: state.children,
      infants: state.infants,
    }).then(result => {
      dispatch({ type: 'SET_RETURN_OFFERS', returnOffers: result.offers });
    }).catch(() => {/* silently fail */});
  }, [isReturn, state, dispatch]);

  // Fetch 7-day strip prices
  useEffect(() => {
    if (!state.origin || !state.destination) return;
    const strip = get7DayStrip(selectedDate);
    const origin = isReturn ? state.destination!.code : state.origin!.code;
    const dest = isReturn ? state.origin!.code : state.destination!.code;
    strip.forEach(date => {
      if (dailyPrices[date] !== undefined) return;
      fixtureFetchDailyPrices(origin, dest, date)
        .then(price => setDailyPrices(prev => ({ ...prev, [date]: price })))
        .catch(() => setDailyPrices(prev => ({ ...prev, [date]: null })));
    });
  }, [selectedDate, state.origin, state.destination, isReturn]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectOffer = useCallback((offer: FlightOffer) => {
    if (holdExpired) return;
    if (isReturn) {
      dispatch({ type: 'SELECT_RETURN_OFFER', offer });
      navigate('passengers');
    } else {
      dispatch({ type: 'SELECT_OUTBOUND_OFFER', offer });
      if (state.tripType === 'round-trip') {
        navigate('results-return');
      } else {
        navigate('passengers');
      }
    }
  }, [holdExpired, isReturn, dispatch, navigate, state.tripType]);

  // Group offers by flight number
  const flightGroups = offers.reduce<Record<string, FlightOffer[]>>((acc, offer) => {
    const key = `${offer.flightNumber}-${offer.departureTime}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(offer);
    return acc;
  }, {});

  const dateStrip = get7DayStrip(selectedDate);

  const title = isReturn ? t('results.titleReturn') : t('results.title');

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      {/* Main content */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
        <Text variant="title-1" semantic="h1" data-testid="results-title">{title}</Text>

        {state.expiresAt && (
          <PriceHoldCountdown
            expiresAt={state.expiresAt}
            onExpired={() => setHoldExpired(true)}
            data-testid="price-hold-countdown"
          />
        )}

        {holdExpired && (
          <HoldExpiredNote onSearchAgain={() => navigate('search')} />
        )}

        {/* 7-day date strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Text variant="headline" data-testid="date-strip-header">{t('results.dateStrip.header')}</Text>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {dateStrip.map(date => {
              const price = dailyPrices[date];
              const isSelected = date === selectedDate;
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  aria-label={`${formatDayOfWeek(date)}, ngày ${new Date(date + 'T00:00:00').getDate()}, giá từ ${price ? formatVnd(price) : '...'}`}
                  aria-pressed={isSelected}
                  data-testid="date-strip-day-button"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-8)',
                    border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--gray-200)'}`,
                    background: isSelected ? 'var(--color-primary-light)' : '#fff',
                    cursor: 'pointer',
                    minWidth: '72px',
                    gap: '2px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ font: 'var(--text-caption-2)', color: 'var(--color-text-secondary)' }}>
                    {formatDayOfWeek(date)}
                  </span>
                  <span style={{ font: 'var(--text-body-semibold)' }}>
                    {new Date(date + 'T00:00:00').getDate()}
                  </span>
                  <span style={{ font: 'var(--text-footnote)', color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                    {price != null ? formatVnd(price) : '...'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Flight cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} data-testid="flight-card-list">
          {Object.entries(flightGroups).map(([key, fareOffers]) => {
            const first = fareOffers[0];
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--radius-12)',
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="body-semibold">{first.flightNumber}</Text>
                  <Text variant="body">{first.departureTime} — {first.arrivalTime} · {first.duration}</Text>
                </div>
                <Text variant="footnote">{first.aircraft} · {t('results.flightCard.direct')}</Text>

                {/* Fare classes */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {fareOffers.map(offer => (
                    <div
                      key={offer.offerId}
                      style={{
                        flex: '1 1 140px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        padding: '8px',
                        background: 'var(--color-primary-light)',
                        borderRadius: 'var(--radius-8)',
                      }}
                    >
                      <Text variant="body-semibold">{offer.fareClass}</Text>
                      <Text variant="body">{formatVnd(offer.priceAmount)}</Text>
                      <Text variant="footnote">{t('results.handLuggage')}</Text>
                      <Button
                        variant="primary"
                        onClick={() => handleSelectOffer(offer)}
                        disabled={holdExpired}
                        ariaLabel={t('results.selectFare.ariaLabel', { fare: offer.fareClass, flight: offer.flightNumber })}
                        data-testid="select-fare-button"
                      >
                        {t('results.selectFare')}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {offers.length === 0 && (
            <AlertNote tone="neutral" visible>
              {t('common.loading')}
            </AlertNote>
          )}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div style={{
        width: '330px',
        flexShrink: 0,
        position: 'sticky',
        top: '16px',
        padding: '16px',
        display: 'none', // hidden on mobile via inline style; shown via media query
      }}
        className="results-sidebar"
      >
        <BookingSummary state={state} />
      </div>

      <style>{`
        @media (min-width: 768px) {
          .results-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
