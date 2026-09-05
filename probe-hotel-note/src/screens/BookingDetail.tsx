import React, { useState } from 'react';
import { Text } from '../components/Text';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { t } from '../i18n';
import { Booking } from '../fixtures/bookings';

interface BookingDetailProps {
  booking: Booking;
  currentNote: string;
  onNoteChange: (text: string) => void;
  onSave: () => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({
  booking,
  currentNote,
  onNoteChange,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <Text variant="title">{t('detail.title')}</Text>
      
      <div className="space-y-2">
        <Text variant="body-strong">{booking.hotelName}</Text>
        <Text variant="body-secondary">
          {t('detail.check-in-out', {
            checkInDate: booking.checkInDate,
            checkOutDate: booking.checkOutDate,
          })}
        </Text>
        <Text variant="body-secondary">{booking.location}</Text>
        <Text variant="body-secondary">{booking.roomInfo}</Text>
        <Text variant="body-secondary">
          {t('detail.confirmation-number', {
            confirmationNumber: booking.confirmationNumber,
          })}
        </Text>
      </div>

      <div className="border-t pt-4 space-y-3">
        <Text variant="label">{t('detail.notes-label')}</Text>
        <TextInput
          ariaLabel={t('note.input-aria')}
          placeholder={t('detail.note-placeholder')}
          maxLength={200}
          multiline
          value={currentNote}
          onChange={onNoteChange}
        />
        <Text variant="caption">
          {t('detail.character-count', {
            current: currentNote.length,
          })}
        </Text>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          ariaLabel={t('detail.save-button-aria')}
        >
          {isSaving ? 'Saving...' : t('detail.save-button')}
        </Button>
      </div>
    </div>
  );
};
