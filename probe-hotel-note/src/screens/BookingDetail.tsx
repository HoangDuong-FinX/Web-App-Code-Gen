import React, { useState, useEffect } from 'react';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Alert } from '../ui/Alert';
import { t } from '../i18n';
import { loadBookingDetail, type BookingDetail as BookingDetailData } from '../fixtures/bookingDetail';
import { saveNote } from '../fixtures/saveNote';

export interface BookingDetailProps {
  bookingId: string;
  onBack: () => void;
  onSaveSuccess: () => void;
  onSaveFailed: (noteText: string) => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({
  bookingId,
  onBack,
  onSaveSuccess,
  onSaveFailed,
}) => {
  const [booking, setBooking] = useState<BookingDetailData | null>(null);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadBookingDetail(bookingId);
        setBooking(data);
        setNoteText(data.noteText || '');
      } catch (err) {
        setError(t('booking-detail.error-generic'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage(null);
    try {
      await saveNote({ bookingId, noteText });
      setSuccessMessage(t('booking-detail.success'));
      setTimeout(() => {
        setSuccessMessage(null);
        onSaveSuccess();
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error && err.message === 'Request timed out'
        ? t('booking-detail.error-timeout')
        : t('booking-detail.error-generic');
      setError(errorMsg);
      onSaveFailed(noteText);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Text variant="body">Loading...</Text>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Text variant="body">{error}</Text>
        <Button onClick={onBack}>Back</Button>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Text variant="heading1">{t('booking-detail.title')}</Text>
      
      <div className="flex flex-col gap-4">
        <Text variant="body-bold" role="hotel-name-display">
          {booking.hotelName}
        </Text>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <Text variant="caption" color="text-secondary">
              {t('booking-detail.label-checkin')}
            </Text>
            <Text variant="body" role="check-in-date">
              {booking.checkInDate}
            </Text>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <Text variant="caption" color="text-secondary">
              {t('booking-detail.label-checkout')}
            </Text>
            <Text variant="body" role="check-out-date">
              {booking.checkOutDate}
            </Text>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <Text variant="caption" color="text-secondary">
              {t('booking-detail.label-reference')}
            </Text>
            <Text variant="body" role="booking-reference">
              {booking.bookingReference}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Text variant="body-bold" role="note-label">
          {t('booking-detail.note-label')}
        </Text>
        <TextArea
          value={noteText}
          onChange={setNoteText}
          placeholder={t('booking-detail.note-placeholder')}
          maxLength={200}
          role="note-input"
          ariaLabel={t('booking-detail.button-save-aria')}
        />
        <Text variant="caption" color="text-secondary" role="character-count">
          {t('booking-detail.character-count', { count: noteText.length })}
        </Text>
      </div>

      {successMessage && (
        <Alert variant="success" visible={true}>
          {successMessage}
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <Button
          variant="secondary"
          onClick={onBack}
          role="secondary-action"
          ariaLabel={t('booking-detail.button-back-aria')}
        >
          {t('booking-detail.button-back')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          role="primary-action"
          ariaLabel={t('booking-detail.button-save-aria')}
        >
          {saving ? 'Saving...' : t('booking-detail.button-save')}
        </Button>
      </div>
    </div>
  );
};
