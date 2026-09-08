import { useEffect } from 'react';
import type { BookingState } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';
import { useHoldTimer } from '../useHoldTimer';

interface Props {
  booking: BookingState;
  onContinue: () => void;
  onBack: () => void;
  onHoldExpired: () => void;
}

export function PaymentReviewScreen({ booking, onContinue, onBack, onHoldExpired }: Props) {
  const expiresAt = booking.searchResult?.outbound?.expiresAt ?? null;
  const { display: timerDisplay, expired } = useHoldTimer(expiresAt);
  const isRoundTrip = booking.searchCriteria.tripType === 'round-trip';

  useEffect(() => {
    if (expired) onHoldExpired();
  }, [expired, onHoldExpired]);

  const outboundFare = booking.selectedOutboundFare;
  const inboundFare = booking.selectedInboundFare;
  const outFlight = booking.selectedOutboundFlight;
  const inFlight = booking.selectedInboundFlight;

  const adultCount = booking.searchCriteria.passengers.adults;
  const ticketSubtotal = (outboundFare?.price ?? 0) * adultCount + (inboundFare?.price ?? 0) * adultCount;
  const servicesSubtotal = booking.ancillarySelections.reduce((sum, sel) => {
    const opt = booking.ancillaryOptions.find((o) => o.optionId === sel.optionId);
    return sum + (opt?.price ?? 0) * sel.quantity;
  }, 0);
  const seatsSubtotal = [...booking.seatSelections, ...booking.inboundSeatSelections].reduce((sum, s) => sum + s.price, 0);
  const grandTotal = ticketSubtotal + servicesSubtotal + seatsSubtotal;

  const routeSummary = booking.searchCriteria.origin && booking.searchCriteria.destination
    ? `${booking.searchCriteria.origin.code} \u2192 ${booking.searchCriteria.destination.code}`
    : '';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#F9FBF9] px-4 py-3 flex items-center gap-3">
        <button type="button" aria-label={t('paymentReview.back.aria')} className="w-8 h-8 flex items-center justify-center text-xl" onClick={onBack}>
          \u2190
        </button>
        <h1 className="flex-1 text-center text-xl font-medium text-[#191919]">{t('paymentReview.title')}</h1>
      </header>

      <p data-testid="hold-timer" aria-live="polite" className="text-sm text-[#E12127] text-center py-2">{timerDisplay}</p>

      <div className="px-4 flex flex-col gap-4 flex-1">
        {/* Route summary */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-1">
          <p className="text-base font-semibold text-[#191919]">{routeSummary}</p>
          <p className="text-sm text-[#555555]">{isRoundTrip ? t('search.tripType.roundTrip') : t('search.tripType.oneWay')}</p>
          <p className="text-sm text-[#555555]">
            {t('search.passengers.summary', {
              adults: booking.searchCriteria.passengers.adults,
              children: booking.searchCriteria.passengers.children,
              infants: booking.searchCriteria.passengers.infants,
            })}
          </p>
        </div>

        {/* Outbound */}
        {outFlight && outboundFare && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
            <h3 className="text-base font-semibold">{t('paymentReview.outbound.heading')}</h3>
            <p className="text-sm">{outFlight.departureTime} - {outFlight.arrivalTime}</p>
            <p className="text-sm text-[#555555]">{outFlight.departureAirport} \u2192 {outFlight.arrivalAirport}</p>
            <p className="text-sm text-[#999999]">{outFlight.duration}</p>
            <p className="text-sm">{t('paymentReview.adultPrice', { count: adultCount, price: formatPrice(outboundFare.price) })}</p>
          </div>
        )}

        {/* Inbound */}
        {isRoundTrip && inFlight && inboundFare && (
          <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
            <h3 className="text-base font-semibold">{t('paymentReview.return.heading')}</h3>
            <p className="text-sm">{inFlight.departureTime} - {inFlight.arrivalTime}</p>
            <p className="text-sm text-[#555555]">{inFlight.departureAirport} \u2192 {inFlight.arrivalAirport}</p>
            <p className="text-sm text-[#999999]">{inFlight.duration}</p>
            <p className="text-sm">{t('paymentReview.adultPrice', { count: adultCount, price: formatPrice(inboundFare.price) })}</p>
          </div>
        )}

        {/* Totals */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-1">
          <p className="text-sm">{t('paymentReview.ticketSubtotal', { price: formatPrice(ticketSubtotal) })}</p>
          <p className="text-sm">{t('paymentReview.servicesSubtotal', { price: formatPrice(servicesSubtotal + seatsSubtotal) })}</p>
          <hr className="border-[#E6E8E7] my-1" />
          <p className="text-lg font-bold text-[#E12127]">{t('paymentReview.total', { price: formatPrice(grandTotal) })}</p>
        </div>

        {expired && (
          <div data-testid="hold-expired-alert" aria-label={t('paymentReview.holdExpired.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm">{t('paymentReview.holdExpired')}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          type="button"
          data-testid="continue-action"
          aria-label={t('paymentReview.continue.aria')}
          disabled={expired}
          className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium disabled:opacity-50"
          onClick={onContinue}
        >
          {t('paymentReview.continue')}
        </button>
      </div>
    </div>
  );
}
