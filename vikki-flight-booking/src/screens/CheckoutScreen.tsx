import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { TextField } from '../components/TextField';
import { Checkbox } from '../components/Checkbox';
import { Divider } from '../components/Divider';
import { AlertNote } from '../components/AlertNote';
import { PriceHoldCountdown } from '../components/PriceHoldCountdown';
import { HoldExpiredNote } from '../components/HoldExpiredNote';
import { PaymentMethodRail } from '../components/PaymentMethodRail';
import { t, formatVnd } from '../i18n';
import { isExpired } from '../utils/date';
import { calculateTotal, calculateSubtotal, calculateServiceFee } from '../utils/price';
import { fixtureLoadPaymentInquiry } from '../fixtures/paymentInquiry';
import { fixtureStartPayment, getPaymentHubOutcome } from '../fixtures/paymentHub';
import type { AppState, AppAction, ScreenId, BookingResult } from '../types/state';

interface CheckoutScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
}

export function CheckoutScreen({ state, dispatch, navigate }: CheckoutScreenProps): React.ReactElement {
  const [holdExpired, setHoldExpired] = useState(isExpired(state.expiresAt));
  const [vatChecked, setVatChecked] = useState(false);
  const [loadingPayload, setLoadingPayload] = useState(true);

  const total = calculateTotal(state);
  const subtotal = calculateSubtotal(state);
  const serviceFee = calculateServiceFee(state);

  useEffect(() => {
    if (!state.sessionId) return;
    setLoadingPayload(true);
    fixtureLoadPaymentInquiry(state.sessionId, total)
      .then(payload => {
        dispatch({ type: 'SET_BOOKING_KEY', bookingKey: payload.bookingKey, returnBookingKey: '' });
        setLoadingPayload(false);
      })
      .catch(() => {
        dispatch({ type: 'SET_CHECKOUT_LOAD_ERROR', error: t('checkout.loadError') });
        setLoadingPayload(false);
      });
  }, [state.sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const canPay = !holdExpired && !!state.bookingKey && !state.isSubmittingPayment && !loadingPayload;

  const handlePay = useCallback(async () => {
    if (!canPay || !state.selectedOutboundOffer) return;
    dispatch({ type: 'SET_SUBMITTING_PAYMENT', value: true });
    dispatch({ type: 'SET_CHECKOUT_ERROR', error: '' });

    try {
      const outboundResult = await fixtureStartPayment({
        transactionType: 'booking',
        provider: 'VJA',
        sessionId: state.sessionId,
        offerId: state.selectedOutboundOffer.offerId,
      });

      if (outboundResult.status === 'cancelled') {
        dispatch({ type: 'SET_SUBMITTING_PAYMENT', value: false });
        return;
      }

      if (state.tripType === 'round-trip' && state.selectedReturnOffer) {
        if (outboundResult.status === 'failed') {
          const result: BookingResult = {
            paymentResult: 'failed',
            outboundBookingCode: '',
            amount: total,
            timestamp: new Date().toISOString(),
            errorMessage: outboundResult.errorMessage ?? t('done.failed.hint'),
            viaHost: outboundResult.viaHost,
          };
          dispatch({ type: 'SET_BOOKING_RESULT', result });
          navigate('done');
          return;
        }

        const returnResult = await fixtureStartPayment({
          transactionType: 'booking',
          provider: 'VJA',
          sessionId: state.sessionId,
          offerId: state.selectedReturnOffer.offerId,
        });

        if (returnResult.status === 'failed') {
          const result: BookingResult = {
            paymentResult: 'partial',
            outboundBookingCode: generateBookingCode(),
            amount: total,
            timestamp: new Date().toISOString(),
            transactionId: outboundResult.transactionId,
            viaHost: outboundResult.viaHost,
          };
          dispatch({ type: 'SET_BOOKING_RESULT', result });
          navigate('done');
          return;
        }

        const hubOutcome = getPaymentHubOutcome();
        const result: BookingResult = {
          paymentResult: hubOutcome === 'simulated' ? 'simulated' : 'success',
          outboundBookingCode: generateBookingCode(),
          returnBookingCode: generateBookingCode(),
          amount: total,
          timestamp: new Date().toISOString(),
          transactionId: returnResult.transactionId ?? outboundResult.transactionId,
          viaHost: outboundResult.viaHost,
        };
        dispatch({ type: 'SET_BOOKING_RESULT', result });
        navigate('done');
        return;
      }

      if (outboundResult.status === 'failed') {
        const result: BookingResult = {
          paymentResult: 'failed',
          outboundBookingCode: '',
          amount: total,
          timestamp: new Date().toISOString(),
          errorMessage: outboundResult.errorMessage ?? t('done.failed.hint'),
          viaHost: outboundResult.viaHost,
        };
        dispatch({ type: 'SET_BOOKING_RESULT', result });
        navigate('done');
        return;
      }

      const hubOutcome = getPaymentHubOutcome();
      const result: BookingResult = {
        paymentResult: hubOutcome === 'simulated' ? 'simulated' : 'success',
        outboundBookingCode: generateBookingCode(),
        amount: total,
        timestamp: new Date().toISOString(),
        transactionId: outboundResult.transactionId,
        viaHost: outboundResult.viaHost,
      };
      dispatch({ type: 'SET_BOOKING_RESULT', result });
      navigate('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('checkout.error');
      dispatch({ type: 'SET_CHECKOUT_ERROR', error: msg });
    }
  }, [canPay, state, dispatch, navigate, total]);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="title-1" semantic="h1">{t('checkout.title')}</Text>

      {state.expiresAt && (
        <PriceHoldCountdown
          expiresAt={state.expiresAt}
          onExpired={() => setHoldExpired(true)}
          data-testid="price-hold-countdown"
        />
      )}

      {holdExpired && <HoldExpiredNote onSearchAgain={() => navigate('search')} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-12)' }}>
        <Text variant="body-semibold">{t('checkout.paymentDetails')}</Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('checkout.subtotal')}</Text>
          <Text variant="body">{formatVnd(subtotal)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('checkout.serviceFee')}</Text>
          <Text variant="body">{formatVnd(serviceFee)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('checkout.promoCode')}</Text>
          <Text variant="body">0 VND</Text>
        </div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body-semibold">{t('checkout.total')}</Text>
          <Text variant="headline">{formatVnd(total)}</Text>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Text variant="body">{t('checkout.promoCode')}</Text>
        <TextField
          placeholder={t('checkout.promoCode.placeholder')}
          disabled
          data-testid="promo-code-input"
        />
        <Button variant="secondary" disabled data-testid="promo-code-apply-button">
          {t('checkout.promoCode.apply')}
        </Button>
      </div>

      <Checkbox
        label={t('checkout.vatInvoice')}
        ariaLabel={t('checkout.vatInvoice.ariaLabel')}
        checked={vatChecked}
        onChange={setVatChecked}
        data-testid="vat-invoice-checkbox"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Text variant="body-semibold">{t('checkout.paymentMethod')}</Text>
        <PaymentMethodRail data-testid="payment-method-rail" />
      </div>

      <AlertNote tone="warning" visible data-testid="checkout-simulated-note">
        {t('checkout.simulatedNote')}
      </AlertNote>

      {state.checkoutLoadError && (
        <AlertNote tone="critical" visible role="alert">
          {state.checkoutLoadError}
        </AlertNote>
      )}

      {state.checkoutError && (
        <AlertNote tone="critical" visible role="alert" data-testid="payment-error">
          {state.checkoutError}
        </AlertNote>
      )}

      <Text variant="footnote">{t('checkout.terms')}</Text>

      <Button
        variant="primary"
        onClick={handlePay}
        disabled={!canPay}
        ariaLabel={t('checkout.payNow.ariaLabel')}
        data-testid="pay-now-button"
        fullWidth
      >
        {state.isSubmittingPayment ? t('checkout.processing') : t('checkout.payNow')}
      </Button>
    </div>
  );
}

function generateBookingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
