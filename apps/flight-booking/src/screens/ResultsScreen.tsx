import React, { useState, useMemo } from 'react';
import type { BookingState, Flight, Fare, ScreenId } from '../types';
import type { BookingAction } from '../App';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';
import { useHoldTimer } from '../hooks/useHoldTimer';

interface ResultsScreenProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  expiresAt: string | null;
  onNavigate: (screen: ScreenId) => void;
}

export function ResultsScreen({ state, dispatch, expiresAt, onNavigate }: ResultsScreenProps) {
  const { formattedTime, isExpired } = useHoldTimer(expiresAt);
  const [selectingReturn, setSelectingReturn] = useState(false);

  const currentSession = selectingReturn ? state.returnSession : state.outboundSession;
  const offers = currentSession?.offers ?? [];

  const selectedOffer = selectingReturn ? state.selectedReturnOffer : state.selectedOutboundOffer;
  const selectedFare = selectingReturn ? state.selectedReturnFare : state.selectedOutboundFare;

  const dayStrip = useMemo(() => {
    const baseDate = new Date(state.departureDate || new Date().toISOString().split('T')[0]);
    const days: { label: string; date: string; hasFlights: boolean }[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        label: `${d.getDate()}/${d.getMonth() + 1}`,
        date: dateStr,
        hasFlights: i === 0,
      });
    }
    return days;
  }, [state.departureDate]);

  const handleSelectFare = (offer: Flight, fare: Fare) => {
    if (!fare.available || isExpired) return;
    if (selectingReturn) {
      dispatch({ type: 'SELECT_RETURN_OFFER', payload: { offer, fare } });
    } else {
      dispatch({ type: 'SELECT_OUTBOUND_OFFER', payload: { offer, fare } });
    }
  };

  const handleContinue = () => {
    if (isExpired) return;
    if (!selectingReturn && state.tripType === 'round-trip' && state.returnSession) {
      setSelectingReturn(true);
      return;
    }
    onNavigate('passengers');
  };

  const canContinue = selectingReturn
    ? !!state.selectedReturnFare
    : !!state.selectedOutboundFare;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900" data-testid="results-screen-title">
        {selectingReturn ? t('results.titleReturn') : t('results.title')}
      </h1>

      <p className="text-sm text-gray-500" aria-label={t('results.holdTimer')} data-testid="hold-timer-display">
        {t('results.holdTimer')}: {formattedTime}
      </p>

      {isExpired && (
        <div className="rounded-lg bg-yellow-50 p-3 text-yellow-700" aria-label={t('results.holdExpired')} data-testid="hold-expired-alert">
          <p>{t('results.holdExpired')}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-yellow-700 underline"
            onClick={() => onNavigate('search')}
            aria-label={t('results.searchAgainLabel')}
          >
            {t('results.searchAgain')}
          </button>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto pb-2">
        {dayStrip.map((day) => (
          <div
            key={day.date}
            className={`flex min-w-[60px] flex-col items-center rounded-lg p-2 text-center ${
              day.hasFlights ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
            }`}
          >
            <span className="text-xs font-bold" data-testid="day-label">{day.label}</span>
            <span className="text-[10px]" data-testid="day-lowest-fare">
              {day.hasFlights ? formatVND(1200000) : t('results.noFlightsDay')}
            </span>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-400" aria-label={t('results.noFlights')} data-testid="no-flights-empty-state">
          <p className="text-lg font-medium">{t('results.noFlights')}</p>
          <p className="text-sm">{t('results.noFlightsDesc')}</p>
        </div>
      )}

      {offers.map((offer) => (
        <div key={offer.offer_id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-gray-500" data-testid="flight-code-and-aircraft">
              {offer.flight_number} · {offer.aircraft}
            </span>
            <span className="font-bold text-gray-900" data-testid="departure-time-and-airport">
              {offer.departure_time}
            </span>
            <span className="text-xs text-gray-500" data-testid="flight-duration">
              {Math.floor(offer.duration_minutes / 60)}h{offer.duration_minutes % 60}m
            </span>
            <span className="font-bold text-gray-900" data-testid="arrival-time-and-airport">
              {offer.arrival_time}
            </span>
            <span className="text-xs text-gray-500" data-testid="stops-count">
              {offer.stops === 0 ? t('results.directFlight') : `${offer.stops} ${t('results.stops')}`}
            </span>
          </div>
          {offer.fares.map((fare) => (
            <button
              key={fare.fare_class}
              type="button"
              className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                !fare.available
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : selectedOffer?.offer_id === offer.offer_id && selectedFare?.fare_class === fare.fare_class
                  ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              disabled={!fare.available || isExpired}
              onClick={() => handleSelectFare(offer, fare)}
              aria-label={`${fare.fare_class} ${formatVND(fare.price_amount)}`}
            >
              <span className="text-sm" data-testid="fare-class-name">{fare.fare_class}</span>
              <span className="text-sm font-bold" data-testid="fare-price-per-passenger">
                {formatVND(fare.price_amount)}{t('results.perPassenger')}
              </span>
              {!fare.available && (
                <span className="rounded bg-gray-200 px-2 py-0.5 text-xs" data-testid="fare-unavailable-badge">
                  {t('results.soldOut')}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}

      <button
        type="button"
        className={`w-full rounded-lg py-3 text-center font-medium text-white transition-colors ${
          canContinue && !isExpired ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300'
        }`}
        disabled={!canContinue || isExpired}
        onClick={handleContinue}
        aria-label={t('results.continueLabel')}
        data-testid="continue-action"
      >
        {t('results.continue')}
      </button>
    </div>
  );
}