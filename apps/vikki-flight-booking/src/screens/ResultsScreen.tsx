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
import type { ScreenId } from '../types';

interface ResultsScreenProps {
  onNavigate: (screen: 'results-return' | 'passengers' | 'hold-expired' | 'search') => void;
}

export function ResultsScreen({ onNavigate }: ResultsScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const offers = state.outboundSession?.offers ?? [];
  const expiresAt = state.outboundSession?.expiresAt ?? null;

  const handleExpire = useCallback(() => {
    onNavigate('hold-expired');
  }, [onNavigate]);

  const remainingSeconds = useHoldTimer(expiresAt, handleExpire);

  const handleBack = () => {
    onNavigate('search');
  };

  const handleDateSelect = async (newDate: string) => {
    if (!state.origin || !state.destination) return;
    setLoading(true);
    setError('');
    try {
      const response = await searchFlights({
        origin: state.origin.code,
        destination: state.destination.code,
        departureDate: newDate,
        adults: state.passengerCount.adults,
        children: state.passengerCount.children,
        infants: state.passengerCount.infants,
      });
      dispatch({ type: 'SET_DEPARTURE_DATE', payload: newDate });
      dispatch({
        type: 'SET_OUTBOUND_SESSION',
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

  const handleSelectFlight = async (offerId: string) => {
    const offer = offers.find((o) => o.offerId === offerId);
    if (!offer) return;
    dispatch({ type: 'SELECT_OUTBOUND_OFFER', payload: offer });

    if (state.tripType === 'round') {
      // Search for return flights
      if (!state.origin || !state.destination || !state.returnDate) return;
      setLoading(true);
      setError('');
      try {
        const response = await searchFlights({
          origin: state.destination.code,
          destination: state.origin.code,
          departureDate: state.returnDate,
          adults: state.passengerCount.adults,
          children: state.passengerCount.children,
          infants: state.passengerCount.infants,
        });
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
        onNavigate('results-return');
      } catch {
        setError(t('error.searchFailed'));
      } finally {
        setLoading(false);
      }
    } else {
      onNavigate('passengers');
    }
  };

  const passengerSummary = `${state.passengerCount.adults + state.passengerCount.children + state.passengerCount.infants} hk`;

  return (
    <div className="screen screen--results">
      <TopBar
        title={t('topbar.results')}
        showBackArrow
        onBack={handleBack}
        ariaLabel={t('topbar.results')}
      />

      <TripSummaryBanner
        origin={state.origin?.code ?? ''}
        destination={state.destination?.code ?? ''}
        date={state.departureDate}
        passengers={passengerSummary}
        ariaLabel={t('results.summaryLabel')}
      />

      <DateStrip
        selectedDate={state.departureDate}
        range={3}
        onDateSelect={handleDateSelect}
        ariaLabel={t('results.dateStripLabel')}
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
          <EmptyState message={t('results.empty')} ariaLabel={t('results.emptyAriaLabel')} />
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
