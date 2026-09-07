import React, { useEffect, useState } from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction } from '../types';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Checkbox } from '../components/ui/Checkbox';
import { AlertNote } from '../components/ui/AlertNote';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { Divider } from '../components/ui/Divider';
import { isHoldExpired } from '../utils/holdExpiry';
import { formatVND } from '../utils/format';
import {
  fixtureGetPaymentInquiry,
  fixtureInitiatePayment,
  setPaymentFixtureResult,
} from '../fixtures';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const CheckoutScreen: React.FC<Props> = ({ state, dispatch }) => {
  const expiresAt = state.outboundSession?.expiresAt ?? new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const expired = isHoldExpired(expiresAt);
  const [bookingKey, setBookingKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [paying, setPaying] = useState(false);
  const [vatChecked, setVatChecked] = useState(false);

  const { selectedOutboundOffer, selectedReturnOffer, searchCriteria } = state;
  const paxCount = searchCriteria.passengers.adults + searchCriteria.passengers.children;
  const infantCount = searchCriteria.passengers.infants;
  const isRoundTrip = searchCriteria.tripType === 'round-trip';

  // Calculate total
  const outboundFare = (selectedOutboundOffer?.priceAmount ?? 0) * paxCount;
  const returnFare = isRoundTrip ? (selectedReturnOffer?.priceAmount ?? 0) * paxCount : 0;
  const infantSurcharge = infantCount >= 1 ? (selectedOutboundOffer?.priceAmount ?? 0) * 0.1 : 0;
  const mealCost = state.outboundServices.meals.reduce((s, m) => s + m.priceAmount * m.quantity, 0);
  const bagCost = state.outboundServices.baggage.reduce((s, b) => s + b.priceAmount, 0);
  const seatCost = state.outboundServices.seats.reduce((s, seat) => s + seat.priceAmount, 0);
  const subtotal = outboundFare + returnFare + infantSurcharge;
  const serviceFee = mealCost + bagCost + seatCost;
  const total = subtotal + serviceFee;

  useEffect(() => {
    setLoadError(false);
    const sessionId = state.outboundSession?.sessionId ?? 'sess_fixture';
    fixtureGetPaymentInquiry(sessionId, total)
      .then(({ bookingKey: key }) => {
        setBookingKey(key);
        dispatch({ type: 'SET_BOOKING_KEY', key });
      })
      .catch(() => setLoadError(true));
  }, [state.outboundSession?.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const canPay = !expired && !!bookingKey && !paying && !loadError;

  const handlePay = async () => {
    if (!canPay || !selectedOutboundOffer) return;
    setPaying(true);
    dispatch({ type: 'SET_CHECKOUT_ERROR', error: null });
    try {
      const sessionId = state.outboundSession?.sessionId ?? 'sess_fixture';
      const result = await fixtureInitiatePayment(sessionId, selectedOutboundOffer.offerId);

      if (result.status === 'cancelled') {
        // BR-10: stay on checkout, allow retry
        setPaying(false);
        return;
      }

      if (result.status === 'failed') {
        dispatch({
          type: 'SET_BOOKING_RESULT',
          result: {
            paymentResult: 'failed',
            outboundBookingCode: null,
            returnBookingCode: null,
            transactionId: null,
            amount: total,
            timestamp: new Date().toISOString(),
            errorMessage: vi.done.failedHint,
            viaHost: false,
          },
        });
        dispatch({ type: 'NAVIGATE', screen: 'done' });
        return;
      }

      // Handle round-trip partial failure
      let returnResult: typeof result | null = null;
      if (isRoundTrip && selectedReturnOffer && state.returnSession) {
        returnResult = await fixtureInitiatePayment(
          state.returnSession.sessionId,
          selectedReturnOffer.offerId,
        );
      }

      const outboundCode = bookingKey
        ? bookingKey.replace('VJA', '').slice(0, 8).toUpperCase()
        : null;
      const returnCode =
        returnResult?.status === 'success' || returnResult?.status === 'simulated'
          ? (state.bookingKey ? state.bookingKey.replace('VJA', '').slice(0, 8).toUpperCase() : null)
          : null;

      const isPartial = isRoundTrip && returnResult && returnResult.status === 'failed';
      const isSimulated = result.status === 'simulated';

      dispatch({
        type: 'SET_BOOKING_RESULT',
        result: {
          paymentResult: isPartial ? 'partial' : isSimulated ? 'simulated' : 'success',
          outboundBookingCode: outboundCode,
          returnBookingCode: isPartial ? null : returnCode,
          transactionId: result.transactionId,
          amount: total,
          timestamp: new Date().toISOString(),
          errorMessage: null,
          viaHost: false,
        },
      });
      dispatch({ type: 'NAVIGATE', screen: 'done' });
    } catch {
      dispatch({ type: 'SET_CHECKOUT_ERROR', error: vi.checkout.paymentError });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)]">
        {vi.checkout.title}
      </h1>

      <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

      {expired && (
        <AlertNote visible tone="error">
          {vi.checkout.holdExpired}
          <Button variant="ghost" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })}>
            {vi.checkout.searchAgain}
          </Button>
        </AlertNote>
      )}

      {loadError && (
        <AlertNote visible tone="error">
          {vi.checkout.loadError}
        </AlertNote>
      )}

      {/* Payment details card */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {vi.checkout.paymentDetails}
        </span>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.checkout.subtotal}</span>
          <span className="text-[var(--color-text-primary)]">{formatVND(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.checkout.serviceFee}</span>
          <span className="text-[var(--color-text-primary)]">{formatVND(serviceFee)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.checkout.promoCode}</span>
          <span className="text-[var(--color-text-primary)]">{formatVND(0)}</span>
        </div>
        <Divider />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">{vi.checkout.totalPayment}</span>
          <span className="text-[var(--text-headline)] text-[var(--color-text-primary)]">{formatVND(total)}</span>
        </div>
      </div>

      {/* Promo code (disabled) */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-[var(--color-text-primary)]">{vi.checkout.promoCode}</span>
        <div className="flex gap-2">
          <TextField
            placeholder={vi.checkout.promoPlaceholder}
            disabled
            data-testid="promo-code-input"
            className="flex-1"
          />
          <Button variant="secondary" disabled data-testid="promo-code-apply-button">
            {vi.checkout.applyPromo}
          </Button>
        </div>
      </div>

      {/* VAT invoice checkbox */}
      <Checkbox
        label={vi.checkout.vatInvoice}
        ariaLabel={vi.checkout.vatInvoiceLabel}
        checked={vatChecked}
        onChange={setVatChecked}
        data-testid="vat-invoice-checkbox"
      />

      {/* Payment method rail */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {vi.checkout.paymentMethod}
        </span>
        <div
          className="p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)] text-sm text-[var(--color-text-secondary)] text-center"
          data-testid="payment-method-rail"
        >
          {vi.checkout.paymentMethodPlaceholder}
        </div>
      </div>

      {/* Demo mode controls */}
      <div className="flex flex-col gap-2 p-3 rounded-xl border border-amber-200 bg-amber-50">
        <span className="text-xs font-semibold text-amber-700">{vi.common.fixtureMode} — Chọn kết quả thanh toán</span>
        <div className="flex gap-2 flex-wrap">
          {(['simulated', 'success', 'failed', 'cancelled'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setPaymentFixtureResult(r)}
              className="text-xs px-2 py-1 rounded border border-amber-300 bg-white hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-secondary)]">{vi.checkout.termsText}</p>

      <Button
        variant="primary"
        ariaLabel={vi.checkout.payNowLabel}
        data-testid="pay-now-button"
        onClick={handlePay}
        disabled={!canPay}
        fullWidth
      >
        {paying ? vi.checkout.processing : vi.checkout.payNow}
      </Button>

      {state.checkoutError && (
        <AlertNote visible tone="error" data-testid="payment-error">
          {state.checkoutError}
        </AlertNote>
      )}
    </div>
  );
};
