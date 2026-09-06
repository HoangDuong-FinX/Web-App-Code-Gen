import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { loadBookingDetail, saveNote } from '../fixtures/bookings';
import { t } from '../i18n/vi';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  noteText: string;
  onNoteChange: (text: string) => void;
  onRetrySaveSuccess: () => void;
  onRetrySaveFailed: () => void;
  onContinueEditing: () => void;
  onBack: () => void;
}

export default function BookingDetailSaveFailed({
  booking,
  noteText,
  onNoteChange,
  onRetrySaveSuccess,
  onRetrySaveFailed,
  onContinueEditing,
  onBack,
}: BookingDetailSaveFailedProps) {
  const [bookingDetail, setBookingDetail] = useState<Booking | null>(booking);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const detail = await loadBookingDetail(booking.bookingId);
        setBookingDetail(detail);
      } catch (err) {
        console.error('Failed to load booking detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [booking.bookingId]);

  const handleRetrySave = async () => {
    setIsRetrying(true);
    try {
      const result = await saveNote(booking.bookingId, noteText);
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onRetrySaveSuccess();
        }, 3000);
      } else {
        onRetrySaveFailed();
      }
    } catch (err) {
      onRetrySaveFailed();
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:text-blue-800"
          aria-label={t('back_to_bookings')}
        >
          ← {t('back')}
        </button>
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  const detail = bookingDetail || booking;
  const charCount = noteText.length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-1"
        aria-label={t('back_to_bookings')}
      >
        ← {t('back')}
      </button>

      <h1 className="text-2xl font-bold mb-6">{t('booking_details')}</h1>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-700">{t('hotel')}</p>
          <p className="text-gray-900">{detail.hotelName}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{t('check_in')}</p>
          <p className="text-gray-900">{detail.checkInDate}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{t('check_out')}</p>
          <p className="text-gray-900">{detail.checkOutDate}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">{t('location')}</p>
          <p className="text-gray-900">{detail.location}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {t('notes')}
        </label>
        <textarea
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value.slice(0, 200))}
          placeholder={t('add_note_placeholder')}
          maxLength={200}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          aria-label={t('booking_note_label')}
        />
        <p className="text-xs text-gray-500 mt-2">
          {charCount}/200
        </p>
      </div>

      <div
        className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg"
        role="alert"
        aria-live="polite"
      >
        {t('save_note_failed')}
      </div>

      {showSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg">
          {t('note_saved_successfully')}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleRetrySave}
          disabled={isRetrying}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          aria-label={t('retry_save_button')}
        >
          {isRetrying ? t('saving') : t('retry_save')}
        </button>
        <button
          onClick={onContinueEditing}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition"
          aria-label={t('continue_editing_button')}
        >
          {t('continue_editing')}
        </button>
      </div>
    </div>
  );
}