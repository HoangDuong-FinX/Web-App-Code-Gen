import React, { useEffect, useState } from 'react';
import { t } from '../i18n';
import type { AppState } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Divider } from '../components/ui/Divider';
import { AlertNote } from '../components/ui/AlertNote';
import { Checkbox } from '../components/ui/Checkbox';
import { TextField } from '../components/ui/TextField';
import { PriceHoldCountdown } from '../components/ui/PriceHoldCountdown';
import { PaymentMethodRail } from '../components/ui/PaymentMethodRail';
import { fetchPaymentInquiry, initiatePayment } from '../fixtures/paymentInquiry';
import type { BookingResult } from '../types/state';

interface CheckoutProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function CheckoutScreen({ state, onNavigate, onUpdateState }: CheckoutProps) {
  const session = state.outboundSession;
  const { searchCriteria, selectedOutboundOffer, selectedReturnOffer } = state;

  const [bookingKey, setBookingKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [holdExpired, setHoldExpired] = useState(false);
  const [vatChecked, setVatChecked] = useState(false);

  const paxCount = searchCriteria.adults + searchCriteria.children;
  let totalFare = selectedOutboundOffer ? selectedOutboundOffer.fareClass.priceAmount : 0;
  if (selectedReturnOffer) totalFare += selectedReturnOffer.fareClass.priceAmount;
  totalFare *= paxCount;
  if (searchCriteria.infants > 0) totalFare += Math.round(totalFare * 0.1);
  const serviceFee = Math.round(totalFare * 0.05);
  const totalAmount = totalFare + serviceFee;

  useEffect(() => {
    if (!session || !selectedOutboundOffer) {
      onNavigate('search');
      return;
    }
    setLoadError(false);
    fetchPaymentInquiry(totalAmount)
      .then(payload => {
        setBookingKey(payload.bookingKey);
        onUpdateState({ bookingKey: payload.bookingKey });
      })
      .catch(() => setLoadError(true));
  }, []);

  if (!session || !selectedOutboundOffer) return null;

  const canPay = !holdExpired && !!bookingKey && !paying && !loadError;

  const handlePay = async () => {
    if (!canPay) return;
    setPaymentError(null);
    setPaying(true);
    try {
      const result = await initiatePayment(totalAmount);
      const bookingResult: BookingResult = {
        paymentResult: result.paymentResult,
        transactionId: result.transactionId,
        bookingCode: result.bookingCode,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
        errorMessage: result.errorMessage,
        viaHost: false,
      };
      onUpdateState({ bookingResult });
      onNavigate('done');
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'PAYMENT_CANCELLED') {
        // BR-10: cancelled = stay on checkout
        // no state change
      } else {
        setPaymentError(t('checkout.error'));
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-[28px] font-bold leading-[1.35] font-display">{t('checkout.title')}</h1>

      <PriceHoldCountdown
        expiresAt={session.expiresAt}
        onExpired={() => setHoldExpired(true)}
        data-testid="price-hold-countdown"
      />

      {holdExpired && (
        <AlertNote tone="error" role="alert">
          {t('checkout.holdExpired')}
          <Button variant="ghost" onClick={() => onNavigate('search')} className="ml-2 !py-0 !px-1 text-[12px]">
            {t('checkout.searchAgain')}
          </Button>
        </AlertNote>
      )}

      {loadError && (
        <AlertNote tone="error" role="alert">
          {t('checkout.loadError')}
        </AlertNote>
      )}

      {/* Payment details card */}
      <div className="flex flex-col gap-3 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)]">
        <Text variant="body-semibold" as="span">{t('checkout.paymentDetails')}</Text>
        <div className="flex justify-between">
          <Text variant="body" as="span">{t('checkout.subtotal')}</Text>
          <Text variant="body" as="span">{formatPrice(totalFare)}</Text>
        </div>
        <div className="flex justify-between">
          <Text variant="body" as="span">{t('checkout.serviceFee')}</Text>
          <Text variant="body" as="span">{formatPrice(serviceFee)}</Text>
        </div>
        <div className="flex justify-between">
          <Text variant="body" as="span">{t('checkout.promo')}</Text>
          <Text variant="body" as="span">0 VND</Text>
        </div>
        <Divider />
        <div className="flex justify-between">
          <Text variant="body-semibold" as="span">{t('checkout.total')}</Text>
          <Text variant="headline" as="span">{formatPrice(totalAmount)}</Text>
        </div>
      </div>

      {/* Promo code (disabled per KL-01) */}
      <div className="flex flex-col gap-2">
        <Text variant="body" as="span">{t('checkout.promoCode.label')}</Text>
        <div className="flex gap-2">
          <TextField
            placeholder={t('checkout.promoCode.placeholder')}
            disabled
            data-testid="promo-code-input"
          />
          <Button
            variant="secondary"
            disabled
            data-testid="promo-code-apply-button"
          >
            {t('checkout.promoCode.apply')}
          </Button>
        </div>
      </div>

      {/* VAT checkbox (KL-02: clickable but not consumed) */}
      <Checkbox
        label={t('checkout.vat')}
        aria-label={t('checkout.vat.aria')}
        data-testid="vat-invoice-checkbox"
        checked={vatChecked}
        onChange={setVatChecked}
      />

      {/* Payment method rail */}
      <div className="flex flex-col gap-2">
        <Text variant="body-semibold" as="span">{t('checkout.paymentMethod')}</Text>
        <PaymentMethodRail data-testid="payment-method-rail" />
      </div>

      {/* Fixture mode banner — required per BR-12 */}
      <AlertNote tone="warning">
        {t('checkout.fixtureMode')}
      </AlertNote>

      {/* Terms */}
      <Text variant="footnote" as="p">{t('checkout.terms')}</Text>

      <Button
        variant="primary"
        fullWidth
        aria-label={t('checkout.payNow.aria')}
        data-testid="pay-now-button"
        onClick={handlePay}
        disabled={!canPay}
        loading={paying}
      >
        {paying ? t('checkout.payNow.loading') : t('checkout.payNow')}
      </Button>

      <AlertNote tone="error" visible={!!paymentError} role="alert" data-testid="payment-error">
        {paymentError ?? ''}
      </AlertNote>
    </div>
  );
}
