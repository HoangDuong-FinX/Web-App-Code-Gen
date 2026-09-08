import type { BookingState } from '../types';
import { t } from '../i18n';
import { formatPrice } from '../formatPrice';

interface Props {
  booking: BookingState;
  onHome: () => void;
}

export function DonePartialScreen({ booking, onHome }: Props) {
  const result = booking.paymentResult;

  return (
    <div className="flex flex-col items-center gap-4 p-8 min-h-screen">
      <div data-testid="status-icon" className="w-16 h-16 rounded-full bg-[#FF9800] flex items-center justify-center" aria-hidden="true">
        <span className="text-white text-3xl font-bold">!</span>
      </div>

      <h1 className="text-xl font-semibold text-[#191919] text-center">{t('donePartial.title')}</h1>
      <p data-testid="amount-display" className="text-2xl font-bold text-[#191919] text-center">
        {formatPrice(result?.amount ?? 0)}
      </p>
      <p data-testid="partial-explanation" className="text-sm text-[#555555] text-center">
        {t('donePartial.explanation')}
      </p>

      <div className="w-full bg-white rounded-2xl p-4 shadow-[0_5px_10px_rgba(89,27,27,0.05)] flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-sm text-[#555555]">{t('donePartial.outboundBookingCode')}</span>
          <span data-testid="booking-code-row" className="text-sm font-semibold">{result?.bookingCode ?? ''}</span>
        </div>
        {result?.transactionId && (
          <div className="flex justify-between">
            <span className="text-sm text-[#555555]">{t('donePartial.outboundTransactionId')}</span>
            <span data-testid="transaction-id-row" className="text-sm font-semibold">{result.transactionId}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        data-testid="home-action"
        aria-label={t('donePartial.home.aria')}
        className="w-full h-14 bg-[#E12127] text-white rounded-lg text-lg font-medium"
        onClick={onHome}
      >
        {t('donePartial.home')}
      </button>
    </div>
  );
}
