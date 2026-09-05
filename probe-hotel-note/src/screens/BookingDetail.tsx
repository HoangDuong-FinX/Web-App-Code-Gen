import React, { useState } from 'react';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { InlineMessage } from '../components/InlineMessage';
import { t } from '../i18n/vi';
import { saveNoteFixture } from '../fixtures/saveNote';
import type { Booking } from '../types/index';

interface BookingDetailProps {
  booking: Booking;
  onSaveSuccess: () => void;
  onSaveFailed: (noteText: string) => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({
  booking,
  onSaveSuccess,
  onSaveFailed,
}) => {
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveNoteFixture(booking.bookingId, noteText);
      if (result.success) {
        setShowSuccess(true);
        setNoteText('');
        setTimeout(() => {
          setShowSuccess(false);
          onSaveSuccess();
        }, 1500);
      } else {
        onSaveFailed(noteText);
      }
    } catch (error) {
      onSaveFailed(noteText);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack direction="column" gap="16" className="p-4">
      <Text variant="heading1">{t('booking.detail.heading')}</Text>

      <Stack direction="column" gap="12">
        <Text variant="body-strong">{booking.hotelName}</Text>
        <Text variant="body">
          {t('booking.detail.checkIn')}: {booking.checkIn}
        </Text>
        <Text variant="body">
          {t('booking.detail.checkOut')}: {booking.checkOut}
        </Text>
        <Text variant="caption">
          {t('booking.detail.confirmation')}{booking.confirmationNumber}
        </Text>
      </Stack>

      <Text variant="label">{t('booking.note.label')}</Text>

      <TextInput
        placeholder={t('booking.note.placeholder')}
        maxLength={200}
        value={noteText}
        onChange={setNoteText}
        ariaLabel={t('booking.note.inputLabel')}
        ariaDescription={t('booking.note.inputDescription')}
      />

      <Text variant="caption">
        {t('booking.note.charCount', { current: noteText.length })}
      </Text>

      <Button
        variant="primary"
        onClick={handleSave}
        disabled={isSaving}
        ariaLabel={t('booking.note.savingLabel')}
      >
        {isSaving ? 'Saving...' : t('booking.note.saveButton')}
      </Button>

      <InlineMessage
        variant="success"
        visible={showSuccess}
        ariaLive="polite"
      >
        {t('booking.note.successMessage')}
      </InlineMessage>
    </Stack>
  );
};
