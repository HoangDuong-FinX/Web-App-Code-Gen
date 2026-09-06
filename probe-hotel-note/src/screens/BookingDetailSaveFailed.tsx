import type { Booking } from '../App';
import { t } from '../i18n/vi';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  noteText: string;
  error: string | null;
  saving: boolean;
  onUpdateNoteText: (text: string) => void;
  onRetrySaveNote: () => void;
  onBackToList: () => void;
}

export function BookingDetailSaveFailed({
  booking,
  noteText,
  error,
  saving,
  onUpdateNoteText,
  onRetrySaveNote,
  onBackToList,
}: BookingDetailSaveFailedProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        onClick={onBackToList}
        aria-label={t('back_to_bookings_list')}
        className="px-2 py-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
      >
        ← {t('back')}
      </button>

      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900">{booking.hotelName}</h2>
        <div className="text-sm text-gray-600 mt-1">
          {booking.checkInDate} - {booking.checkOutDate}
        </div>
        <div className="text-sm text-gray-600">{booking.roomType}</div>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
          aria-label={error}
        >
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="note-input-failed" className="text-sm font-medium text-gray-900">
          {t('personal_note')}
        </label>
        <textarea
          id="note-input-failed"
          value={noteText}
          onChange={(e) => onUpdateNoteText(e.target.value)}
          placeholder={t('add_a_note')}
          maxLength={200}
          aria-label={t('personal_note_input')}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <div
          aria-live="polite"
          aria-label={`${noteText.length} of 200 characters`}
          className="text-xs text-gray-500 text-right"
        >
          {noteText.length}/200
        </div>
      </div>

      <button
        onClick={onRetrySaveNote}
        disabled={saving}
        aria-label={t('retry')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? t('saving') : t('retry')}
      </button>
    </div>
  );
}
