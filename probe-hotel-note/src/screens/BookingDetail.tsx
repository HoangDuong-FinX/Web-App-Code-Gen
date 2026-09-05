import React, { useState } from 'react';
import type { Booking } from '../fixtures/bookings';
import { bookingsFixture } from '../fixtures/bookings';
import { saveNote } from '../fixtures/saveNote';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { t } from '../i18n';

interface BookingDetailProps {
  bookingId: string;
  onBack: () => void;
  onSaveFailed: () => void;
  onSaveSuccess: () => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({
  bookingId,
  onBack,
  onSaveFailed,
  onSaveSuccess,
}) => {
  const booking = bookingsFixture.find((b) => b.id === bookingId) as Booking;
  const [noteText, setNoteText] = useState('');
  const [saveInProgress, setSaveInProgress] = useState(false);

  const handleSave = async () => {
    setSaveInProgress(true);
    try {
      await saveNote({ bookingId, noteText });
      setSaveInProgress(false);
      onSaveSuccess();
    } catch (error) {
      setSaveInProgress(false);
      onSaveFailed();
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
      <Text variant="label">{t('add-a-note')}</Text>
      <TextArea
        maxLength={200}
        placeholder={t('note-placeholder')}
        ariaLabel={t('note-aria-label')}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        helperText={t('note-helper', { count: noteText.length })}
      />
      <Button
        variant="primary"
        onPress={handleSave}
        disabled={saveInProgress}
        ariaLabel={t('save-button-aria')}
      >
        {t('save-note')}
      </Button>
    </div>
  );
};
