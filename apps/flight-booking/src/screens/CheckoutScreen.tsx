import React, { useState, useEffect, useCallback } from 'react';
import type { SearchCriteria, FareClass, AncillarySelection, SeatSelection, PaymentResult } from '../types';
import { t } from '../i18n/vi';
import { useHoldTimer } from '../hooks/useHoldTimer';
import { computeBookingTotals } from '../hooks/useBookingTotals';

interface Props {
  searchCriteria: SearchCriteria;
  outboundOffer: FareClass | null;
  returnOffer: FareClass | null;
  outboundAncillaries: AncillarySelection[];
  returnAncillaries: AncillarySelection[];
  outboundSeat: SeatSelection | null;
  returnSeat: SeatSelection | null;
  outboundSessionId: string;
  returnSessionId: string | null;
  expiresAt: string | null;
  vatRequested: boolean;
  onVatChange: (v: boolean) => void;
  onPaymentResult: (result: PaymentResult) => void;
  onBack: () => void;
  onExpired: () => void;
  onHoldExpiredSearch: () => void;
}

let paymentOutcome: 'success' | 'fail' | 'partial' | 'cancelled' | 'simulated' = 'success';
export function setPaymentOutcome(outcome: 'success' | 'fail' | 'partial' | 'cancelled' | 'simulated'): void {
  paymentOutcome = outcome;
}

let payloadOutcome: 'success' | 'fail' = 'success';
export function setPayloadOutcome(outcome: 'success' | 'fail'): void {
  payloadOutcome = outcome;
}

export function CheckoutScreen({ searchCriteria, outboundOffer, returnOffer, outboundAncillaries, returnAncillaries, outboundSeat, returnSeat, outboundSessionId, returnSessionId, expiresAt, vatRequested, onVatChange, onPaymentResult, onBack, onExpired, onHoldExpiredSearch }: Props) {
  const { display, isExpired } = useHoldTimer(expiresAt);
  const [bookingKeys, setBookingKeys] = useState<string[]>([]);
  const [payloadError, setPayloadError] = useState(false);
  const [noBookingKey, setNoBookingKey] = useState(false);
  const [processing, setProcessing] = useState(false);
  const totals = computeBookingTotals(outboundOffer, returnOffer, searchCriteria.adults, searchCriteria.children, outboundAncillaries, returnAncillaries, outboundSeat, returnSeat);

  useEffect(() => { if (isExpired) onExpired(); }, [isExpired, onExpired]);

  const fetchPayload = useCallback(async () => {
    setPayloadError(false);
    setNoBookingKey(false);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (payloadOutcome === 'fail') throw new Error('FIXTURE: payload fetch failed');
      const keys = ['bk_outbound_' + Date.now()];
      if (searchCriteria.tripType === 'round-trip' && returnSessionId) {
        keys.push('bk_return_' + Date.now());
      }
      setBookingKeys(keys);
    } catch {
      setPayloadError(true);
    }
  }, [searchCriteria.tripType, returnSessionId]);

  useEffect(() => { fetchPayload(); }, [fetchPayload]);

  const canPay = !isExpired && bookingKeys.length > 0 && !processing;

  const handlePay = async () => {
    if (!canPay) return;
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));

      if (paymentOutcome === 'cancelled') {
        setProcessing(false);
        return;
      }

      if (paymentOutcome === 'simulated') {
        onPaymentResult({
          status: 'success', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: null,
          amount: totals.grandTotal, failureReason: '', sdkError: '', simulated: true, vatRequested,
        });
        return;
      }

      if (paymentOutcome === 'fail') {
        onPaymentResult({
          status: 'failed', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: null,
          amount: totals.grandTotal, failureReason: 'Payment declined by bank', sdkError: 'ERR_DECLINED', simulated: false, vatRequested,
        });
        return;
      }

      if (paymentOutcome === 'partial') {
        onPaymentResult({
          status: 'partial', bookingCode: 'ABCD1234', returnBookingCode: '', transactionId: 'txn_outbound_123',
          amount: outboundOffer ? outboundOffer.priceAmount * (searchCriteria.adults + searchCriteria.children) : 0,
          failureReason: 'Return leg payment failed', sdkError: '', simulated: false, vatRequested,
        });
        return;
      }

      onPaymentResult({
        status: 'success', bookingCode: 'ABCD1234',
        returnBookingCode: searchCriteria.tripType === 'round-trip' ? 'EFGH5678' : '',
        transactionId: 'txn_' + Date.now(), amount: totals.grandTotal,
        failureReason: '', sdkError: '', simulated: false, vatRequested,
      });
    } catch {
      onPaymentResult({
        status: 'failed', bookingCode: '', returnBookingCode: '', transactionId: null,
        amount: totals.grandTotal, failureReason: 'Unexpected error', sdkError: 'ERR_UNKNOWN', simulated: false, vatRequested,
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (amount: number): string => amount.toLocaleString('vi-VN') + ' ' + t('common.currency');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center px-4 py-3 bg-[#F9FBF9]">
        <button type="button" className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]" aria-label={t('checkout.back')} data-testid="back-action" onClick={onBack}>\u2190</button>
        <h1 className="flex-1 text-center text-lg font-semibold text-[#1A1A1A]">{t('checkout.title')}</h1>
        <span className="text-sm font-semibold text-[#E12127]" aria-label={t('results.holdTimer.aria')} data-testid="hold-timer-display">{display}</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4" aria-label={t('checkout.details.title')}>
          <h2 className="font-semibold text-base mb-3">{t('checkout.details.title')}</h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('checkout.subtotal')}</span><span className="font-semibold" data-testid="subtotal-amount">{formatPrice(totals.fareTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('checkout.serviceFee')}</span><span className="font-semibold" data-testid="service-fee-amount">{formatPrice(totals.servicesTotal + totals.seatsTotal)}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('checkout.promoDiscount')}</span><span className="font-semibold" data-testid="promo-discount-amount">0 {t('common.currency')}</span></div>
            <hr className="border-[#E6E8E7]" aria-hidden="true" />
            <div className="flex justify-between"><span className="font-bold text-lg">{t('checkout.grandTotal')}</span><span className="font-bold text-lg text-[#E12127]" data-testid="grand-total-amount">{formatPrice(totals.grandTotal)}</span></div>
          </div>
        </div>

        <div className="flex gap-2">
          <input type="text" className="flex-1 p-3 border border-[#E6E8E7] rounded-lg text-sm bg-gray-100" placeholder={t('checkout.promoCode.placeholder')} aria-label={t('checkout.promoCode.placeholder')} disabled data-testid="promo-code-input" />
          <button type="button" className="px-4 py-3 border border-[#E6E8E7] rounded-lg text-sm text-[#6B7280] bg-gray-100" disabled aria-label={t('checkout.promoCode.apply.aria')} data-testid="apply-promo-action">{t('checkout.promoCode.apply')}</button>
        </div>

        <div className="bg-white rounded-2xl shadow-[0px_5px_10px_rgba(89,27,27,0.05)] p-4" aria-label={t('checkout.paymentInfo.title')}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('checkout.merchant')}</span><span className="font-semibold" data-testid="merchant-value">{t('checkout.merchantValue')}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('checkout.description')}</span><span className="font-semibold" data-testid="description-value">{t('checkout.descriptionValue')}</span></div>
            <div className="flex justify-between"><span className="text-[#6B7280]">{t('checkout.paymentSource')}</span><span className="font-semibold" data-testid="payment-source-value">{t('checkout.paymentSourceValue')}</span></div>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 rounded border-[#E6E8E7] accent-[#E12127]" checked={vatRequested} onChange={(e) => onVatChange(e.target.checked)} aria-label={t('checkout.vatCheckbox')} data-testid="vat-checkbox" />
          <span className="text-sm">{t('checkout.vatCheckbox')}</span>
        </label>

        <p className="text-xs text-[#6B7280]" data-testid="fine-print">{t('checkout.finePrint')}</p>
      </div>

      <div className="p-4">
        <button type="button" className={`w-full h-14 rounded-lg text-white font-semibold text-base transition-colors ${canPay ? 'bg-[#E12127] hover:bg-[#c91d22]' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!canPay} aria-label={t('checkout.payButton.aria')} data-testid="pay-button" onClick={handlePay}>
          {processing ? t('common.loading') : t('checkout.payButton')}
        </button>
      </div>

      {payloadError && (<div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" data-testid="payload-error-message"><p className="text-sm text-red-700">{t('checkout.payloadError')}</p><button type="button" className="text-sm text-[#E12127] font-semibold mt-1" onClick={fetchPayload} aria-label={t('checkout.retry')}>{t('checkout.retry')}</button></div>)}
      {noBookingKey && (<div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert" data-testid="no-booking-key-message"><p className="text-sm text-yellow-700">{t('checkout.noBookingKey')}</p></div>)}
      {isExpired && (<div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert" data-testid="hold-expired-message"><p className="text-sm text-yellow-700">{t('checkout.holdExpired')}</p><button type="button" className="text-sm text-[#E12127] font-semibold mt-1" onClick={onHoldExpiredSearch} aria-label={t('checkout.searchAgain')}>{t('checkout.searchAgain')}</button></div>)}
    </div>
  );
}
