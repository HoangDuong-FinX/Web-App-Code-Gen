import React from 'react';
import { Text } from '../components/Text';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { t } from '../i18n';
import { Booking } from '../fixtures/bookings';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  currentNote: string;
  onNoteChange: (text: string) => void;
  onRetry: () => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  booking,
  currentNote,
  onNoteChange,
  onRetry,
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      onRetry();
    } finally {
      setIsRetrying(false);
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

      <Alert variant="error" ariaLabel={t('error.save-failed')}>
        {t('error.save-failed')}
      </Alert>

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
          onClick={handleRetry}
          disabled={isRetrying}
          ariaLabel={t('error.retry-button-aria')}
        >
          {isRetrying ? 'Retrying...' : t('error.retry-button')}
        </Button>
      </div>
    </div>
  );
};
