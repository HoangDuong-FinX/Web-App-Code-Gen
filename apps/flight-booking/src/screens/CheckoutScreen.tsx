import React, { useState, useEffect } from 'react';
import type { BookingState, ScreenId, DoneStatus } from '../types';
import type { BookingAction } from '../App';
import { t } from '../i18n/vi';
import { formatVND } from '../utils/formatCurrency';
import { useHoldTimer } from '../hooks/useHoldTimer';
import { loadPaymentPayloadFixture } from '../fixtures/paymentPayload';

interface CheckoutScreenProps {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  expiresAt: string | null;
  computeTotal: () => number;
  onNavigate: (screen: ScreenId) => void;
}

export function CheckoutScreen({ state, dispatch, expiresAt, computeTotal, onNavigate }: CheckoutScreenProps) {
  const { formattedTime, isExpired } = useHoldTimer(expiresAt);
  const [bookingKey, setBookingKey] = useState('');
  const [payloadError, setPayloadError] = useState(false);
  const [noBookingKey, setNoBookingKey] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [vatChecked, setVatChecked] = useState(false);

  const total = computeTotal();
  const outPrice = state.selectedOutboundFare?.price_amount ?? 0;
  const retPrice = state.selectedReturnFare?.price_amount ?? 0;
  const paxCount = state.adults + state.children;
  let ticketSubtotal = (outPrice + retPrice) * paxCount;
  if (state.infants > 0) {
    ticketSubtotal = Math.round(ticketSubtotal * 1.1);
  }
  const seatsCost = (state.outboundSeatSelection?.price ?? 0) + (state.returnSeatSelection?.price ?? 0);
  const serviceFee = total - ticketSubtotal;

  const loadPayload = async () => {
    setPayloadError(false);
    setNoBookingKey(false);
    try {
      const payload = await loadPaymentPayloadFixture(total);
      if (!payload.bookingKey) {
        setNoBookingKey(true);
        return;
      }
      setBookingKey(payload.bookingKey);
    } catch {
      setPayloadError(true);
    }
  };

  useEffect(() => {
    loadPayload();
  }, []);

  const canPay = !!bookingKey && !isExpired && !processing && !payloadError && !noBookingKey;

  const handlePay = async () => {
    if (!canPay) return;
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const bookingCode = 'VJ' + Date.now().toString(36).toUpperCase().slice(0, 6);
      const transactionId = 'TXN' + Date.now().toString(36).toUpperCase();
      const doneStatus: DoneStatus = 'success';
      dispatch({
        type: 'SET_DONE',
        payload: {
          status: doneStatus,
          bookingCode,
          transactionId,
          paymentError: '',
          totalAmount: total,
        },
      });
      onNavigate('done');
    } catch {
      dispatch({
        type: 'SET_DONE',
        payload: {
          status: 'failure',
          bookingCode: '',
          transactionId: '',
          paymentError: t('done.failedHint'),
          totalAmount: total,
        },
      });
      onNavigate('done');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('checkout.title')}</h1>

      <p className="text-sm text-gray-500" aria-label={t('common.holdTimerLabel')} data-testid="hold-timer-display">
        {t('common.holdTimerLabel')}: {formattedTime}
      </p>

      {isExpired && (
        <div className="rounded-lg bg-yellow-50 p-3 text-yellow-700" aria-label={t('common.holdExpired')} data-testid="hold-expired-alert">
          <p>{t('common.holdExpired')}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-yellow-700 underline"
            onClick={() => onNavigate('search')}
            aria-label={t('common.backToSearchLabel')}
          >
            {t('common.backToSearch')}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
        <p className="font-bold text-gray-900" data-testid="merchant-info">{t('checkout.merchant')}</p>
        <p className="text-sm text-gray-500">{t('checkout.merchantDesc')}</p>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700">{t('checkout.ticketPrice')}</span>
          <span className="text-sm text-gray-700" data-testid="subtotal-line">{formatVND(ticketSubtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700">{t('checkout.serviceFee')}</span>
          <span className="text-sm text-gray-700" data-testid="service-fee-line">{formatVND(serviceFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-700">{t('checkout.discount')}</span>
          <span className="text-sm text-gray-700" data-testid="promo-discount-line">{t('checkout.discountValue')}</span>
        </div>
        <hr className="border-gray-300" />
        <div className="flex justify-between">
          <span className="font-bold text-gray-900">{t('checkout.total')}</span>
          <span className="font-bold text-gray-900" data-testid="total-line">{formatVND(total)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm opacity-50"
          disabled
          placeholder={t('checkout.promoCode')}
          aria-label={t('checkout.promoCodeLabel')}
          data-testid="promo-code-input"
        />
        <button
          type="button"
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-400"
          disabled
          aria-label={t('checkout.promoApplyLabel')}
          data-testid="promo-apply-action"
        >
          {t('checkout.promoApply')}
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm text-gray-700">{t('checkout.paymentSource')}</span>
        <span className="text-sm text-gray-700" data-testid="payment-source-display">{t('checkout.paymentSourceValue')}</span>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={vatChecked}
          onChange={() => setVatChecked(!vatChecked)}
          className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
          aria-label={t('checkout.vatInvoiceLabel')}
          data-testid="vat-invoice-checkbox"
        />
        <span className="text-sm text-gray-700">{t('checkout.vatInvoice')}</span>
      </label>

      <p className="text-xs text-gray-400" data-testid="fine-print">{t('common.finePrint')}</p>

      {payloadError && (
        <div className="rounded-lg bg-red-50 p-3 text-red-700" aria-label={t('checkout.payloadErrorLabel')} data-testid="payload-error-alert">
          <p>{t('checkout.payloadError')}</p>
          <button
            type="button"
            className="mt-2 text-sm font-medium text-red-700 underline"
            onClick={loadPayload}
            aria-label={t('common.retry')}
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {noBookingKey && (
        <div className="rounded-lg bg-yellow-50 p-3 text-yellow-700" aria-label={t('checkout.noBookingKeyLabel')} data-testid="no-booking-key-alert">
          <p>{t('checkout.noBookingKey')}</p>
        </div>
      )}

      <button
        type="button"
        className={`w-full rounded-lg py-3 text-center font-medium text-white transition-colors ${
          canPay ? 'bg-red-500 hover:bg-red-600' : 'cursor-not-allowed bg-gray-300'
        }`}
        disabled={!canPay}
        onClick={handlePay}
        aria-label={t('checkout.payLabel')}
        data-testid="pay-action"
      >
        {processing ? '...' : t('checkout.pay')}
      </button>
    </div>
  );
}