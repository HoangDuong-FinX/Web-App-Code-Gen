import React from 'react';
import { Booking, saveNote } from '../fixtures';
import { t } from '../i18n';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  noteText: string;
  onRetrySuccess: () => void;
  onRetryFailure: () => void;
  onNoteChange: (text: string) => void;
  onBackToList: () => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  booking,
  noteText,
  onRetrySuccess,
  onRetryFailure,
  onNoteChange,
  onBackToList,
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    const result = await saveNote(booking.id, noteText);
    setIsRetrying(false);

    if (result.success) {
      onRetrySuccess();
    } else {
      onRetryFailure();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl">
      <button
        onClick={onBackToList}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
        aria-label="Back to bookings"
      >
        ← Back to Bookings
      </button>

      <h1 className="text-2xl font-bold">{t('page-title-detail-failed')}</h1>

      <div className="border-t border-gray-200 pt-4">
        <div className="mb-4">
          <div className="text-lg font-semibold">{booking.hotelName}</div>
          <div className="text-sm text-gray-600">
            {formatDate(booking.bookingDatesStart)} – {formatDate(booking.bookingDatesEnd)}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {t('label-booking-reference')}: {booking.bookingReference}
          </div>
        </div>
      </div>

      <div
        id="error-message"
        role="alert"
        className="p-3 bg-red-100 text-red-800 rounded-lg"
        aria-label={t('error-save-failed')}
      >
        {t('error-save-failed')}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label htmlFor="note-input" className="block font-semibold mb-2">
          {t('label-note')}
        </label>
        <textarea
          id="note-input"
          maxLength={200}
          placeholder={t('placeholder-note')}
          value={noteText}
          onChange={(e) => onNoteChange(e.currentTarget.value)}
          aria-label={t('aria-note-input')}
          aria-describedby="character-counter error-message"
          className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          rows={4}
        />
        <div id="character-counter" className="text-xs text-gray-500 mt-2">
          {t('label-character-count', { count: noteText.length })}
        </div>
      </div>

      <button
        onClick={handleRetry}
        disabled={isRetrying || noteText.trim().length === 0}
        aria-label={t('button-retry-save')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isRetrying ? 'Retrying...' : t('button-retry-save')}
      </button>
    </div>
  );
};