import React from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { Divider } from '../components/Divider';
import { AlertNote } from '../components/AlertNote';
import { ResultIcon } from '../components/ResultIcon';
import { t, formatVnd, formatVndMinus } from '../i18n';
import { formatTimestamp } from '../utils/date';
import type { AppState, AppAction, ScreenId, PaymentResult } from '../types/state';

interface DoneScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
}

export function DoneScreen({ state, dispatch, navigate }: DoneScreenProps): React.ReactElement {
  const result = state.bookingResult;

  if (!result) {
    // Guard: shouldn't happen, but redirect gracefully
    return (
      <div style={{ padding: '16px' }}>
        <Text variant="body">{t('common.loading')}</Text>
      </div>
    );
  }

  const { paymentResult, outboundBookingCode, returnBookingCode, transactionId, amount, timestamp, errorMessage, viaHost } = result;

  function getTitle(): string {
    switch (paymentResult) {
      case 'success': return t('done.success.title');
      case 'failed': return t('done.failed.title');
      case 'partial': return t('done.partial.title');
      case 'simulated': return t('done.simulated.title');
      default: {
        const _x: never = paymentResult;
        return String(_x);
      }
    }
  }

  const isSuccess = paymentResult === 'success' || paymentResult === 'simulated';
  const isPartial = paymentResult === 'partial';
  const isFailed = paymentResult === 'failed';
  const isSimulated = paymentResult === 'simulated';

  function handleShare() {
    // BR: silent if unsupported
    if (!navigator.share) return;
    navigator.share({
      title: t('done.merchant'),
      text: `${t('done.description')} - ${outboundBookingCode}`,
      url: window.location.href,
    }).catch(() => {/* silent */});
  }

  function handleBookAnother() {
    dispatch({ type: 'RESET' });
    navigate('search');
  }

  function handleGoHome() {
    dispatch({ type: 'RESET' });
    navigate('search');
  }

  function handleRetry() {
    dispatch({ type: 'SET_CHECKOUT_ERROR', error: '' });
    navigate('checkout');
  }

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <ResultIcon state={paymentResult} data-testid="result-status-icon" />

      <Text variant="title-1" semantic="h1" data-testid="result-title" style={{ textAlign: 'center' }}>
        {getTitle()}
      </Text>

      <Text
        variant="title-2"
        data-testid="result-amount"
        style={{
          color: isSuccess || isPartial ? 'var(--color-success)' : 'var(--color-error)',
          textAlign: 'center',
        }}
      >
        {isSuccess || isPartial ? formatVndMinus(amount) : formatVnd(amount)}
      </Text>

      <Text variant="body" data-testid="result-timestamp" style={{ color: 'var(--color-text-secondary)' }}>
        {formatTimestamp(timestamp)}
      </Text>

      {/* Transaction details card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-12)',
          width: '100%',
        }}
      >
        <Text variant="body-semibold">{t('done.transactionDetails')}</Text>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="body">{t('done.paidTo')}</Text>
          <Text variant="body">{t('done.merchant')}</Text>
        </div>

        {/* BR-13: only show booking code if it exists */}
        {outboundBookingCode && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{isPartial ? t('done.outboundCode') : t('done.bookingCode')}</Text>
            <Text variant="mono-label" style={{ fontFamily: 'var(--font-mono)' }}>{outboundBookingCode}</Text>
          </div>
        )}

        {/* BR-13: return booking code only if exists and not partial */}
        {returnBookingCode && !isPartial && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{t('done.bookingCode')} (về)</Text>
            <Text variant="mono-label" style={{ fontFamily: 'var(--font-mono)' }}>{returnBookingCode}</Text>
          </div>
        )}

        {/* BR-13: transaction ID only if exists */}
        {transactionId && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{t('done.transactionId')}</Text>
            <Text variant="mono-label" style={{ fontFamily: 'var(--font-mono)' }}>{transactionId}</Text>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Text variant="body">💬</Text>
          <Text variant="body">{t('done.description')}</Text>
        </div>

        {/* Error message for failed */}
        {isFailed && errorMessage && (
          <>
            <Divider />
            <Text variant="body" style={{ color: 'var(--color-error)' }}>{errorMessage}</Text>
          </>
        )}

        {/* Partial note */}
        {isPartial && (
          <>
            <Divider />
            <Text variant="body" style={{ color: 'var(--color-warning)' }}>{t('done.partial.note')}</Text>
          </>
        )}
      </div>

      {/* VAT note: only for success/simulated */}
      {(isSuccess) && (
        <Text variant="footnote" data-testid="vat-invoice-info-note" style={{ textAlign: 'center' }}>
          {t('done.vatNote')}
        </Text>
      )}

      {/* BR-12: simulated payment banner */}
      {isSimulated && (
        <AlertNote tone="warning" visible data-testid="simulated-payment-banner">
          {t('done.simulatedBanner')}
        </AlertNote>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {/* Share: only for success */}
        {(isSuccess) && (
          <Button
            variant="secondary"
            onClick={handleShare}
            ariaLabel={t('done.share.ariaLabel')}
            data-testid="share-button"
            fullWidth
          >
            {t('done.share')}
          </Button>
        )}

        {/* Book another: success and partial */}
        {(isSuccess || isPartial) && (
          <Button
            variant="secondary"
            onClick={handleBookAnother}
            ariaLabel={t('done.bookAnother.ariaLabel')}
            data-testid="book-another-button"
            fullWidth
          >
            {t('done.bookAnother')}
          </Button>
        )}

        {/* Retry: failed only */}
        {isFailed && (
          <Button
            variant="primary"
            onClick={handleRetry}
            ariaLabel={t('done.retry.ariaLabel')}
            data-testid="retry-button"
            fullWidth
          >
            {t('done.retry')}
          </Button>
        )}

        {/* Go home: always */}
        <Button
          variant="secondary"
          onClick={handleGoHome}
          ariaLabel={t('done.goHome.ariaLabel')}
          data-testid="home-button"
          fullWidth
        >
          {t('done.goHome')}
        </Button>
      </div>
    </div>
  );
}
