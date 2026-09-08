import { useState, useEffect } from 'react';
import type { BookingState, PaymentPayload, PaymentResult } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';
import { useHoldTimer } from '../useHoldTimer';
import { fetchPaymentPayload, startPayment } from '../sdk';

interface Props {
  booking: BookingState;
  onUpdateBooking: (partial: Partial<BookingState>) => void;
  onPayloadFetched: (payload: PaymentPayload, inboundPayload: PaymentPayload | null) => void;
  onPaymentDone: (result: PaymentResult, inboundResult: PaymentResult | null) => void;
  onBack: () => void;
  onHoldExpired: () => void;
}

export function CheckoutScreen({ booking, onUpdateBooking, onPayloadFetched, onPaymentDone, onBack, onHoldExpired }: Props) {
  const expiresAt = booking.searchResult?.outbound?.expiresAt ?? null;
  const { display: timerDisplay, expired } = useHoldTimer(expiresAt);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isRoundTrip = booking.searchCriteria.tripType === 'round-trip';

  useEffect(() => {
    if (expired) onHoldExpired();
  }, [expired, onHoldExpired]);

  useEffect(() => {
    if (booking.paymentPayload) return;
    const doFetch = async () => {
      setPayloadError(null);
      const outSession = booking.searchResult?.outbound?.sessionId;
      if (!outSession) return;
      const res = await fetchPaymentPayload(outSession);
      if (res.isSuccess && res.data) {
        let inboundPayload: PaymentPayload | null = null;
        if (isRoundTrip && booking.searchResult?.inbound?.sessionId) {
          const inRes = await fetchPaymentPayload(booking.searchResult.inbound.sessionId);
          if (inRes.isSuccess && inRes.data) {
            inboundPayload = inRes.data;
          }
        }
        onPayloadFetched(res.data, inboundPayload);
      } else {
        setPayloadError(res.errorMessage ?? 'Error');
      }
    };
    doFetch();
  }, [booking.paymentPayload, booking.searchResult, isRoundTrip, onPayloadFetched]);

  const outboundFare = booking.selectedOutboundFare;
  const inboundFare = booking.selectedInboundFare;
  const adultCount = booking.searchCriteria.passengers.adults;
  const ticketSubtotal = (outboundFare?.price ?? 0) * adultCount + (inboundFare?.price ?? 0) * adultCount;
  const servicesSubtotal = booking.ancillarySelections.reduce((sum, sel) => {
    const opt = booking.ancillaryOptions.find((o) => o.optionId === sel.optionId);
    return sum + (opt?.price ?? 0) * sel.quantity;
  }, 0);
  const seatsSubtotal = [...booking.seatSelections, ...booking.inboundSeatSelections].reduce((sum, s) => sum + s.price, 0);
  const total = ticketSubtotal + servicesSubtotal + seatsSubtotal;

  const handlePay = async () => {
    if (!booking.paymentPayload) return;
    setIsProcessing(true);

    const outResult = await startPayment(
      booking.paymentPayload.bookingKey,
      booking.paymentPayload.amount,
      booking.paymentPayload.currency,
    );

    if (outResult.outcome === 'cancelled') {
      setIsProcessing(false);
      return;
    }

    if (isRoundTrip && booking.inboundPaymentPayload && outResult.outcome === 'success') {
      const inResult = await startPayment(
        booking.inboundPaymentPayload.bookingKey,
        booking.inboundPaymentPayload.amount,
        booking.inboundPaymentPayload.currency,
      );
      setIsProcessing(false);
      onPaymentDone(outResult, inResult);
    } else {
      setIsProcessing(false);
      onPaymentDone(outResult, null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#F9FBF9] px-4 py-3 flex items-center gap-3">
        <button type="button" aria-label={t('checkout.back.aria')} className="w-8 h-8 flex items-center justify-center text-xl" onClick={onBack}>
          \u2190
        </button>
        <h1 className="flex-1 text-center text-xl font-medium text-[#191919]">{t('checkout.title')}</h1>
      </header>

      <p data-testid="hold-timer" aria-live="polite" className="text-sm text-[#E12127] text-center py-2">{timerDisplay}</p>

      <div className="px-4 flex flex-col gap-4 flex-1">
        <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-[#555555]">{t('checkout.ticketSubtotal')}</span>
            <span className="text-sm">{formatPrice(ticketSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-[#555555]">{t('checkout.servicesFee')}</span>
            <span className="text-sm">{formatPrice(servicesSubtotal + seatsSubtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#555555]">{t('checkout.promoCode.label')}</span>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                data-testid="promo-code-input"
                aria-label={t('checkout.promoCode.aria')}
                placeholder={t('checkout.promoCode.placeholder')}
                disabled
                className="w-24 border border-[#E6E8E7] rounded-lg px-2 py-1 text-sm disabled:opacity-50"
              />
              <button type="button" aria-label={t('checkout.promoCode.apply.aria')} disabled className="text-sm text-[#E12127] font-medium disabled:opacity-50">
                {t('checkout.promoCode.apply')}
              </button>
            </div>
          </div>
          <hr className="border-[#E6E8E7]" />
          <div className="flex justify-between">
            <span className="text-base font-bold">{t('checkout.total')}</span>
            <span className="text-base font-bold text-[#E12127]">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-1">
          <p className="text-sm font-semibold">{t('checkout.merchantName')}</p>
          <p className="text-sm text-[#555555]">{t('checkout.merchantDesc')}</p>
        </div>

        <div className="flex justify-between px-4">
          <span className="text-sm text-[#555555]">{t('checkout.paymentSource')}</span>
          <span className="text-sm" data-testid="payment-source-display">{t('checkout.paymentSourceValue')}</span>
        </div>

        <label className="flex items-center gap-3 px-4 cursor-pointer" data-testid="vat-checkbox">
          <input
            type="checkbox"
            checked={booking.vatRequested}
            onChange={(e) => onUpdateBooking({ vatRequested: e.target.checked })}
            className="w-5 h-5 accent-[#E12127]"
            aria-label={t('checkout.vatCheckbox.aria')}
          />
          <span className="text-sm">{t('checkout.vatCheckbox')}</span>
        </label>

        <p className="text-xs text-[#999999] px-4" data-testid="fine-print">{t('checkout.finePrint')}</p>

        {payloadError && (
          <div data-testid="payload-error" aria-label={t('checkout.payloadError.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-[#555555]">{payloadError}</p>
          </div>
        )}
        {expired && (
          <div data-testid="hold-expired-alert" aria-label={t('checkout.holdExpired.aria')} className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm">{t('checkout.holdExpired')}</p>
          </div>
        )}
      </div>

      <div className="p-4">
        <button
          type="button"
          data-testid="pay-action"
          aria-label={t('checkout.payAction.aria')}
          disabled={expired || !booking.paymentPayload || isProcessing}
          className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium disabled:opacity-50"
          onClick={handlePay}
        >
          {isProcessing ? t('common.loading') : t('checkout.payAction')}
        </button>
      </div>
    </div>
  );
}
