import React, { useState, useEffect } from 'react';
import type { SearchSession, Flight, FareClass, TripType } from '../types';
import { t } from '../i18n/vi';
import { useHoldTimer } from '../hooks/useHoldTimer';

interface Props {
  outboundSession: SearchSession | null;
  returnSession: SearchSession | null;
  tripType: TripType;
  selectedOutboundOffer: FareClass | null;
  selectedReturnOffer: FareClass | null;
  expiresAt: string | null;
  onSelectOutbound: (offer: FareClass, flight: Flight) => void;
  onSelectReturn: (offer: FareClass, flight: Flight) => void;
  onContinue: () => void;
  onBack: () => void;
  onExpired: () => void;
}

type Direction = 'outbound' | 'return';

export function ResultsScreen({ outboundSession, returnSession, tripType, selectedOutboundOffer, selectedReturnOffer, expiresAt, onSelectOutbound, onSelectReturn, onContinue, onBack, onExpired }: Props) {
  const { display, isExpired } = useHoldTimer(expiresAt);
  const [direction, setDirection] = useState<Direction>('outbound');

  useEffect(() => { if (isExpired) onExpired(); }, [isExpired, onExpired]);

  const currentSession = direction === 'outbound' ? outboundSession : returnSession;
  const flights = currentSession?.offers ?? [];
  const canContinue = tripType === 'one-way' ? selectedOutboundOffer !== null : selectedOutboundOffer !== null && selectedReturnOffer !== null;

  const handleSelectFare = (offer: FareClass, flight: Flight) => {
    if (!offer.available) return;
    if (direction === 'outbound') {
      onSelectOutbound(offer, flight);
      if (tripType === 'round-trip' && returnSession) setDirection('return');
    } else {
      onSelectReturn(offer, flight);
    }
  };

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-3 bg-[#F9FBF9] sticky top-0 z-10">
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]" aria-label={t('results.back')} data-testid="back-action" onClick={onBack}>\u2190</button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#1A1A1A]">{direction === 'outbound' ? t('results.headingOutbound') : t('results.headingReturn')}</h1>
        <span className="text-sm font-semibold text-[#E12127]" aria-label={t('results.holdTimer.aria')} data-testid="hold-timer-display">{display}</span>
      </header>

      {tripType === 'round-trip' && (
        <div className="flex mx-4 mb-2 rounded-lg overflow-hidden border border-[#E6E8E7]">
          <button type="button" className={`flex-1 py-2 text-sm font-semibold text-center ${direction === 'outbound' ? 'bg-[#E12127] text-white' : 'bg-white text-[#1A1A1A]'}`} aria-label={t('services.direction.outbound')} aria-pressed={direction === 'outbound'} onClick={() => setDirection('outbound')}>{t('services.direction.outbound')}</button>
          <button type="button" className={`flex-1 py-2 text-sm font-semibold text-center ${direction === 'return' ? 'bg-[#E12127] text-white' : 'bg-white text-[#1A1A1A]'}`} aria-label={t('services.direction.return')} aria-pressed={direction === 'return'} onClick={() => setDirection('return')}>{t('services.direction.return')}</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {flights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16" data-testid="results-empty-state">
            <p className="text-lg font-semibold text-[#1A1A1A]">{t('results.empty.title')}</p>
            <p className="text-sm text-[#6B7280] mt-2 text-center">{t('results.empty.description')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {flights.map((flight) => (
              <div key={flight.flightNumber} className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4" data-testid="flight-card" aria-label={t('results.flightInfo.aria')}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-[#1A1A1A]" data-testid="flight-time-range">{flight.departureTime} - {flight.arrivalTime}</span>
                  <span className="text-sm text-[#6B7280]" data-testid="flight-duration">{flight.duration}</span>
                </div>
                <p className="text-sm text-[#6B7280] mb-3" data-testid="flight-airports">{flight.originCode} \u2192 {flight.destCode}</p>
                {flight.fareClasses.map((fare) => {
                  const isSelected = direction === 'outbound' ? selectedOutboundOffer?.offerId === fare.offerId : selectedReturnOffer?.offerId === fare.offerId;
                  return (
                    <button key={fare.offerId} type="button" className={`w-full flex justify-between items-center py-2 px-3 rounded-lg mb-1 transition-colors ${!fare.available ? 'opacity-50 cursor-not-allowed' : isSelected ? 'bg-red-50 border border-[#E12127]' : 'hover:bg-gray-50'}`} disabled={!fare.available} aria-label={`${fare.fareClassName} ${fare.available ? formatPrice(fare.priceAmount) : t('results.fareUnavailable')}`} onClick={() => handleSelectFare(fare, flight)}>
                      <span data-testid="fare-class-name">{fare.fareClassName}</span>
                      {fare.available ? (<span className="font-semibold text-[#E12127]" data-testid="fare-price-per-pax">{formatPrice(fare.priceAmount)}{t('results.perPassenger')}</span>) : (<span className="text-[#9CA3AF]" data-testid="fare-unavailable-indicator">{t('results.fareUnavailable')}</span>)}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <button type="button" className={`w-full h-14 rounded-lg text-white font-semibold text-base transition-colors ${canContinue ? 'bg-[#E12127] hover:bg-[#c91d22]' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!canContinue} aria-label={t('results.continue.aria')} data-testid="continue-action" onClick={onContinue}>{t('results.continue')}</button>
      </div>
    </div>
  );
}
