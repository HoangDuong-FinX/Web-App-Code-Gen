import React from 'react';
import type { BookingState, ScreenId } from '../types';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';

interface PaymentReviewScreenProps {
  state: BookingState;
  computeTotal: () => number;
  onNavigate: (screen: ScreenId) => void;
}

export function PaymentReviewScreen({ state, computeTotal, onNavigate }: PaymentReviewScreenProps) {
  const total = computeTotal();
  const outPrice = state.selectedOutboundFare?.price_amount ?? 0;
  const retPrice = state.selectedReturnFare?.price_amount ?? 0;
  const paxCount = state.adults + state.children;
  let ticketSubtotal = (outPrice + retPrice) * paxCount;
  if (state.infants > 0) {
    ticketSubtotal = Math.round(ticketSubtotal * 1.1);
  }
  const seatsCost = (state.outboundSeatSelection?.price ?? 0) + (state.returnSeatSelection?.price ?? 0);
  const servicesCost = total - ticketSubtotal - seatsCost;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('review.title')}</h1>

      <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
        <p className="font-bold text-gray-900" data-testid="route-summary">
          {state.origin?.code} \u2192 {state.destination?.code}
        </p>
        <p className="text-sm text-gray-500" data-testid="trip-type-label">
          {state.tripType === 'round-trip' ? t('search.tripRoundTrip') : t('search.tripOneWay')}
        </p>
        <p className="text-sm text-gray-500" data-testid="passenger-count-summary">
          {state.adults} {t('passengers.adult')}
          {state.children > 0 ? `, ${state.children} ${t('passengers.child')}` : ''}
          {state.infants > 0 ? `, ${state.infants} ${t('passengers.infant')}` : ''}
        </p>
      </div>

      {state.selectedOutboundOffer && (
        <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
          <h3 className="font-semibold text-gray-900">{t('review.outbound')}</h3>
          <p className="text-sm text-gray-700" data-testid="outbound-departure">
            {state.selectedOutboundOffer.departure_time} {state.origin?.code}
          </p>
          <p className="text-sm text-gray-700" data-testid="outbound-arrival">
            {state.selectedOutboundOffer.arrival_time} {state.destination?.code}
          </p>
          <p className="text-xs text-gray-500" data-testid="outbound-duration">
            {Math.floor(state.selectedOutboundOffer.duration_minutes / 60)}h{state.selectedOutboundOffer.duration_minutes % 60}m
          </p>
          <p className="text-sm text-gray-700" data-testid="outbound-ticket-price-line">
            {t('review.adultTicket')} x{paxCount} = {formatVND(outPrice * paxCount)}
          </p>
          {state.outboundSeatSelection && (
            <p className="text-sm text-gray-700" data-testid="outbound-seat-line-item">
              {t('review.seats')}: {state.outboundSeatSelection.seat_label} ({formatVND(state.outboundSeatSelection.price)})
            </p>
          )}
        </div>
      )}

      {state.tripType === 'round-trip' && state.selectedReturnOffer && (
        <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
          <h3 className="font-semibold text-gray-900">{t('review.return')}</h3>
          <p className="text-sm text-gray-700" data-testid="return-departure">
            {state.selectedReturnOffer.departure_time} {state.destination?.code}
          </p>
          <p className="text-sm text-gray-700" data-testid="return-arrival">
            {state.selectedReturnOffer.arrival_time} {state.origin?.code}
          </p>
          <p className="text-xs text-gray-500" data-testid="return-duration">
            {Math.floor(state.selectedReturnOffer.duration_minutes / 60)}h{state.selectedReturnOffer.duration_minutes % 60}m
          </p>
          <p className="text-sm text-gray-700" data-testid="return-ticket-price-line">
            {t('review.adultTicket')} x{paxCount} = {formatVND(retPrice * paxCount)}
          </p>
          {state.returnSeatSelection && (
            <p className="text-sm text-gray-700" data-testid="return-seat-line-item">
              {t('review.seats')}: {state.returnSeatSelection.seat_label} ({formatVND(state.returnSeatSelection.price)})
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-700">{t('review.ticketPrice')}</span>
          <span className="text-sm text-gray-700" data-testid="ticket-subtotal">{formatVND(ticketSubtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700">{t('review.services')}</span>
          <span className="text-sm text-gray-700" data-testid="services-subtotal">{formatVND(servicesCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700">{t('review.seats')}</span>
          <span className="text-sm text-gray-700" data-testid="seats-subtotal">{formatVND(seatsCost)}</span>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between">
          <span className="font-bold text-gray-900">{t('review.total')}</span>
          <span className="font-bold text-gray-900" data-testid="grand-total">{formatVND(total)}</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-lg bg-red-500 py-3 text-center font-medium text-white hover:bg-red-600"
        onClick={() => onNavigate('checkout')}
        aria-label={t('review.continueLabel')}
        data-testid="continue-action"
      >
        {t('review.continue')}
      </button>
    </div>
  );
}