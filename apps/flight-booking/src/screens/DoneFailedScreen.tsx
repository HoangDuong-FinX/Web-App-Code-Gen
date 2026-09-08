import type { BookingState } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';

interface Props {
  booking: BookingState;
  onRetry: () => void;
  onHome: () => void;
}

export function DoneFailedScreen({ booking, onRetry, onHome }: Props) {
  const result = booking.paymentResult;

  return (
    <div className="flex flex-col items-center gap-4 p-8 min-h-screen">
      <div data-testid="status-icon" className="w-16 h-16 rounded-full bg-[#F44336] flex items-center justify-center" aria-hidden="true">
        <span className="text-white text-3xl">\u2715</span>
      </div>

      <h1 className="text-xl font-semibold text-[#191919] text-center">{t('doneFailed.title')}</h1>
      <p data-testid="amount-display" className="text-2xl font-bold text-[#191919] text-center">
        {formatPrice(result?.amount ?? 0)}
      </p>
      {result?.failureReason && (
        <p data-testid="failure-reason" className="text-sm text-[#555555] text-center">{result.failureReason}</p>
      )}

      <div className="w-full bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-[#555555]">{t('doneFailed.bookingCode')}</span>
          <span data-testid="booking-code-row" className="text-sm font-semibold">{result?.bookingCode ?? ''}</span>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          type="button"
          data-testid="home-action"
          aria-label={t('doneFailed.home.aria')}
          className="flex-1 py-3 border border-[#E12127] text-[#E12127] rounded-lg text-sm font-medium"
          onClick={onHome}
        >
          {t('doneFailed.home')}
        </button>
        <button
          type="button"
          data-testid="retry-action"
          aria-label={t('doneFailed.retry.aria')}
          className="flex-1 py-3 bg-[#E12127] text-white rounded-lg text-sm font-medium"
          onClick={onRetry}
        >
          {t('doneFailed.retry')}
        </button>
      </div>
    </div>
  );
}
