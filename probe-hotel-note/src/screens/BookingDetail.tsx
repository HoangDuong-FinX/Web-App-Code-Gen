import { useEffect, useState } from 'react';
import { loadBookingDetail, saveNote } from '../fixtures/bookings';
import type { Booking } from '../types';
import { i18n } from '../i18n/vi';

interface BookingDetailProps {
  bookingId: string;
  noteText: string;
  onNoteChange: (text: string) => void;
  onSaveSuccess: () => void;
  onSaveFailed: (error: string) => void;
  onBack: () => void;
}

function BookingDetail({
  bookingId,
  noteText,
  onNoteChange,
  onSaveSuccess,
  onSaveFailed,
  onBack,
}: BookingDetailProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await loadBookingDetail(bookingId);
        setBooking(data);
        onNoteChange(data.noteText || '');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : i18n['error.loadBookingDetail']
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [bookingId, onNoteChange]);

  const handleSave = async () => {
    if (!booking) return;

    try {
      setIsSaving(true);
      setSuccessMessage(null);
      const result = await saveNote(bookingId, noteText);

      if (result.success) {
        setSuccessMessage(i18n['message.noteSaved']);
        onSaveSuccess();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorMsg =
          result.message || i18n['error.saveFailed'];
        onSaveFailed(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : i18n['error.saveFailed'];
      onSaveFailed(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {i18n['screen.bookingDetail.title']}
        </h1>
        <div className="text-gray-500">{i18n['state.loading']}</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">
          {i18n['screen.bookingDetail.title']}
        </h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-700">
            {error || i18n['error.loadBookingDetail']}
          </p>
        </div>
      </div>
    );
  }

  const charCount = noteText.length;
  const maxChars = 200;

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {i18n['screen.bookingDetail.title']}
      </h1>

      <div className="mb-6 space-y-4">
        <div className="font-bold text-lg">{booking.hotelName}</div>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div>
            <span className="text-sm text-gray-600">
              {i18n['field.checkIn']}:
            </span>
            <div className="font-medium">{booking.checkInDate}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div>
            <span className="text-sm text-gray-600">
              {i18n['field.checkOut']}:
            </span>
            <div className="font-medium">{booking.checkOutDate}</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4">
          <div>
            <span className="text-sm text-gray-600">
              {i18n['field.reference']}:
            </span>
            <div className="font-medium">{booking.bookingReference}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2">
          {i18n['field.note']}
        </label>
        <textarea
          value={noteText}
          onChange={(e) => onNoteChange(e.currentTarget.value.slice(0, 200))}
          placeholder={i18n['placeholder.note']}
          maxLength={200}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          aria-label={i18n['aria.noteInput']}
        />
        <div className="text-xs text-gray-600 mt-2">
          {charCount}/{maxChars} {i18n['label.characters']}
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          aria-label={i18n['button.back']}
        >
          {i18n['button.back']}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          aria-label={i18n['button.saveNote']}
        >
          {isSaving ? i18n['state.saving'] : i18n['button.saveNote']}
        </button>
      </div>
    </div>
  );
}

export default BookingDetail;