import React from 'react';
import { Button } from '../components/Button';
import { Text } from '../components/Text';
import { Divider } from '../components/Divider';
import { AlertNote } from '../components/AlertNote';
import { ResultIcon } from '../components/ResultIcon';
import { t, formatVnd, formatVndMinus } from '../i18n';
import { formatTimestamp } from '../utils/date';
import type { AppState, AppAction, ScreenId } from '../types/state';

interface DoneScreenProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (s: ScreenId) => void;
}

export function DoneScreen({ state, dispatch, navigate }: DoneScreenProps): React.ReactElement {
  const result = state.bookingResult;

  if (!result) {
    return (
      <div style={{ padding: '16px' }}>
        <Text variant="body">{t('common.loading')}</Text>
      </div>
    );
  }

  const { paymentResult, outboundBookingCode, returnBookingCode, transactionId, amount, timestamp, errorMessage } = result;

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

        {outboundBookingCode && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{isPartial ? t('done.outboundCode') : t('done.bookingCode')}</Text>
            <Text variant="mono-label" style={{ fontFamily: 'var(--font-mono)' }}>{outboundBookingCode}</Text>
          </div>
        )}

        {returnBookingCode && !isPartial && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text variant="body">{t('done.bookingCode')} (v\u1ec1)</Text>
            <Text variant="mono-label" style={{ fontFamily: 'var(--font-mono)' }}>{returnBookingCode}</Text>
          </div>
        )}

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

        {isFailed && errorMessage && (
          <>
            <Divider />
            <Text variant="body" style={{ color: 'var(--color-error)' }}>{errorMessage}</Text>
          </>
        )}

        {isPartial && (
          <>
            <Divider />
            <Text variant="body" style={{ color: 'var(--color-warning)' }}>{t('done.partial.note')}</Text>
          </>
        )}
      </div>

      {isSuccess && (
        <Text variant="footnote" data-testid="vat-invoice-info-note" style={{ textAlign: 'center' }}>
          {t('done.vatNote')}
        </Text>
      )}

      {isSimulated && (
        <AlertNote tone="warning" visible data-testid="simulated-payment-banner">
          {t('done.simulatedBanner')}
        </AlertNote>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
        {isSuccess && (
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
