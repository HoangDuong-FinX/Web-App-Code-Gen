import React from 'react';
import { Booking } from '../App';
import { t } from '../i18n/vi';

interface BookingDetailProps {
  booking: Booking;
  noteText: string;
  loading: boolean;
  error: string | null;
  saving: boolean;
  onUpdateNoteText: (text: string) => void;
  onSaveNote: () => void;
  onBackToList: () => void;
}

export function BookingDetail({
  booking,
  noteText,
  loading,
  error,
  saving,
  onUpdateNoteText,
  onSaveNote,
  onBackToList,
}: BookingDetailProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <button
          onClick={onBackToList}
          aria-label={t('back_to_bookings_list')}
          className="px-2 py-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        >
          ← {t('back')}
        </button>
        <div className="text-center text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <button
          onClick={onBackToList}
          aria-label={t('back_to_bookings_list')}
          className="px-2 py-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
        >
          ← {t('back')}
        </button>
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
          aria-label={t('error_unable_to_load_booking_details')}
        >
          {t('error_unable_to_load_booking_details')}
        </div>
      </div>
    );
  }

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

      <div className="flex flex-col gap-2">
        <label htmlFor="note-input" className="text-sm font-medium text-gray-900">
          {t('personal_note')}
        </label>
        <textarea
          id="note-input"
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
        onClick={onSaveNote}
        disabled={saving}
        aria-label={t('save_note')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? t('saving') : t('save_note')}
      </button>
    </div>
  );
}
