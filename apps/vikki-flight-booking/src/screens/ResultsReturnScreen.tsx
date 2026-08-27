import React, { useState, useCallback } from 'react';
import { useI18n } from '../i18n';
import { useBooking, useHoldTimer } from '../context/BookingContext';
import { TopBar } from '../components/TopBar';
import { TripSummaryBanner } from '../components/TripSummaryBanner';
import { DateStrip } from '../components/DateStrip';
import { FlightCard } from '../components/FlightCard';
import { EmptyState } from '../components/EmptyState';
import { InlineError } from '../components/shared';
import { searchFlights } from '../api';

interface ResultsReturnScreenProps {
  onNavigate: (screen: 'passengers' | 'results' | 'hold-expired') => void;
}

export function ResultsReturnScreen({ onNavigate }: ResultsReturnScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const offers = state.returnSession?.offers ?? [];
  // Use earliest expiry between outbound and return sessions
  const outboundExpiry = state.outboundSession?.expiresAt ?? null;
  const returnExpiry = state.returnSession?.expiresAt ?? null;
  const earliestExpiry = (() => {
    if (!outboundExpiry) return returnExpiry;
    if (!returnExpiry) return outboundExpiry;
    return outboundExpiry < returnExpiry ? outboundExpiry : returnExpiry;
  })();

  const handleExpire = useCallback(() => {
    onNavigate('hold-expired');
  }, [onNavigate]);

  useHoldTimer(earliestExpiry, handleExpire);

  const handleBack = () => {
    onNavigate('results');
  };

  const handleDateSelect = async (newDate: string) => {
    if (!state.origin || !state.destination) return;
    setLoading(true);
    setError('');
    try {
      const response = await searchFlights({
        origin: state.destination.code,
        destination: state.origin.code,
        departureDate: newDate,
        adults: state.passengerCount.adults,
        children: state.passengerCount.children,
        infants: state.passengerCount.infants,
      });
      dispatch({ type: 'SET_RETURN_DATE', payload: newDate });
      dispatch({
        type: 'SET_RETURN_SESSION',
        payload: {
          sessionId: response.session_id,
          expiresAt: response.expires_at,
          offers: response.offers.map((o) => ({
            offerId: o.offer_id,
            airline: o.airline,
            airlineLogo: o.airline_logo,
            flightNumber: o.flight_number,
            departureTime: o.departure_time,
            arrivalTime: o.arrival_time,
            duration: o.duration,
            stops: o.stops,
            price: o.price_amount,
          })),
        },
      });
    } catch {
      setError(t('error.searchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (offerId: string) => {
    const offer = offers.find((o) => o.offerId === offerId);
    if (!offer) return;
    dispatch({ type: 'SELECT_RETURN_OFFER', payload: offer });
    onNavigate('passengers');
  };

  const passengerSummary = `${state.passengerCount.adults + state.passengerCount.children + state.passengerCount.infants} hk`;

  return (
    <div className="screen screen--results-return">
      <TopBar
        title={t('topbar.resultsReturn')}
        showBackArrow
        onBack={handleBack}
        ariaLabel={t('topbar.resultsReturn')}
      />

      <TripSummaryBanner
        origin={state.destination?.code ?? ''}
        destination={state.origin?.code ?? ''}
        date={state.returnDate}
        passengers={passengerSummary}
        ariaLabel={`${t('results.summaryLabel')}: ${state.destination?.code} ${state.origin?.code}`}
      />

      <DateStrip
        selectedDate={state.returnDate}
        range={3}
        onDateSelect={handleDateSelect}
        ariaLabel={t('results.dateStripReturnLabel')}
      />

      <div className="screen__scrollable">
        <InlineError visible={!!error}>{error}</InlineError>

        {loading && (
          <div className="loading-indicator" role="status" aria-label={t('results.loading')}>
            <span className="loading-indicator__spinner" />
            <span>{t('results.loading')}</span>
          </div>
        )}

        {!loading && offers.length === 0 && (
          <EmptyState message={t('results.emptyReturn')} ariaLabel={t('results.emptyAriaLabel')} />
        )}

        {!loading && offers.map((offer) => (
          <FlightCard
            key={offer.offerId}
            departureTime={offer.departureTime}
            arrivalTime={offer.arrivalTime}
            airline={offer.airline}
            airlineLogo={offer.airlineLogo}
            duration={offer.duration}
            stops={offer.stops}
            price={offer.price}
            onSelect={() => handleSelectFlight(offer.offerId)}
            ariaLabel={t('results.flightAriaLabel', {
              airline: offer.airline,
              departure: offer.departureTime,
              arrival: offer.arrivalTime,
              price: String(offer.price),
            })}
          />
        ))}
      </div>
    </div>
  );
}
