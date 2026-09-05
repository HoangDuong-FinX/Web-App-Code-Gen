import React, { useState } from 'react';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';
import { InlineMessage } from '../components/InlineMessage';
import { t } from '../i18n/vi';
import { saveNoteFixture } from '../fixtures/saveNote';
import type { Booking } from '../types/index';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  noteText: string;
  onRetrySuccess: () => void;
  onRetryFailed: (noteText: string) => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  booking,
  noteText: initialNoteText,
  onRetrySuccess,
  onRetryFailed,
}) => {
  const [noteText, setNoteText] = useState(initialNoteText);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const result = await saveNoteFixture(booking.bookingId, noteText);
      if (result.success) {
        setNoteText('');
        onRetrySuccess();
      } else {
        onRetryFailed(noteText);
      }
    } catch (error) {
      onRetryFailed(noteText);
    } finally {
      setIsRetrying(false);
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

      <InlineMessage variant="error" visible={true} ariaLive="assertive" role="alert">
        {t('booking.note.errorMessage')}
      </InlineMessage>

      <Text variant="label">{t('booking.note.label')}</Text>

      <TextInput
        placeholder={t('booking.note.placeholder')}
        maxLength={200}
        initialValue={noteText}
        onChange={setNoteText}
        ariaLabel={t('booking.note.inputLabel')}
        ariaDescription={t('booking.note.inputDescriptionWithPreserved')}
      />

      <Text variant="caption">
        {t('booking.note.charCount', { current: noteText.length })}
      </Text>

      <Button
        variant="primary"
        onClick={handleRetry}
        disabled={isRetrying}
        ariaLabel={t('booking.note.retryLabel')}
      >
        {isRetrying ? 'Retrying...' : t('booking.note.retryButton')}
      </Button>
    </Stack>
  );
};
