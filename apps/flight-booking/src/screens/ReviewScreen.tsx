import { useT } from '../i18n/index';
import { useAppState } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';
import { formatPrice } from '../utils';

interface ReviewScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

export function ReviewScreen({ navigate }: ReviewScreenProps) {
  const t = useT();
  const state = useAppState();
  if (!state.outboundSession || !state.selectedOutboundFare) { navigate('search'); return null; }

  const paxCount = state.adults + state.children;
  const infantSurcharge = state.infants > 0 ? 0.1 : 0;
  const outboundTicket = state.selectedOutboundFare.priceAmount * (1 + infantSurcharge);
  const returnTicket = state.selectedReturnFare ? state.selectedReturnFare.priceAmount * (1 + infantSurcharge) : 0;
  const ticketTotal = (outboundTicket + returnTicket) * paxCount;
  const serviceTotal = state.outboundAncillary.reduce((s, a) => s + a.priceAmount * a.quantity, 0) + state.returnAncillary.reduce((s, a) => s + a.priceAmount * a.quantity, 0);
  const seatTotal = state.outboundSeats.reduce((s, seat) => s + seat.price, 0) + state.returnSeats.reduce((s, seat) => s + seat.price, 0);
  const grandTotal = ticketTotal + serviceTotal + seatTotal;

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t.review.heading}</h1>
      <div className="border border-gray-200 rounded-lg p-4" data-testid="itinerary-header">
        <p className="text-xs text-gray-500" data-testid="trip-type-label">{state.tripType === 'roundTrip' ? t.search.roundTrip : t.search.oneWay}</p>
        <p className="font-bold text-sm text-gray-900" data-testid="route-label">{state.origin?.airportCode} {String.fromCharCode(8596)} {state.destination?.airportCode}</p>
        <p className="text-xs text-gray-500" data-testid="passenger-count-label">{t.review.passengers.replace('{count}', String(state.adults + state.children + state.infants))}</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4" data-testid="outbound-ticket">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.review.outbound}</h2>
        <div className="flex justify-between"><span className="font-bold text-sm" data-testid="departure-time">{state.selectedOutboundOffer?.departureTime}</span><span className="font-bold text-sm" data-testid="arrival-time">{state.selectedOutboundOffer?.arrivalTime}</span></div>
        <div className="flex justify-between"><span className="text-xs text-gray-500" data-testid="departure-airport">{state.origin?.airportCode}</span><span className="text-xs text-gray-500" data-testid="arrival-airport">{state.destination?.airportCode}</span></div>
        <p className="text-xs text-gray-500" data-testid="duration">{state.selectedOutboundOffer?.duration}</p>
        <p className="text-sm mt-1" data-testid="fare-class-label">{state.selectedOutboundFare.fareClassName}</p>
        <p className="text-sm" data-testid="fare-price-breakdown">{formatPrice(outboundTicket)} x {paxCount} = {formatPrice(outboundTicket * paxCount)}</p>
      </div>
      {state.tripType === 'roundTrip' && state.selectedReturnFare && state.selectedReturnOffer && (
        <div className="border border-gray-200 rounded-lg p-4" data-testid="return-ticket">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.review.return}</h2>
          <div className="flex justify-between"><span className="font-bold text-sm">{state.selectedReturnOffer.departureTime}</span><span className="font-bold text-sm">{state.selectedReturnOffer.arrivalTime}</span></div>
          <p className="text-sm mt-1">{state.selectedReturnFare.fareClassName}</p>
          <p className="text-sm">{formatPrice(returnTicket)} x {paxCount} = {formatPrice(returnTicket * paxCount)}</p>
        </div>
      )}
      <div className="border border-gray-200 rounded-lg p-4" data-testid="total-card">
        <h2 className="text-lg font-semibold text-gray-900">{t.review.total}</h2>
        <p className="text-2xl font-bold text-red-600" data-testid="total-amount" aria-label={formatPrice(grandTotal)}>{formatPrice(grandTotal)}</p>
      </div>
      <button className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors" onClick={() => navigate('checkout')} aria-label={t.review.continueToPayment} data-testid="review-continue">{t.review.continueToPayment}</button>
    </div>
  );
}
