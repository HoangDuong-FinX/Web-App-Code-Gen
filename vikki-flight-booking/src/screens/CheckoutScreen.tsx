import React, { useEffect, useState } from 'react';
import { useAppContext, isHoldExpired, formatVND, calculateTotal, generateBookingCode } from '../store';
import { t } from '../i18n/vi';
import { Text, Divider, Checkbox, AlertNote } from '../components/ui';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { fetchPaymentInquiryPayload } from '../fixtures/bookingService';
import { startPayment, pollPaymentResult } from '../fixtures/paymentHub';
import type { BookingResult } from '../types';

export function CheckoutScreen() {
  const { state, setState, navigate } = useAppContext();
  const {
    expiresAt,
    outboundSessionId,
    returnSessionId,
    selectedOutboundOffer,
    selectedOutboundFare,
    selectedReturnOffer,
    selectedReturnFare,
    outboundMeals,
    outboundBaggage,
    outboundSeats,
    returnMeals,
    returnBaggage,
    returnSeats,
    outboundAncillaryCatalog,
    returnAncillaryCatalog,
    searchCriteria,
    outboundBookingKey,
    returnBookingKey,
  } = state;

  const [holdExpired, setHoldExpired] = useState(isHoldExpired(expiresAt));
  const [vatChecked, setVatChecked] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [bookingKeysLoaded, setBookingKeysLoaded] = useState(false);

  const total = calculateTotal(
    selectedOutboundFare,
    selectedReturnFare,
    searchCriteria,
    outboundMeals,
    outboundBaggage,
    outboundSeats,
    returnMeals,
    returnBaggage,
    returnSeats,
    outboundAncillaryCatalog,
    returnAncillaryCatalog,
  );

  useEffect(() => {
    const interval = setInterval(() => setHoldExpired(isHoldExpired(expiresAt)), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Fetch payment inquiry payload on mount
  useEffect(() => {
    if (bookingKeysLoaded) return;
    if (!outboundSessionId) return;

    const fetchKeys = async () => {
      try {
        const outPayload = await fetchPaymentInquiryPayload(outboundSessionId!, total);
        let retKey: string | null = null;
        if (searchCriteria.tripType === 'round-trip' && returnSessionId) {
          const retPayload = await fetchPaymentInquiryPayload(returnSessionId, total);
          retKey = retPayload.bookingKey;
        }
        setState(s => ({
          ...s,
          outboundBookingKey: outPayload.bookingKey,
          returnBookingKey: retKey,
        }));
        setBookingKeysLoaded(true);
      } catch {
        setLoadError(t('checkout.loadError'));
      }
    };
    fetchKeys();
  }, [outboundSessionId, bookingKeysLoaded]);

  const canPay =
    !holdExpired &&
    !!outboundBookingKey &&
    (searchCriteria.tripType !== 'round-trip' || !!returnBookingKey) &&
    !processing &&
    bookingKeysLoaded;

  const handlePayNow = async () => {
    if (!canPay) return;
    setPayError(null);
    setProcessing(true);

    try {
      // Initiate outbound payment
      const outResult = await startPayment({
        transactionType: 'booking',
        provider: 'VJA',
        sessionId: outboundSessionId!,
        offerId: selectedOutboundOffer!.offerId,
      });

      if (outResult.status === 'cancelled') {
        // BR-10: stay on checkout, allow retry
        setProcessing(false);
        return;
      }

      if (outResult.status === 'failed') {
        const bookingCode = generateBookingCode();
        const result: BookingResult = {
          paymentResult: 'failed',
          amount: total,
          timestamp: new Date().toISOString(),
          bookingCode,
          errorReason: t('done.failedHint'),
          viaHost: true,
        };
        setState(s => ({ ...s, bookingResult: result, currentScreen: 'done' }));
        return;
      }

      // Hub unavailable path is caught in catch block
      const outPolling = await pollPaymentResult(outResult.paymentSessionId);
      const outboundCode = generateBookingCode();

      // Round-trip: initiate return payment
      if (searchCriteria.tripType === 'round-trip' && returnSessionId && selectedReturnOffer) {
        const retResult = await startPayment({
          transactionType: 'booking',
          provider: 'VJA',
          sessionId: returnSessionId,
          offerId: selectedReturnOffer.offerId,
        });

        if (retResult.status === 'cancelled') {
          setProcessing(false);
          return;
        }

        if (retResult.status === 'failed') {
          // BR-11: partial payment
          const result: BookingResult = {
            paymentResult: 'partial',
            transactionId: outPolling.transactionId,
            bookingCode: outboundCode,
            amount: total,
            timestamp: new Date().toISOString(),
            viaHost: true,
          };
          setState(s => ({ ...s, bookingResult: result, currentScreen: 'done' }));
          return;
        }

        const retPolling = await pollPaymentResult(retResult.paymentSessionId);
        const returnCode = generateBookingCode();
        const result: BookingResult = {
          paymentResult: 'success',
          transactionId: retPolling.transactionId,
          bookingCode: outboundCode,
          returnBookingCode: returnCode,
          amount: total,
          timestamp: new Date().toISOString(),
          viaHost: true,
        };
        setState(s => ({ ...s, bookingResult: result, currentScreen: 'done' }));
        return;
      }

      // One-way success
      const result: BookingResult = {
        paymentResult: 'success',
        transactionId: outPolling.transactionId,
        bookingCode: outboundCode,
        amount: total,
        timestamp: new Date().toISOString(),
        viaHost: true,
      };
      setState(s => ({ ...s, bookingResult: result, currentScreen: 'done' }));
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message === 'PAYMENT_HUB_UNAVAILABLE') {
        // BR-12: simulated payment
        const bookingCode = generateBookingCode();
        const result: BookingResult = {
          paymentResult: 'simulated',
          bookingCode,
          amount: total,
          timestamp: new Date().toISOString(),
          viaHost: false,
        };
        setState(s => ({ ...s, bookingResult: result, currentScreen: 'done' }));
      } else {
        setPayError(t('checkout.error'));
      }
    } finally {
      setProcessing(false);
    }
  };

  const ticketSubtotal = (() => {
    const paxCount = searchCriteria.adultCount + searchCriteria.childCount;
    let t2 = (selectedOutboundFare?.priceAmount ?? 0);
    if (selectedReturnFare) t2 += selectedReturnFare.priceAmount;
    return t2 * paxCount;
  })();
  const serviceFee = total - ticketSubtotal;

  return (
    <div className="screen checkout-screen">
      <div className="screen__content">
        <h1 className="text-title-1">{t('checkout.title')}</h1>

        <PriceHoldCountdown expiresAt={expiresAt} data-testid="price-hold-countdown" />

        {holdExpired && (
          <AlertNote visible tone="warning">
            {t('checkout.holdExpired')}
            <button type="button" className="btn btn-ghost" onClick={() => navigate('search')}>
              {t('search.searchAgain')}
            </button>
          </AlertNote>
        )}

        <AlertNote visible={!!loadError} tone="error">
          {loadError}
          <button type="button" className="btn btn-ghost" onClick={() => setBookingKeysLoaded(false)}>
            {t('common.retry')}
          </button>
        </AlertNote>

        {/* Payment details card */}
        <div className="payment-details-card">
          <Text variant="body-semibold">{t('checkout.paymentDetails')}</Text>
          <div className="row-between">
            <Text variant="body">{t('checkout.subtotal')}</Text>
            <Text variant="body">{formatVND(ticketSubtotal)}</Text>
          </div>
          <div className="row-between">
            <Text variant="body">{t('checkout.serviceFee')}</Text>
            <Text variant="body">{formatVND(serviceFee > 0 ? serviceFee : 0)}</Text>
          </div>
          <div className="row-between">
            <Text variant="body">{t('checkout.promoCode')}</Text>
            <Text variant="body">0 VND</Text>
          </div>
          <Divider />
          <div className="row-between">
            <Text variant="body-semibold">{t('checkout.total')}</Text>
            <Text variant="headline">{formatVND(total)}</Text>
          </div>
        </div>

        {/* Promo code (disabled per KL-01) */}
        <div className="stack stack--col gap-8">
          <Text variant="body">{t('checkout.promoCode')}</Text>
          <input
            type="text"
            className="text-field__input"
            placeholder={t('checkout.promoCode.placeholder')}
            disabled
            data-testid="promo-code-input"
            aria-label={t('checkout.promoCode')}
          />
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            data-testid="promo-code-apply-button"
            aria-label={t('checkout.promoCode.apply')}
          >
            {t('checkout.promoCode.apply')}
          </button>
        </div>

        {/* VAT invoice checkbox (KL-02: clickable but not consumed) */}
        <Checkbox
          label={t('checkout.vatInvoice')}
          checked={vatChecked}
          onChange={setVatChecked}
          ariaLabel={t('checkout.vatInvoice.ariaLabel')}
          data-testid="vat-invoice-checkbox"
        />

        {/* Payment method rail */}
        <div className="stack stack--col gap-8">
          <Text variant="body-semibold">{t('checkout.paymentMethod')}</Text>
          <div className="payment-method-rail" data-testid="payment-method-rail">
            <Text variant="body">{t('checkout.paymentMethod.placeholder')}</Text>
          </div>
        </div>

        <Text variant="footnote">{t('checkout.terms')}</Text>

        <button
          type="button"
          className="btn btn-primary"
          aria-label={t('checkout.payNow.ariaLabel')}
          data-testid="pay-now-button"
          disabled={!canPay}
          onClick={handlePayNow}
        >
          {processing ? t('checkout.processing') : t('checkout.payNow')}
        </button>

        <AlertNote visible={!!payError} tone="error" data-testid="payment-error">
          {payError}
        </AlertNote>
      </div>
    </div>
  );
}
