import { useEffect, useState } from 'react';
import { loadBookingDetail, saveNote, SaveNoteResult } from '../fixtures/bookings';
import { Booking } from '../types';
import { t } from '../i18n/vi';

interface BookingDetailProps {
  bookingId: string;
  noteText: string;
  onNoteChange: (text: string) => void;
  onBack: () => void;
  onSaveFailed: () => void;
}

export default function BookingDetail({
  bookingId,
  noteText,
  onNoteChange,
  onBack,
  onSaveFailed,
}: BookingDetailProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const data = loadBookingDetail(bookingId);
      setBooking(data);
      onNoteChange(data.noteText || '');
    } catch (err) {
      setError(t('error_load_booking_detail'));
    } finally {
      setLoading(false);
    }
  }, [bookingId, onNoteChange]);

  const handleSave = async () => {
    if (!booking) return;
    setSaving(true);
    setSuccessMessage(null);
    setError(null);

    try {
      const result: SaveNoteResult = await saveNote(bookingId, noteText);
      if (result.success) {
        setSuccessMessage(t('note_saved'));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || t('error_save_note'));
        onSaveFailed();
      }
    } catch (err) {
      setError(t('error_save_note'));
      onSaveFailed();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('booking_details')}</h1>
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('booking_details')}</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          aria-label={t('back')}
        >
          {t('back')}
        </button>
      </div>
    );
  }

  if (!booking) return null;

  const charCount = noteText.length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('booking_details')}</h1>

      <div className="space-y-4 bg-gray-50 p-4 rounded">
        <div className="font-bold text-gray-900">{booking.hotelName}</div>
        <div className="flex gap-4">
          <span className="text-sm text-gray-600">{t('check_in')}:</span>
          <span className="text-gray-900">{booking.checkInDate}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-sm text-gray-600">{t('check_out')}:</span>
          <span className="text-gray-900">{booking.checkOutDate}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-sm text-gray-600">{t('reference')}:</span>
          <span className="text-gray-900">{booking.bookingReference}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="note-input" className="block font-bold text-gray-900">
          {t('personal_note')}
        </label>
        <textarea
          id="note-input"
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value.slice(0, 200))}
          placeholder={t('add_personal_note')}
          maxLength={200}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          aria-label={t('note_input_aria_label')}
        />
        <div className="text-sm text-gray-600">
          {charCount}/200 {t('characters')}
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          aria-label={t('back')}
          disabled={saving}
        >
          {t('back')}
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          aria-label={t('save_note')}
          disabled={saving}
        >
          {saving ? t('saving') : t('save_note')}
        </button>
      </div>
    </div>
  );
}
