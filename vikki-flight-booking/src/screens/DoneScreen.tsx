import React from 'react';
import { useAppContext, formatVND } from '../store';
import { t } from '../i18n/vi';
import { Text, ResultIcon, AlertNote, Divider } from '../components/ui';

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}, ${d.getDate()} th\u00E1ng ${d.getMonth() + 1} ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

export function DoneScreen() {
  const { state, setState, navigate } = useAppContext();
  const { bookingResult } = state;

  if (!bookingResult) {
    // Guard: if navigated here without result, go back to search
    navigate('search');
    return null;
  }

  const { paymentResult, transactionId, bookingCode, returnBookingCode, amount, timestamp, errorReason, viaHost } = bookingResult;

  const isSuccess = paymentResult === 'success' || paymentResult === 'simulated';
  const isPartial = paymentResult === 'partial';
  const isFailed = paymentResult === 'failed';

  const title = isSuccess
    ? t('done.successTitle')
    : isPartial
    ? t('done.partialTitle')
    : t('done.failedTitle');

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: t('done.merchant'),
        text: `${title} ${formatVND(amount)}`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  const handleReset = () => {
    setState(s => ({
      ...s,
      outboundSessionId: null,
      returnSessionId: null,
      expiresAt: null,
      outboundOffers: [],
      returnOffers: [],
      selectedOutboundOffer: null,
      selectedOutboundFare: null,
      selectedReturnOffer: null,
      selectedReturnFare: null,
      passengers: [],
      outboundAncillaryCatalog: null,
      returnAncillaryCatalog: null,
      seatMap: [],
      outboundMeals: [],
      outboundBaggage: null,
      outboundSeats: [],
      returnMeals: [],
      returnBaggage: null,
      returnSeats: [],
      outboundBookingKey: null,
      returnBookingKey: null,
      bookingResult: null,
      currentScreen: 'search',
    }));
  };

  const handleRetry = () => {
    setState(s => ({ ...s, bookingResult: null, currentScreen: 'checkout' }));
  };

  return (
    <div className="screen done-screen">
      <div className="screen__content screen__content--center">
        <ResultIcon state={paymentResult} data-testid="result-status-icon" />

        <h1 className="text-title-1" data-testid="result-title">{title}</h1>

        {!isFailed && (
          <Text variant="title-2" data-testid="result-amount">
            \u2212{formatVND(amount)}
          </Text>
        )}
        {isFailed && (
          <Text variant="title-2" data-testid="result-amount">
            {formatVND(amount)}
          </Text>
        )}

        <Text variant="body" data-testid="result-timestamp">
          {formatTimestamp(timestamp)}
        </Text>

        {/* Transaction details card */}
        <div className="transaction-details-card">
          <Text variant="body-semibold">{t('done.transactionDetails')}</Text>

          <div className="row-between">
            <Text variant="body">{t('done.paidTo')}</Text>
            <Text variant="body">{t('done.merchant')}</Text>
          </div>

          {bookingCode && (
            <div className="row-between">
              <Text variant="body">{t('done.bookingCode')}</Text>
              <Text variant="mono-label">{bookingCode}</Text>
            </div>
          )}

          {isSuccess && !isFailed && returnBookingCode && (
            <div className="row-between">
              <Text variant="body">{t('done.bookingCode')} ({t('common.return')})</Text>
              <Text variant="mono-label">{returnBookingCode}</Text>
            </div>
          )}

          {/* BR-13: only show transactionId if it exists */}
          {transactionId && (
            <div className="row-between">
              <Text variant="body">{t('done.transactionId')}</Text>
              <Text variant="mono-label">{transactionId}</Text>
            </div>
          )}

          {isFailed && errorReason && (
            <div className="row-between">
              <Text variant="body">{errorReason}</Text>
            </div>
          )}

          <div className="row-start gap-8">
            <Text variant="body">\uD83D\uDCAC</Text>
            <Text variant="body">{t('done.description')}</Text>
          </div>
        </div>

        {/* VAT note: only for success */}
        {isSuccess && (
          <Text variant="footnote" data-testid="vat-invoice-info-note">
            {t('done.vatNote')}
          </Text>
        )}

        {/* BR-12: simulated payment banner */}
        <AlertNote visible={!viaHost} tone="warning" data-testid="simulated-payment-banner">
          {t('done.simulatedBanner')}
        </AlertNote>

        {isPartial && (
          <AlertNote visible tone="warning">
            {t('done.partialNote')}
          </AlertNote>
        )}

        {/* CTAs */}
        <div className="stack stack--col gap-8 w-full">
          {isSuccess && (
            <button
              type="button"
              className="btn btn-secondary"
              aria-label={t('done.share.ariaLabel')}
              data-testid="share-button"
              onClick={handleShare}
            >
              {t('done.share')}
            </button>
          )}

          {(isSuccess || isPartial) && (
            <button
              type="button"
              className="btn btn-secondary"
              aria-label={t('done.bookAnother.ariaLabel')}
              data-testid="book-another-button"
              onClick={handleReset}
            >
              {t('done.bookAnother')}
            </button>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            aria-label={t('done.goHome.ariaLabel')}
            data-testid="home-button"
            onClick={handleReset}
          >
            {t('done.goHome')}
          </button>

          {isFailed && (
            <button
              type="button"
              className="btn btn-secondary"
              aria-label={t('done.retry.ariaLabel')}
              data-testid="retry-button"
              onClick={handleRetry}
            >
              {t('done.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
