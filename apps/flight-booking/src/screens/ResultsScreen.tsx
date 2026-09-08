import { useEffect, useState } from 'react';
import type { SearchResult, SearchCriteria, Flight, FareClass, DayPrice } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';
import { useHoldTimer } from '../useHoldTimer';
import { fetchDayPrices } from '../sdk';

interface Props {
  searchResult: SearchResult | null;
  criteria: SearchCriteria;
  selectedOutboundFare: FareClass | null;
  selectedInboundFare: FareClass | null;
  onSelectFare: (flight: Flight, fare: FareClass, leg: 'outbound' | 'inbound') => void;
  onContinue: () => void;
  onBack: () => void;
  onHoldExpired: () => void;
}

export function ResultsScreen({
  searchResult, criteria, selectedOutboundFare, selectedInboundFare,
  onSelectFare, onContinue, onBack, onHoldExpired,
}: Props) {
  const expiresAt = searchResult?.outbound?.expiresAt ?? null;
  const { display: timerDisplay, expired } = useHoldTimer(expiresAt);
  const [dayPrices, setDayPrices] = useState<DayPrice[]>([]);
  const [activeLeg, setActiveLeg] = useState<'outbound' | 'inbound'>('outbound');

  const session = activeLeg === 'outbound' ? searchResult?.outbound : searchResult?.inbound;
  const flights = session?.flights ?? [];
  const isRoundTrip = criteria.tripType === 'round-trip';
  const fareSelected = isRoundTrip
    ? !!(selectedOutboundFare && selectedInboundFare)
    : !!selectedOutboundFare;

  useEffect(() => {
    if (session?.sessionId) {
      fetchDayPrices(session.sessionId).then((res) => {
        if (res.isSuccess && res.data) setDayPrices(res.data);
      });
    }
  }, [session?.sessionId]);

  useEffect(() => {
    if (expired) onHoldExpired();
  }, [expired, onHoldExpired]);

  const headingText = criteria.origin && criteria.destination
    ? `${criteria.origin.code} \u2192 ${criteria.destination.code}`
    : '';

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#F9FBF9] px-4 py-3 flex items-center gap-3">
          <button type="button" aria-label={t('results.back.aria')} className="w-8 h-8 flex items-center justify-center text-xl" onClick={onBack}>
            \u2190
          </button>
          <h1 className="flex-1 text-center text-xl font-medium text-[#191919]">{headingText}</h1>
        </header>

        {/* Timer */}
        <p data-testid="hold-timer" aria-live="polite" className="text-sm text-[#E12127] text-center py-2">{timerDisplay}</p>

        {/* Round trip leg selector */}
        {isRoundTrip && (
          <div className="flex mx-4 rounded-full border border-[#E6E8E7] overflow-hidden mb-2">
            <button type="button" className={`flex-1 py-2 text-sm font-medium ${activeLeg === 'outbound' ? 'bg-[#E12127] text-white' : 'text-[#999999]'}`} onClick={() => setActiveLeg('outbound')}>
              {t('seatSelection.outbound')}
            </button>
            <button type="button" className={`flex-1 py-2 text-sm font-medium ${activeLeg === 'inbound' ? 'bg-[#E12127] text-white' : 'text-[#999999]'}`} onClick={() => setActiveLeg('inbound')}>
              {t('seatSelection.return')}
            </button>
          </div>
        )}

        {/* Day strip */}
        <div className="flex overflow-x-auto gap-0 px-4 py-2" aria-label={t('results.dayStrip.aria')}>
          {dayPrices.map((dp) => (
            <button
              key={dp.date}
              type="button"
              data-testid="day-cell"
              aria-label={`${dp.date}${dp.price ? ' - ' + formatPrice(dp.price) : ''}`}
              disabled={!dp.hasFlights}
              className={`px-3 py-2 text-center rounded-lg shrink-0 ${dp.date === criteria.departureDate ? 'bg-[#E12127] text-white' : 'text-[#191919] hover:bg-gray-100'} ${!dp.hasFlights ? 'opacity-40' : ''}`}
            >
              <span className="text-xs block">{dp.date.slice(5)}</span>
              {dp.price !== null && <span className="text-xs block text-[#E12127]">{(dp.price / 1000).toFixed(0)}k</span>}
            </button>
          ))}
        </div>

        {/* Flights */}
        {flights.length === 0 ? (
          <div data-testid="empty-state" className="p-8 text-center">
            <p className="text-base text-[#555555]">{t('results.emptyState.title')}</p>
            <p className="text-sm text-[#999999] mt-1">{t('results.emptyState.subtitle')}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {flights.map((flight) => (
              <div key={flight.flightCode} className="px-4 py-4 border-b border-[#E6E8E7]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-[#191919]">{flight.flightCode}</span>
                  <span className="text-xs text-[#999999]">{flight.aircraftType}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-medium">{flight.departureTime} {flight.departureAirport}</span>
                  <span className="text-xs text-[#999999] text-center">{flight.duration}</span>
                  <span className="text-base font-medium text-right">{flight.arrivalTime} {flight.arrivalAirport}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {flight.fareClasses.map((fare) => {
                    const isSelected = activeLeg === 'outbound'
                      ? selectedOutboundFare?.classId === fare.classId
                      : selectedInboundFare?.classId === fare.classId;
                    return (
                      <button
                        key={fare.classId}
                        type="button"
                        data-testid="fare-class-cell"
                        aria-label={`${fare.className} - ${formatPrice(fare.price)}`}
                        disabled={fare.soldOut}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          isSelected ? 'border-[#E12127] bg-[#E12127]/10 text-[#E12127]' :
                          fare.soldOut ? 'border-[#E6E8E7] opacity-40 cursor-not-allowed' :
                          'border-[#E6E8E7] hover:border-[#E12127]'
                        }`}
                        onClick={() => !fare.soldOut && onSelectFare(flight, fare, activeLeg)}
                      >
                        <span className="block font-medium">{fare.className}</span>
                        <span className="block text-xs">{fare.soldOut ? t('results.fareUnavailable') : formatPrice(fare.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hold expired */}
        {expired && (
          <div data-testid="hold-expired-alert" aria-label={t('results.holdExpired.aria')} className="mx-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm">{t('results.holdExpired')}</p>
            <button type="button" aria-label={t('results.holdExpired.searchAgain.aria')} className="text-sm text-[#E12127] font-medium mt-1" onClick={onHoldExpired}>
              {t('results.holdExpired.searchAgain')}
            </button>
          </div>
        )}

        {/* Continue */}
        {fareSelected && !expired && (
          <div className="p-4">
            <button
              type="button"
              data-testid="continue-action"
              aria-label={t('results.continue.aria')}
              className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium"
              onClick={onContinue}
            >
              {t('results.continue')}
            </button>
          </div>
        )}
      </div>

      {/* Desktop sidebar summary */}
      <aside className="hidden md:flex flex-col w-[330px] sticky top-0 p-4 gap-2 bg-white" aria-label={t('results.summary.aria')}>
        <p className="font-semibold">{headingText}</p>
        <p className="text-sm text-[#555555]">{criteria.tripType === 'round-trip' ? t('search.tripType.roundTrip') : t('search.tripType.oneWay')}</p>
        <p className="text-sm text-[#555555]">{t('search.passengers.summary', { adults: criteria.passengers.adults, children: criteria.passengers.children, infants: criteria.passengers.infants })}</p>
        <hr className="border-[#E6E8E7]" />
        <p className="text-sm">{t('results.summary.ticketPrice', { price: selectedOutboundFare ? formatPrice(selectedOutboundFare.price) : '0 VND' })}</p>
        <p className="text-sm">{t('results.summary.servicesPrice', { price: '0 VND' })}</p>
        <p className="text-sm">{t('results.summary.seatsPrice', { price: '0 VND' })}</p>
        <hr className="border-[#E6E8E7]" />
        <p className="text-lg font-bold text-[#E12127]">{t('results.summary.total', { price: selectedOutboundFare ? formatPrice(selectedOutboundFare.price) : '0 VND' })}</p>
      </aside>
    </div>
  );
}
