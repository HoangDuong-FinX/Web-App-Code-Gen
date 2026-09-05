import React, { useState } from 'react';
import { Booking, bookingsFixture } from '../fixtures/bookings';
import { saveNote } from '../fixtures/saveNote';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { InlineError } from '../components/InlineError';
import { t } from '../i18n';

interface BookingDetailSaveFailedProps {
  bookingId: string;
  noteText: string;
  onBack: () => void;
  onRetry: () => void;
  onRetrySuccess: () => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  bookingId,
  noteText,
  onBack,
  onRetry,
  onRetrySuccess,
}) => {
  const booking = bookingsFixture.find((b) => b.id === bookingId) as Booking;
  const [currentNoteText, setCurrentNoteText] = useState(noteText);
  const [saveInProgress, setSaveInProgress] = useState(false);

  const handleRetry = async () => {
    setSaveInProgress(true);
    try {
      await saveNote({ bookingId, noteText: currentNoteText });
      setSaveInProgress(false);
      onRetrySuccess();
    } catch (error) {
      setSaveInProgress(false);
      onRetry();
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <Button variant="ghost" onPress={onBack} ariaLabel={t('back-button-aria')}>
        ← {t('back')}
      </Button>
      <div className="flex flex-col gap-2">
        <Text variant="title">{booking.hotelName}</Text>
        <Text variant="body">
          {booking.checkInDate} – {booking.checkOutDate}
        </Text>
        <Text variant="caption">{booking.location}</Text>
      </div>
      <InlineError variant="error" role="alert">
        {t('failed-to-save-note')}
      </InlineError>
      <Text variant="label">{t('add-a-note')}</Text>
      <TextArea
        maxLength={200}
        placeholder={t('note-placeholder')}
        ariaLabel={t('note-aria-label')}
        value={currentNoteText}
        onChange={(e) => setCurrentNoteText(e.target.value)}
        helperText={t('note-helper', { count: currentNoteText.length })}
      />
      <Button
        variant="primary"
        onPress={handleRetry}
        disabled={saveInProgress}
        ariaLabel={t('retry-button-aria')}
      >
        {t('retry')}
      </Button>
    </div>
  );
};
