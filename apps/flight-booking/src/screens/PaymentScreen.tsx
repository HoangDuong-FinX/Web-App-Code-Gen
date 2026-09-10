import React from 'react';
import type { SearchCriteria, Flight, FareClass, AncillarySelection, SeatSelection } from '../types';
import { t } from '../i18n/vi';
import { computeBookingTotals } from '../hooks/useBookingTotals';

interface Props {
  searchCriteria: SearchCriteria;
  outboundFlight: Flight | null;
  returnFlight: Flight | null;
  outboundOffer: FareClass | null;
  returnOffer: FareClass | null;
  outboundAncillaries: AncillarySelection[];
  returnAncillaries: AncillarySelection[];
  outboundSeat: SeatSelection | null;
  returnSeat: SeatSelection | null;
  onContinue: () => void;
  onBack: () => void;
}

export function PaymentScreen({ searchCriteria, outboundFlight, returnFlight, outboundOffer, returnOffer, outboundAncillaries, returnAncillaries, outboundSeat, returnSeat, onContinue, onBack }: Props) {
  const totals = computeBookingTotals(outboundOffer, returnOffer, searchCriteria.adults, searchCriteria.children, outboundAncillaries, returnAncillaries, outboundSeat, returnSeat);
  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  const renderFlightCard = (title: string, flight: Flight | null, offer: FareClass | null, ancillaries: AncillarySelection[], seat: SeatSelection | null) => {
    if (!flight || !offer) return null;
    return (
      <div className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4">
        <h2 className="font-semibold text-base mb-2">{title}</h2>
        <div className="flex justify-between text-sm mb-1">
          <span data-testid="outbound-departure-time">{flight.departureTime}</span>
          <span data-testid="outbound-arrival-time">{flight.arrivalTime}</span>
          <span className="text-[#6B7280]" data-testid="outbound-duration">{flight.duration}</span>
        </div>
        <p className="text-sm text-[#6B7280] mb-2" data-testid="outbound-airports">{flight.originCode} \u2192 {flight.destCode}</p>
        <p className="text-sm" data-testid="outbound-fare-line">{t('payment.fareLineAdult', { n: String(searchCriteria.adults + searchCriteria.children) })}: {formatPrice(offer.priceAmount * (searchCriteria.adults + searchCriteria.children))}</p>
        {ancillaries.map((sel) => (
          <div key={sel.optionId} className="flex justify-between text-sm mt-1">
            <span data-testid="service-name">{sel.name} x{sel.quantity}</span>
            <span className="font-semibold" data-testid="service-price">{formatPrice(sel.priceAmount * sel.quantity)}</span>
          </div>
        ))}
        {seat && (
          <div className="flex justify-between text-sm mt-1">
            <span>{t('payment.total.seats')}: {seat.seatCode}</span>
            <span className="font-semibold">{formatPrice(seat.priceAmount)}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-3 bg-[#F9FBF9]">
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]" aria-label={t('payment.back')} data-testid="back-action" onClick={onBack}>\u2190</button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#1A1A1A]">{t('payment.title')}</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4" aria-label={t('payment.itinerary.aria')}>
          <h2 className="font-semibold text-base" data-testid="itinerary-header">{searchCriteria.origin?.code} \u2192 {searchCriteria.destination?.code}</h2>
          <p className="text-sm text-[#6B7280]" data-testid="itinerary-date">{searchCriteria.departureDate}{searchCriteria.tripType === 'round-trip' ? ` - ${searchCriteria.returnDate}` : ''}</p>
          <p className="text-sm text-[#6B7280]" data-testid="itinerary-airports">{searchCriteria.tripType === 'one-way' ? t('search.tripType.oneWay') : t('search.tripType.roundTrip')} | {searchCriteria.adults + searchCriteria.children + searchCriteria.infants} {t('search.passengerCount.adults')}</p>
        </div>

        {renderFlightCard(t('payment.outbound.title'), outboundFlight, outboundOffer, outboundAncillaries, outboundSeat)}
        {searchCriteria.tripType === 'round-trip' && renderFlightCard(t('payment.return.title'), returnFlight, returnOffer, returnAncillaries, returnSeat)}

        <div className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4" aria-label={t('payment.total.title')}>
          <h2 className="font-semibold text-base mb-3">{t('payment.total.title')}</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('payment.total.fare')}</span><span className="font-semibold" data-testid="total-fare-amount">{formatPrice(totals.fareTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('payment.total.services')}</span><span className="font-semibold" data-testid="total-services-amount">{formatPrice(totals.servicesTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('payment.total.seats')}</span><span className="font-semibold" data-testid="total-seats-amount">{formatPrice(totals.seatsTotal)}</span></div>
            <hr className="border-[#E6E8E7]" aria-hidden="true" />
            <div className="flex justify-between"><span className="font-bold text-lg">{t('payment.total.grand')}</span><span className="font-bold text-lg text-[#E12127]" data-testid="grand-total">{formatPrice(totals.grandTotal)}</span></div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button type="button" className="w-full h-14 bg-[#E12127] text-white rounded-lg font-semibold text-base hover:bg-[#c91d22]" aria-label={t('payment.continue.aria')} data-testid="payment-continue" onClick={onContinue}>{t('payment.continue')}</button>
      </div>
    </div>
  );
}
