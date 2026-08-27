import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useBooking, useHoldTimer } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import { ButtonBig } from '../components/ButtonBig';
import { InlineError } from '../components/InlineError';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { AmountDisplay } from '../components/AmountDisplay';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { Checkbox } from '../components/Checkbox';
import { Spinner } from '../components/Spinner';
import { fetchPaymentInquiry } from '../api/services';
import type { ScreenId, HostRuntime } from '../types';

interface CheckoutScreenProps {
  onNavigate: (screen: ScreenId) => void;
  hostRuntime?: HostRuntime;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

const PAYMENT_METHODS = [
  { id: 'bank', name: 'paymentMethod.bankTransfer', icon: '🏦' },
  { id: 'ewallet', name: 'paymentMethod.eWallet', icon: '📱' },
  { id: 'card', name: 'paymentMethod.card', icon: '💳' },
];

export function CheckoutScreen({ onNavigate, hostRuntime }: CheckoutScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const isRoundTrip = state.tripType === 'round';

  // Hold timer
  const earliestExpiry = useMemo(() => {
    if (isRoundTrip && state.returnSession) {
      const outboundTime = new Date(state.outboundSession?.expiresAt ?? '').getTime();
      const returnTime = new Date(state.returnSession.expiresAt).getTime();
      return outboundTime < returnTime
        ? state.outboundSession?.expiresAt ?? null
        : state.returnSession.expiresAt;
    }
    return state.outboundSession?.expiresAt ?? null;
  }, [state.outboundSession, state.returnSession, isRoundTrip]);

  const handleExpire = useCallback(() => {
    onNavigate('hold-expired');
  }, [onNavigate]);

  useHoldTimer(earliestExpiry, handleExpire);

  // Load payment inquiry on mount
  useEffect(() => {
    let cancelled = false;

    async function loadInquiry() {
      setLoading(true);
      setError('');
      try {
        const sessionId = state.outboundSession?.sessionId;
        if (!sessionId) {
          onNavigate('search');
          return;
        }

        const result = await fetchPaymentInquiry(sessionId);
        if (cancelled) return;

        dispatch({ type: 'SET_PAYMENT_INQUIRY', payload: result });
      } catch (err: unknown) {
        if (cancelled) return;
        const httpErr = err as { status?: number };
        if (httpErr.status === 500) {
          // Hold expired per BR-01
          onNavigate('hold-expired');
          return;
        }
        setError(t('checkout.loadFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadInquiry();
    return () => { cancelled = true; };
  }, [state.outboundSession, dispatch, onNavigate, t]);

  // Build summary strings
  const journeySummary = useMemo(() => {
    const origin = state.origin?.code ?? '';
    const destination = state.destination?.code ?? '';
    if (isRoundTrip) {
      return `${origin} ⇄ ${destination}`;
    }
    return `${origin} → ${destination}`;
  }, [state.origin, state.destination, isRoundTrip]);

  const passengersSummary = useMemo(() => {
    return state.passengers.map(p => p.fullName).join(', ');
  }, [state.passengers]);

  const servicesSummary = useMemo(() => {
    const all = [...state.selectedServices, ...state.returnSelectedServices];
    if (all.length === 0) return t('review.noServices');
    return all.map(s => s.name).join(', ');
  }, [state.selectedServices, state.returnSelectedServices, t]);

  const totalAmount = state.paymentInquiry?.amount ?? 0;

  // Payment handler
  const handlePay = useCallback(async () => {
    if (!termsAccepted) {
      setError(t('checkout.termsRequired'));
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const paymentSdk = hostRuntime?.payment;

      if (!paymentSdk) {
        // Capability unavailable — simulate payment per BR-12
        dispatch({ type: 'SET_FALLBACK_REASON', payload: 'payment_hub_unavailable' });
        // Simulate success after brief delay
        dispatch({
          type: 'SET_PAYMENT_RESULT',
          payload: {
            status: 'success',
            transactionId: 'SIM_' + Date.now().toString(36).toUpperCase(),
            bookingReference: 'SIM' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          },
        });
        onNavigate('payment-pending');
        return;
      }

      // Call real payment SDK
      const sessionId = state.outboundSession?.sessionId ?? '';
      const offerId = state.selectedOutboundOffer?.offerId ?? '';
      const bookingKey = state.paymentInquiry?.bookingKey ?? '';

      await paymentSdk.startPayment({
        transactionType: 'booking',
        provider: 'VJA',
        sessionId,
        offerId,
        bookingKey,
        amount: totalAmount,
      });

      // If startPayment resolves without error, navigate to pending for polling
      onNavigate('payment-pending');
    } catch (err: unknown) {
      const paymentErr = err as { code?: string; message?: string };

      // BR-10: Cancel ≠ Failure — user closed OTP modal
      if (paymentErr.code === 'USER_CANCELLED' || paymentErr.code === 'cancelled') {
        // Stay on checkout, do nothing
        setSubmitting(false);
        return;
      }

      // Hub refusal → navigate to payment-failed
      if (paymentErr.code === 'HUB_REFUSAL' || paymentErr.code === 'DECLINED') {
        dispatch({
          type: 'SET_PAYMENT_RESULT',
          payload: {
            status: 'failed',
            errorReason: paymentErr.message ?? t('checkout.paymentFailed'),
            chargeStatusMessage: 'Thẻ của bạn chưa bị trừ tiền.',
          },
        });
        onNavigate('payment-failed');
        return;
      }

      // Capability unavailable error
      if (paymentErr.code === 'CAPABILITY_UNAVAILABLE') {
        dispatch({ type: 'SET_FALLBACK_REASON', payload: 'payment_hub_unavailable' });
        dispatch({
          type: 'SET_PAYMENT_RESULT',
          payload: {
            status: 'success',
            transactionId: 'SIM_' + Date.now().toString(36).toUpperCase(),
            bookingReference: 'SIM' + Math.random().toString(36).substring(2, 7).toUpperCase(),
          },
        });
        onNavigate('payment-pending');
        return;
      }

      // Generic payment error
      setError(t('checkout.paymentFailed'));
    } finally {
      setSubmitting(false);
    }
  }, [
    termsAccepted, hostRuntime, state.outboundSession, state.selectedOutboundOffer,
    state.paymentInquiry, totalAmount, dispatch, onNavigate, t,
  ]);

  // Payment method options with translated names
  const paymentMethodOptions = PAYMENT_METHODS.map(m => ({
    id: m.id,
    name: t(m.name as Parameters<typeof t>[0]),
    icon: m.icon,
  }));

  if (loading) {
    return (
      <div className="screen screen--checkout">
        <TopBar
          title={t('checkout.title')}
          showBackArrow
          onBack={() => onNavigate('review')}
          ariaLabel={t('checkout.title')}
        />
        <div className="screen__content screen__content--center">
          <Spinner size="large" ariaLabel={t('checkout.loading')} />
        </div>
      </div>
    );
  }

  return (
    <div className="screen screen--checkout">
      <TopBar
        title={t('checkout.title')}
        showBackArrow
        onBack={() => onNavigate('review')}
        ariaLabel={t('checkout.title')}
      />
      <div className="screen__content">
        <BookingSummaryCard
          collapsed
          expandable
          journey={journeySummary}
          passengers={passengersSummary}
          services={servicesSummary}
          ariaLabel={t('checkout.expandSummary')}
        />

        <AmountDisplay
          amount={formatPrice(totalAmount)}
          currency="VND"
          variant="prominent"
          ariaLabel={t('checkout.totalAriaLabel').replace('{amount}', formatPrice(totalAmount))}
        />

        <PaymentMethodSelector
          options={paymentMethodOptions}
          selectedMethod={selectedPaymentMethod}
          onSelect={setSelectedPaymentMethod}
          ariaLabel={t('checkout.paymentMethod')}
        />

        <Checkbox
          label={t('checkout.termsLabel')}
          checked={termsAccepted}
          onChange={setTermsAccepted}
          ariaLabel={t('checkout.termsLabel')}
          required
        />

        <InlineError visible={!!error}>{error}</InlineError>

        <ButtonBig
          variant={termsAccepted ? 'Active' : 'Disabled'}
          onClick={handlePay}
          ariaLabel={t('checkout.payButton.ariaLabel')}
          loading={submitting}
          disabled={submitting || !termsAccepted}
        >
          {t('checkout.payButton')}
        </ButtonBig>
      </div>
    </div>
  );
}
