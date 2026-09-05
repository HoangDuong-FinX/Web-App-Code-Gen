import React, { useState } from 'react';
import { Booking } from '../types';
import { saveNote } from '../fixtures/saveNote';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { t } from '../i18n/vi';

interface BookingDetailProps {
  booking: Booking;
  noteText: string;
  onNoteChange: (text: string) => void;
  onSaveSuccess: () => void;
  onSaveFailure: () => void;
  onBack: () => void;
}

export function BookingDetail({
  booking,
  noteText,
  onNoteChange,
  onSaveSuccess,
  onSaveFailure,
  onBack,
}: BookingDetailProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveNote(booking.bookingId, noteText);
      if (result.success) {
        onSaveSuccess();
      } else {
        onSaveFailure();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      onSaveFailure();
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = noteText.length;
  const maxChars = 200;

  return (
    <Stack direction="column" gap="4" className="booking-detail">
      <Button
        variant="ghost"
        aria-label={t('common.back')}
        onClick={onBack}
        className="back-button"
      >
        {t('common.backArrow')}
      </Button>

      <Stack direction="column" gap="2">
        <Text variant="body-strong">{booking.hotelName}</Text>
        <Text variant="body">
          {t('bookings.dates', {
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
          })}
        </Text>
        <Text variant="body-small" color="secondary">
          {t('booking.reference', { ref: booking.bookingId })}
        </Text>
      </Stack>

      <Text variant="label">{t('booking.noteLabel')}</Text>

      <TextArea
        value={noteText}
        onChange={(e) => onNoteChange(e.target.value)}
        maxLength={maxChars}
        placeholder={t('booking.notePlaceholder')}
        aria-label={t('booking.noteAriaLabel')}
        disabled={isSaving}
      />

      <Text variant="body-small" color="secondary">
        {t('booking.charCount', { current: charCount, max: maxChars })}
      </Text>

      <Button
        variant="primary"
        onClick={handleSave}
        disabled={isSaving}
        aria-label={t('booking.saveButton')}
      >
        {isSaving ? t('common.saving') : t('booking.saveButton')}
      </Button>
    </Stack>
  );
}