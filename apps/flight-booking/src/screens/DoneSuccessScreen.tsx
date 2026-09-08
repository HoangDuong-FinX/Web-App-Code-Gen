import type { BookingState } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';
import { getViaHost } from '../sdk';

interface Props {
  booking: BookingState;
  onBookAnother: () => void;
  onHome: () => void;
}

export function DoneSuccessScreen({ booking, onBookAnother, onHome }: Props) {
  const result = booking.paymentResult;
  const viaHost = getViaHost();

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: t('doneSuccess.title'),
          text: `${t('doneSuccess.bookingCode')}: ${result?.bookingCode ?? ''}`,
        });
      } catch { /* user cancelled */ }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 min-h-screen">
      {/* Status icon */}
      <div data-testid="status-icon" className="w-16 h-16 rounded-full bg-[#4CAF50] flex items-center justify-center" aria-hidden="true">
        <span className="text-white text-3xl">\u2713</span>
      </div>

      <h1 className="text-xl font-semibold text-[#191919] text-center">{t('doneSuccess.title')}</h1>
      <p data-testid="amount-display" className="text-2xl font-bold text-[#191919] text-center">
        \u2212{formatPrice(result?.amount ?? 0)}
      </p>

      {/* Simulated warning */}
      {!viaHost && (
        <div data-testid="simulated-warning" aria-label={t('doneSuccess.simulatedWarning.aria')} className="w-full p-3 bg-yellow-50 rounded-lg text-center">
          <p className="text-sm text-[#555555]">{t('doneSuccess.simulatedWarning')}</p>
        </div>
      )}

      {/* Details card */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-[#555555]">{t('doneSuccess.bookingCode')}</span>
          <span data-testid="booking-code-row" className="text-sm font-semibold">{result?.bookingCode ?? ''}</span>
        </div>
        {result?.transactionId && (
          <div className="flex justify-between">
            <span className="text-sm text-[#555555]">{t('doneSuccess.transactionId')}</span>
            <span data-testid="transaction-id-row" className="text-sm font-semibold">{result.transactionId}</span>
          </div>
        )}
        {booking.vatRequested && (
          <p data-testid="vat-notice" className="text-xs text-[#999999]">{t('doneSuccess.vatNotice')}</p>
        )}
      </div>

      {/* Share */}
      <button
        type="button"
        data-testid="share-action"
        aria-label={t('doneSuccess.share.aria')}
        disabled={typeof navigator === 'undefined' || !navigator.share}
        className="w-full py-3 border border-[#E6E8E7] rounded-lg text-sm font-medium disabled:opacity-50"
        onClick={handleShare}
      >
        {t('doneSuccess.share')}
      </button>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button
          type="button"
          data-testid="book-another-action"
          aria-label={t('doneSuccess.bookAnother.aria')}
          className="flex-1 py-3 border border-[#E12127] text-[#E12127] rounded-lg text-sm font-medium"
          onClick={onBookAnother}
        >
          {t('doneSuccess.bookAnother')}
        </button>
        <button
          type="button"
          data-testid="home-action"
          aria-label={t('doneSuccess.home.aria')}
          className="flex-1 py-3 bg-[#E12127] text-white rounded-lg text-sm font-medium"
          onClick={onHome}
        >
          {t('doneSuccess.home')}
        </button>
      </div>
    </div>
  );
}
