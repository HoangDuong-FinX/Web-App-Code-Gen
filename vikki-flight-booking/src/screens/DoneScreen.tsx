import React from 'react';
import { vi } from '../i18n/vi';
import type { AppState, AppAction } from '../types';
import { Button } from '../components/ui/Button';
import { AlertNote } from '../components/ui/AlertNote';
import { ResultIcon } from '../components/ui/ResultIcon';
import { Divider } from '../components/ui/Divider';
import { formatVND } from '../utils/format';

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const DoneScreen: React.FC<Props> = ({ state, dispatch }) => {
  const result = state.bookingResult;

  if (!result) {
    return (
      <div className="p-4">
        <AlertNote visible tone="error">{vi.common.error}</AlertNote>
        <Button variant="primary" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })} fullWidth>
          {vi.done.goHome}
        </Button>
      </div>
    );
  }

  const { paymentResult, outboundBookingCode, transactionId, amount, timestamp, errorMessage, viaHost } = result;
  const isSuccess = paymentResult === 'success' || paymentResult === 'simulated';
  const isPartial = paymentResult === 'partial';
  const isFailed = paymentResult === 'failed';
  const isSimulated = paymentResult === 'simulated';

  const title = isSuccess || isSimulated
    ? vi.done.successTitle
    : isFailed
    ? vi.done.failedTitle
    : vi.done.partialTitle;

  const formattedTime = new Date(timestamp).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const handleShare = () => {
    if (typeof navigator.share === 'function') {
      navigator.share({
        title: vi.done.successTitle,
        text: `${vi.done.bookingCode}: ${outboundBookingCode ?? ''} — ${formatVND(amount)}`,
      }).catch(() => {
        // silent failure if unsupported
      });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const handleRetry = () => {
    dispatch({ type: 'SET_BOOKING_RESULT', result: { ...result, paymentResult: 'failed', errorMessage: null } });
    dispatch({ type: 'NAVIGATE', screen: 'checkout' });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      <ResultIcon state={paymentResult} data-testid="result-status-icon" />

      <h1 className="text-[var(--text-title-1)] text-[var(--color-text-primary)] text-center" data-testid="result-title">
        {title}
      </h1>

      <p
        className="text-[var(--text-title-2)] font-bold text-[var(--color-text-primary)]"
        data-testid="result-amount"
      >
        {(isSuccess || isPartial) ? `−${formatVND(amount)}` : formatVND(amount)}
      </p>

      <p className="text-sm text-[var(--color-text-secondary)]" data-testid="result-timestamp">
        {formattedTime}
      </p>

      {/* Simulated payment banner — BR-12 */}
      {isSimulated && (
        <AlertNote visible tone="warning" data-testid="simulated-payment-banner">
          {vi.done.simulatedBanner}
        </AlertNote>
      )}

      {/* Partial payment note */}
      {isPartial && (
        <AlertNote visible tone="warning">
          {vi.done.partialNote}
        </AlertNote>
      )}

      {/* Transaction details */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)] w-full">
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          {vi.done.transactionDetails}
        </span>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">{vi.done.paidTo}</span>
          <span className="text-[var(--color-text-primary)]">{vi.done.merchant}</span>
        </div>
        {outboundBookingCode && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">{vi.done.bookingCode}</span>
            <span className="font-mono text-[var(--color-text-primary)]">{outboundBookingCode}</span>
          </div>
        )}
        {/* BR-13: only show transactionId if it exists */}
        {transactionId && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-text-secondary)]">{vi.done.transactionId}</span>
            <span className="font-mono text-[var(--color-text-primary)]">{transactionId}</span>
          </div>
        )}
        <Divider />
        <div className="flex items-start gap-2 text-sm">
          <span aria-hidden="true">💬</span>
          <span className="text-[var(--color-text-secondary)]">{vi.done.description}</span>
        </div>
      </div>

      {/* Failed state error */}
      {isFailed && errorMessage && (
        <AlertNote visible tone="error">
          {errorMessage}
        </AlertNote>
      )}

      {/* VAT note — only on success/simulated */}
      {(isSuccess || isSimulated) && (
        <p className="text-xs text-[var(--color-text-secondary)] text-center" data-testid="vat-invoice-info-note">
          {vi.done.vatNote}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 w-full">
        {(isSuccess || isSimulated) && (
          <Button
            variant="secondary"
            ariaLabel={vi.done.shareLabel}
            data-testid="share-button"
            onClick={handleShare}
            fullWidth
          >
            {vi.done.share}
          </Button>
        )}
        {!isFailed && (
          <Button
            variant="secondary"
            ariaLabel={vi.done.bookAnotherLabel}
            data-testid="book-another-button"
            onClick={handleReset}
            fullWidth
          >
            {vi.done.bookAnother}
          </Button>
        )}
        <Button
          variant="secondary"
          ariaLabel={vi.done.goHomeLabel}
          data-testid="home-button"
          onClick={handleReset}
          fullWidth
        >
          {vi.done.goHome}
        </Button>
        {isFailed && (
          <Button
            variant="primary"
            ariaLabel={vi.done.retryLabel}
            data-testid="retry-button"
            onClick={handleRetry}
            fullWidth
          >
            {vi.done.retry}
          </Button>
        )}
      </div>
    </div>
  );
};
