import React from 'react';
import { t } from '../i18n';
import type { AppState } from '../types/state';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { AlertNote } from '../components/ui/AlertNote';
import { ResultIcon } from '../components/ui/ResultIcon';
import { Divider } from '../components/ui/Divider';

interface DoneProps {
  state: AppState;
  onNavigate: (screen: AppState['screen']) => void;
  onUpdateState: (updates: Partial<AppState>) => void;
  onReset: () => void;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${hh}:${mm}, ${day} tháng ${month} ${year}`;
}

function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function DoneScreen({ state, onNavigate, onUpdateState, onReset }: DoneProps) {
  const result = state.bookingResult;

  if (!result) {
    onNavigate('search');
    return null;
  }

  const { paymentResult, transactionId, bookingCode, amount, timestamp, errorMessage, viaHost } = result;

  const isSuccess = paymentResult === 'success';
  const isSimulated = paymentResult === 'simulated';
  const isFailed = paymentResult === 'failed';
  const isPartial = paymentResult === 'partial';

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: t('done.success.title'),
        text: `${t('done.bookingCode')}: ${bookingCode ?? ''} | ${t('done.txId')}: ${transactionId ?? ''}`,
      });
    } catch {
      // silent if unsupported or cancelled
    }
  };

  const handleReset = () => {
    onReset();
    onNavigate('search');
  };

  const handleRetry = () => {
    onUpdateState({ bookingResult: null });
    onNavigate('checkout');
  };

  let iconState: 'success' | 'failed' | 'partial' | 'simulated' = 'success';
  if (isFailed) iconState = 'failed';
  else if (isPartial) iconState = 'partial';
  else if (isSimulated) iconState = 'simulated';

  let titleKey: Parameters<typeof t>[0] = 'done.success.title';
  if (isFailed) titleKey = 'done.failed.title';
  else if (isPartial) titleKey = 'done.partial.title';

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-lg mx-auto">
      <ResultIcon state={iconState} data-testid="result-status-icon" />

      <h1
        className="text-[28px] font-bold leading-[1.35] font-display text-center"
        data-testid="result-title"
      >
        {t(titleKey)}
      </h1>

      <Text variant="title-2" as="span" data-testid="result-amount">
        {(isSuccess || isSimulated || isPartial) ? '−' : ''}{formatPrice(amount)}
      </Text>

      <Text variant="body" as="span" data-testid="result-timestamp">
        {formatTimestamp(timestamp)}
      </Text>

      {/* Simulated payment banner — BR-12 */}
      {isSimulated && (
        <AlertNote tone="warning" data-testid="simulated-payment-banner">
          {t('done.simulated.banner')}
        </AlertNote>
      )}

      {isFailed && errorMessage && (
        <AlertNote tone="error" role="alert">
          {t('done.failedReason', { reason: errorMessage })}
        </AlertNote>
      )}

      {isPartial && (
        <AlertNote tone="warning" role="alert">
          {t('done.partialNote')}
        </AlertNote>
      )}

      {/* Transaction details card */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--gray-50)] border border-[var(--gray-200)] w-full">
        <Text variant="body-semibold" as="span">{t('done.txDetails')}</Text>
        <div className="flex justify-between">
          <Text variant="body" as="span">{t('done.paidTo')}</Text>
          <Text variant="body" as="span">{t('done.merchant')}</Text>
        </div>
        {bookingCode && (
          <div className="flex justify-between">
            <Text variant="body" as="span">{t('done.bookingCode')}</Text>
            <Text variant="mono-label" as="span">{bookingCode}</Text>
          </div>
        )}
        {/* BR-13: only show transactionId if it exists */}
        {transactionId && (
          <div className="flex justify-between">
            <Text variant="body" as="span">{t('done.txId')}</Text>
            <Text variant="mono-label" as="span">{transactionId}</Text>
          </div>
        )}
        <Divider />
        <div className="flex gap-2">
          <Text variant="body" as="span">💬</Text>
          <Text variant="body" as="span">{t('done.description')}</Text>
        </div>
      </div>

      {/* VAT note — only on success/simulated */}
      {(isSuccess || isSimulated) && (
        <Text variant="footnote" as="p" className="text-center" data-testid="vat-invoice-info-note">
          {t('done.vatNote')}
        </Text>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-2 w-full">
        {(isSuccess || isSimulated) && (
          <Button
            variant="secondary"
            fullWidth
            aria-label={t('done.share.aria')}
            data-testid="share-button"
            onClick={handleShare}
          >
            {t('done.share')}
          </Button>
        )}
        {(isSuccess || isSimulated || isPartial) && (
          <Button
            variant="secondary"
            fullWidth
            aria-label={t('done.bookAnother.aria')}
            data-testid="book-another-button"
            onClick={handleReset}
          >
            {t('done.bookAnother')}
          </Button>
        )}
        <Button
          variant="secondary"
          fullWidth
          aria-label={t('done.home.aria')}
          data-testid="home-button"
          onClick={handleReset}
        >
          {t('done.home')}
        </Button>
        {isFailed && (
          <Button
            variant="primary"
            fullWidth
            aria-label={t('done.retry.aria')}
            data-testid="retry-button"
            onClick={handleRetry}
          >
            {t('done.retry')}
          </Button>
        )}
      </div>
    </div>
  );
}
