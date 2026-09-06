import React, { useState } from 'react';
import { Booking, saveNote } from '../fixtures';
import { t } from '../i18n';

interface BookingDetailProps {
  booking: Booking;
  onSaveSuccess: () => void;
  onSaveFailure: () => void;
  onBackToList: () => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({
  booking,
  onSaveSuccess,
  onSaveFailure,
  onBackToList,
}) => {
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSaveNote = async () => {
    setIsSaving(true);
    const result = await saveNote(booking.id, noteText);
    setIsSaving(false);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setNoteText('');
        onSaveSuccess();
      }, 2000);
    } else {
      onSaveFailure();
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

      <h1 className="text-2xl font-bold">{t('page-title-detail')}</h1>

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

      <div className="border-t border-gray-200 pt-4">
        <label htmlFor="note-input" className="block font-semibold mb-2">
          {t('label-note')}
        </label>
        <textarea
          id="note-input"
          maxLength={200}
          placeholder={t('placeholder-note')}
          value={noteText}
          onChange={(e) => setNoteText(e.currentTarget.value)}
          aria-label={t('aria-note-input')}
          aria-describedby="character-counter"
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
        />
        <div id="character-counter" className="text-xs text-gray-500 mt-2">
          {t('label-character-count', { count: noteText.length })}
        </div>
      </div>

      {showSuccess && (
        <div
          role="status"
          className="p-3 bg-green-100 text-green-800 rounded-lg"
          aria-label={t('success-note-saved')}
        >
          {t('success-note-saved')}
        </div>
      )}

      <button
        onClick={handleSaveNote}
        disabled={isSaving || noteText.trim().length === 0}
        aria-label={t('button-save-note')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isSaving ? 'Saving...' : t('button-save-note')}
      </button>
    </div>
  );
};