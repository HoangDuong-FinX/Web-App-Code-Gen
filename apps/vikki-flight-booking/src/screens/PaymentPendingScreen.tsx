import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useBooking, useHoldTimer } from '../context/BookingContext';
import { useI18n } from '../i18n';
import { TopBar } from '../components/TopBar';
import { Spinner } from '../components/Spinner';
import { AmountDisplay } from '../components/AmountDisplay';
import { CountdownTimer } from '../components/CountdownTimer';
import type { ScreenId, HostRuntime, PaymentResult } from '../types';

interface PaymentPendingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  hostRuntime?: HostRuntime;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

const POLL_INTERVAL_MS = 5000; // 5 seconds between polls
const MAX_POLL_FAILURES = 3;

export function PaymentPendingScreen({ onNavigate, hostRuntime }: PaymentPendingScreenProps) {
  const { t } = useI18n();
  const { state, dispatch } = useBooking();
  const [pollFailures, setPollFailures] = useState(0);

  const isRoundTrip = state.tripType === 'round';
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  // Hold timer — navigate to hold-expired if session expires during polling
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
    if (pollingRef.current) clearInterval(pollingRef.current);
    onNavigate('hold-expired');
  }, [onNavigate]);

  const remainingSeconds = useHoldTimer(earliestExpiry, handleExpire);

  // If we already have a payment result from simulated flow (BR-12), navigate immediately
  useEffect(() => {
    if (state.fallbackReason && state.paymentResult) {
      // Brief delay to show pending UI, then navigate to result
      const timer = setTimeout(() => {
        if (!mountedRef.current) return;
        if (state.paymentResult?.status === 'success') {
          onNavigate('payment-success');
        } else if (state.paymentResult?.status === 'failed') {
          onNavigate('payment-failed');
        } else if (state.paymentResult?.status === 'partial') {
          onNavigate('payment-partial');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.fallbackReason, state.paymentResult, onNavigate]);

  // Polling logic
  useEffect(() => {
    // Skip polling if simulated
    if (state.fallbackReason) return;

    const paymentSdk = hostRuntime?.payment;
    if (!paymentSdk) {
      // No SDK and no fallback reason — shouldn't happen, navigate to failed
      dispatch({
        type: 'SET_PAYMENT_RESULT',
        payload: {
          status: 'failed',
          errorReason: 'Payment SDK unavailable',
          chargeStatusMessage: 'Thẻ của bạn chưa bị trừ tiền.',
        },
      });
      onNavigate('payment-failed');
      return;
    }

    const sessionId = state.outboundSession?.sessionId ?? '';
    const offerId = state.selectedOutboundOffer?.offerId ?? '';

    async function poll() {
      if (!mountedRef.current) return;
      try {
        const result = await paymentSdk!.polling({ sessionId, offerId }) as {
          transactionId?: string | null;
          status?: 'pending' | 'success' | 'failed' | 'partial';
          bookingReference?: string;
          errorReason?: string;
          chargeStatusMessage?: string;
        };

        if (!mountedRef.current) return;

        if (result.status === 'success' && result.transactionId) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const paymentResult: PaymentResult = {
            status: 'success',
            transactionId: result.transactionId,
            bookingReference: result.bookingReference,
          };
          dispatch({ type: 'SET_PAYMENT_RESULT', payload: paymentResult });

          // For round-trip: check if we need to process return leg
          if (isRoundTrip && state.returnSession && !state.returnPaymentResult) {
            // Start return payment (chained)
            try {
              await paymentSdk!.startPayment({
                transactionType: 'booking',
                provider: 'VJA',
                sessionId: state.returnSession.sessionId,
                offerId: state.selectedReturnOffer?.offerId ?? '',
                bookingKey: state.paymentInquiry?.bookingKey ?? '',
                amount: state.selectedReturnOffer?.price ?? 0,
              });
              // Continue polling for return — simplified: navigate to success
              // In production, this would start a second polling loop
              onNavigate('payment-success');
            } catch (returnErr: unknown) {
              // Return leg failed — partial per BR-11
              const partialResult: PaymentResult = {
                status: 'partial',
                errorReason: (returnErr as { message?: string }).message ?? 'Return payment failed',
              };
              dispatch({ type: 'SET_RETURN_PAYMENT_RESULT', payload: partialResult });
              onNavigate('payment-partial');
            }
          } else {
            onNavigate('payment-success');
          }
          return;
        }

        if (result.status === 'failed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const paymentResult: PaymentResult = {
            status: 'failed',
            errorReason: result.errorReason ?? 'Payment declined',
            chargeStatusMessage: result.chargeStatusMessage ?? 'Thẻ của bạn chưa bị trừ tiền.',
          };
          dispatch({ type: 'SET_PAYMENT_RESULT', payload: paymentResult });
          onNavigate('payment-failed');
          return;
        }

        if (result.status === 'partial') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          const paymentResult: PaymentResult = {
            status: 'partial',
            transactionId: result.transactionId ?? undefined,
            bookingReference: result.bookingReference,
            errorReason: result.errorReason,
          };
          dispatch({ type: 'SET_PAYMENT_RESULT', payload: paymentResult });
          onNavigate('payment-partial');
          return;
        }

        // status === 'pending' or transactionId missing → continue polling (BR-04: "not yet")
        setPollFailures(0);
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        setPollFailures(prev => {
          const next = prev + 1;
          if (next >= MAX_POLL_FAILURES) {
            // Persistent failures — keep polling but don't navigate yet
            // Only hold expiry stops us
          }
          return next;
        });
      }
    }

    // Start polling immediately, then at interval
    poll();
    pollingRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [
    hostRuntime, state.outboundSession, state.selectedOutboundOffer,
    state.returnSession, state.selectedReturnOffer, state.paymentInquiry,
    state.returnPaymentResult, state.fallbackReason,
    isRoundTrip, dispatch, onNavigate,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const totalAmount = state.paymentInquiry?.amount ?? 0;

  // Format remaining time for aria
  const timerMinutes = Math.floor(remainingSeconds / 60);
  const timerSeconds = remainingSeconds % 60;
  const timerDisplay = `${String(timerMinutes).padStart(2, '0')}:${String(timerSeconds).padStart(2, '0')}`;

  return (
    <div className="screen screen--payment-pending">
      <TopBar
        title={t('paymentPending.title')}
        showBackArrow={false}
        ariaLabel={t('paymentPending.title')}
      />
      <div className="screen__content screen__content--center">
        <Spinner
          size="large"
          ariaLabel={t('paymentPending.spinnerAriaLabel')}
        />

        <h2 className="payment-pending__heading">
          {t('paymentPending.heading')}
        </h2>

        <p className="payment-pending__message">
          {t('paymentPending.doNotClose')}
        </p>

        <AmountDisplay
          amount={formatPrice(totalAmount)}
          currency="VND"
          variant="subtle"
          ariaLabel={t('paymentPending.amountAriaLabel').replace('{amount}', formatPrice(totalAmount))}
        />

        <CountdownTimer
          remainingSeconds={remainingSeconds}
          ariaLabel={t('paymentPending.timerAriaLabel').replace('{time}', timerDisplay)}
        />

        {pollFailures >= MAX_POLL_FAILURES && (
          <p className="payment-pending__warning" role="alert">
            {t('error.generic')}
          </p>
        )}
      </div>
    </div>
  );
}
