import React, { useEffect, useState } from 'react';
import { useT } from '../i18n/index';
import { useAppState, useAppDispatch } from '../store';
import type { ScreenId } from '../types';
import type { NavigationState } from '../App';
import { HoldTimerBadge } from '../components/HoldTimerBadge';
import { sdk } from '../sdk';
import { formatPrice } from '../utils';

interface CheckoutScreenProps {
  navigate: (screen: ScreenId, extra?: Partial<NavigationState>) => void;
}

export function CheckoutScreen({ navigate }: CheckoutScreenProps) {
  const t = useT();
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [bookingKey, setBookingKey] = useState<string | null>(null);
  const [returnBookingKey, setReturnBookingKey] = useState<string | null>(null);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!state.outboundSession || !state.selectedOutboundFare) {
    navigate('search');
    return null;
  }

  const paxCount = state.adults + state.children;
  const infantSurcharge = state.infants > 0 ? 0.1 : 0;

  const outboundTicket = state.selectedOutboundFare.priceAmount * (1 + infantSurcharge);
  const returnTicket = state.selectedReturnFare
    ? state.selectedReturnFare.priceAmount * (1 + infantSurcharge)
    : 0;
  const ticketTotal = (outboundTicket + returnTicket) * paxCount;

  const serviceTotal =
    state.outboundAncillary.reduce((s, a) => s + a.priceAmount * a.quantity, 0) +
    state.returnAncillary.reduce((s, a) => s + a.priceAmount * a.quantity, 0);

  const seatTotal =
    state.outboundSeats.reduce((s, seat) => s + seat.price, 0) +
    state.returnSeats.reduce((s, seat) => s + seat.price, 0);

  const grandTotal = ticketTotal + serviceTotal + seatTotal;

  useEffect(() => {
    fetchBookingKey();
  }, []);

  async function fetchBookingKey() {
    setPayloadError(null);
    const res = await sdk.http.get<{ bookingKey: string; amount: number }>(
      `/sessions/${state.outboundSession!.sessionId}/payment-inquiry-payload`
    );
    if (res.isSuccess && res.data) {
      setBookingKey(res.data.bookingKey);
    } else {
      setPayloadError(t.checkout.payloadError);
    }

    if (state.tripType === 'roundTrip' && state.returnSession) {
      const retRes = await sdk.http.get<{ bookingKey: string; amount: number }>(
        `/sessions/${state.returnSession.sessionId}/payment-inquiry-payload`
      );
      if (retRes.isSuccess && retRes.data) {
        setReturnBookingKey(retRes.data.bookingKey);
      } else {
        setPayloadError(t.checkout.payloadError);
      }
    }
  }

  const canPay = !state.holdExpired && bookingKey !== null &&
    (state.tripType === 'oneWay' || returnBookingKey !== null) && !processing;

  async function handlePay() {
    if (!canPay) return;
    setProcessing(true);

    try {
      const outboundResult = await sdk.payment.startPayment({
        transactionType: 'booking',
        provider: 'VJA',
        sessionId: state.outboundSession!.sessionId,
        offerId: state.selectedOutboundOffer?.offerId ?? '',
      });

      if (outboundResult.status === 'cancelled') {
        setProcessing(false);
        return;
      }

      if (outboundResult.status === 'rejected') {
        dispatch({
          type: 'SET_BOOKING_RESULT',
          payload: {
            status: 'failure',
            bookingCode: generateBookingCode(),
            transactionId: null,
            amount: grandTotal,
            failureReason: 'Payment rejected by hub',
            viaHost: true,
            vatRequested: state.vatRequested,
          },
        });
        setProcessing(false);
        navigate('done-failure');
        return;
      }

      if (state.tripType === 'roundTrip' && state.returnSession && state.selectedReturnOffer) {
        const returnResult = await sdk.payment.startPayment({
          transactionType: 'booking',
          provider: 'VJA',
          sessionId: state.returnSession.sessionId,
          offerId: state.selectedReturnOffer.offerId,
        });

        if (returnResult.status !== 'success') {
          dispatch({
            type: 'SET_BOOKING_RESULT',
            payload: {
              status: 'partial',
              bookingCode: generateBookingCode(),
              outboundBookingCode: generateBookingCode(),
              transactionId: null,
              amount: grandTotal,
              viaHost: true,
              vatRequested: state.vatRequested,
            },
          });
          setProcessing(false);
          navigate('done-partial');
          return;
        }
      }

      let transactionId: string | null = null;
      try {
        const pollResult = await sdk.payment.polling(outboundResult.paymentSessionId);
        transactionId = pollResult.transactionId;
      } catch {
        /* swallow per BR-13 */
      }

      dispatch({
        type: 'SET_BOOKING_RESULT',
        payload: {
          status: 'success',
          bookingCode: generateBookingCode(),
          transactionId,
          amount: grandTotal,
          viaHost: true,
          vatRequested: state.vatRequested,
        },
      });
      setProcessing(false);
      navigate('done-success');
    } catch (err) {
      if (err instanceof Error && err.message === 'CAPABILITY_NOT_AVAILABLE') {
        dispatch({
          type: 'SET_BOOKING_RESULT',
          payload: {
            status: 'success',
            bookingCode: generateBookingCode(),
            transactionId: null,
            amount: grandTotal,
            viaHost: false,
            vatRequested: state.vatRequested,
          },
        });
        setProcessing(false);
        navigate('done-success');
      } else {
        dispatch({
          type: 'SET_BOOKING_RESULT',
          payload: {
            status: 'failure',
            bookingCode: generateBookingCode(),
            transactionId: null,
            amount: grandTotal,
            failureReason: err instanceof Error ? err.message : 'Unknown error',
            viaHost: true,
            vatRequested: state.vatRequested,
          },
        });
        setProcessing(false);
        navigate('done-failure');
      }
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-900">{t.checkout.heading}</h1>
      <HoldTimerBadge navigate={navigate} />

      <div className="border border-gray-200 rounded-lg p-4" data-testid="payment-breakdown">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">{t.checkout.subtotal}</span>
          <span className="text-sm" data-testid="subtotal-amount">{formatPrice(ticketTotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">{t.checkout.serviceFee}</span>
          <span className="text-sm" data-testid="service-fee-amount">{formatPrice(serviceTotal + seatTotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-700">{t.checkout.discount}</span>
          <span className="text-sm" data-testid="discount-amount">0</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-bold text-sm">{t.checkout.total}</span>
          <span className="font-bold text-sm" data-testid="total-amount" aria-label={formatPrice(grandTotal)}>
            {formatPrice(grandTotal)}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500" data-testid="merchant-label">{t.checkout.merchant}</p>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50"
          placeholder={t.checkout.discountCode}
          disabled
          aria-label={t.checkout.discountCode}
          data-testid="discount-input"
        />
        <button
          className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-400"
          disabled
          aria-label={t.checkout.apply}
          data-testid="apply-discount"
        >
          {t.checkout.apply}
        </button>
      </div>

      <p className="text-sm text-gray-600" data-testid="payment-source-display">{t.checkout.paymentSource}</p>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-red-600"
          checked={state.vatRequested}
          onChange={(e) => dispatch({ type: 'SET_VAT_REQUESTED', payload: e.target.checked })}
          aria-label={t.checkout.vatInvoice}
          data-testid="vat-checkbox"
        />
        <span className="text-sm text-gray-700">{t.checkout.vatInvoice}</span>
      </label>

      <p className="text-xs text-gray-400" data-testid="fine-print">{t.checkout.finePrint}</p>

      <button
        className={`w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors ${
          canPay ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
        }`}
        disabled={!canPay}
        onClick={handlePay}
        aria-label={t.checkout.payBtn}
        data-testid="pay-button"
      >
        {processing ? t.checkout.processing : t.checkout.payBtn}
      </button>

      {payloadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3" data-testid="payload-error-message">
          <p className="text-red-700 text-sm">{payloadError}</p>
          <button
            className="text-sm text-red-600 font-medium underline mt-1"
            onClick={fetchBookingKey}
            aria-label={t.common.retry}
          >
            {t.common.retry}
          </button>
        </div>
      )}
    </div>
  );
}

function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
