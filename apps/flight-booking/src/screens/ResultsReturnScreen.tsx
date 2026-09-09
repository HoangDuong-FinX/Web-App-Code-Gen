import { useState, useMemo } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId, FlightOffer, FareClass } from '../types';
import type { NavigationState } from '../App';
import { HoldTimerBadge } from '../components/HoldTimerBadge';
import { generateDateChips } from '../fixtures/flights';
import { formatPrice } from '../utils';

interface ResultsReturnScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

export function ResultsReturnScreen({ navigate }: ResultsReturnScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState(state.returnDate);
  const session = state.returnSession;
  const offers = session?.offers ?? [];
  const dateChips = useMemo(() => generateDateChips(state.returnDate), [state.returnDate]);

  if (!session) { navigate('search'); return null; }

  function handleFareSelect(offer: FlightOffer, fare: FareClass) {
    if (!fare.available) return;
    dispatch({ type: 'SELECT_RETURN_FARE', payload: { offer, fare } });
  }

  function handleContinue() {
    if (!state.selectedReturnFare) return;
    navigate('passengers');
  }

  const routeSummary = t.results.routeSummary.replace('{origin}', state.destination?.airportCode ?? '').replace('{destination}', state.origin?.airportCode ?? '').replace('{date}', selectedDate);

  return (
    <div className="p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-bold text-gray-900">{t.results.returnHeading}</h1>
      <p className="text-sm text-gray-600" data-testid="route-summary">{routeSummary}</p>
      <HoldTimerBadge navigate={navigate} />
      <div className="flex gap-2 overflow-x-auto pb-2" data-testid="date-strip">
        {dateChips.map((chip) => (<button key={chip.date} className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-lg border text-xs transition-colors ${chip.date === selectedDate ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`} onClick={() => setSelectedDate(chip.date)} aria-label={`${chip.label}, ${chip.lowestPrice !== null ? formatPrice(chip.lowestPrice) : ''}`} data-testid="date-chip"><span className="font-medium">{chip.label}</span>{chip.lowestPrice !== null && <span className="text-[10px] mt-0.5">{formatPrice(chip.lowestPrice)}</span>}</button>))}
      </div>
      {offers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8" data-testid="no-flights-state"><span className="text-4xl" aria-hidden="true">{String.fromCharCode(9992)}</span><p className="text-sm text-gray-500">{t.results.noFlights}</p></div>
      ) : (
        <div className="flex flex-col gap-3">
          {offers.map((offer) => (
            <div key={offer.offerId} className="border border-gray-200 rounded-lg p-4" data-testid="flight-card">
              <div className="flex justify-between items-center mb-2"><span className="font-bold text-sm text-gray-900" data-testid="flight-number">{offer.flightNumber}</span><span className="text-xs text-gray-500" data-testid="duration">{offer.duration}</span></div>
              <div className="flex justify-between mb-3"><span className="font-bold text-sm" data-testid="departure-time">{offer.departureTime}</span><span className="font-bold text-sm" data-testid="arrival-time">{offer.arrivalTime}</span></div>
              <div className="flex gap-2 flex-wrap">
                {offer.fareClasses.map((fare) => { const isSelected = state.selectedReturnOffer?.offerId === offer.offerId && state.selectedReturnFare?.fareClassName === fare.fareClassName; return (<button key={fare.fareClassName} className={`flex-1 min-w-0 py-2 px-2 rounded-lg border text-xs font-medium transition-colors ${!fare.available ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-gray-300 text-gray-700 hover:border-red-400'}`} disabled={!fare.available} onClick={() => handleFareSelect(offer, fare)} aria-label={t.results.farePerPax.replace('{fareClass}', fare.fareClassName).replace('{price}', formatPrice(fare.priceAmount))} data-testid="fare-class-option"><div>{fare.fareClassName}</div><div className="text-[10px] mt-0.5">{formatPrice(fare.priceAmount)}</div></button>); })}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors ${state.selectedReturnFare && !state.holdExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!state.selectedReturnFare || state.holdExpired} onClick={handleContinue} aria-label={t.results.continueToPassengers} data-testid="results-return-continue">{t.results.continueBtn}</button>
    </div>
  );
}
