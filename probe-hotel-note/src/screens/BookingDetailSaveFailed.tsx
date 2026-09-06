import React, { useState } from 'react';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Alert } from '../ui/Alert';
import { t } from '../i18n';
import { BookingDetail } from '../fixtures/bookingDetail';
import { saveNote } from '../fixtures/saveNote';

export interface BookingDetailSaveFailedProps {
  booking: BookingDetail;
  initialNoteText: string;
  onRetrySuccess: () => void;
  onRetryFailed: (noteText: string) => void;
  onDiscard: () => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  booking,
  initialNoteText,
  onRetrySuccess,
  onRetryFailed,
  onDiscard,
}) => {
  const [noteText, setNoteText] = useState(initialNoteText);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(t('booking-detail-failed.error-message'));

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await saveNote({ bookingId: booking.id, noteText });
      setError(null);
      onRetrySuccess();
    } catch (err) {
      const errorMsg = err instanceof Error && err.message === 'Request timed out'
        ? t('booking-detail.error-timeout')
        : t('booking-detail.error-generic');
      setError(errorMsg);
      onRetryFailed(noteText);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Text variant="heading1">{t('booking-detail-failed.title')}</Text>
      
      <div className="flex flex-col gap-4">
        <Text variant="body-bold" role="hotel-name-display">
          {booking.hotelName}
        </Text>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <Text variant="caption" color="text-secondary">
              {t('booking-detail-failed.label-checkin')}
            </Text>
            <Text variant="body" role="check-in-date">
              {booking.checkInDate}
            </Text>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <Text variant="caption" color="text-secondary">
              {t('booking-detail-failed.label-checkout')}
            </Text>
            <Text variant="body" role="check-out-date">
              {booking.checkOutDate}
            </Text>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2">
            <Text variant="caption" color="text-secondary">
              {t('booking-detail-failed.label-reference')}
            </Text>
            <Text variant="body" role="booking-reference">
              {booking.bookingReference}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Text variant="body-bold" role="note-label">
          {t('booking-detail-failed.note-label')}
        </Text>
        <TextArea
          value={noteText}
          onChange={setNoteText}
          placeholder={t('booking-detail-failed.note-placeholder')}
          maxLength={200}
          role="note-input"
          ariaLabel={t('booking-detail-failed.button-retry-aria')}
        />
        <Text variant="caption" color="text-secondary" role="character-count">
          {t('booking-detail-failed.character-count', { count: noteText.length })}
        </Text>
      </div>

      {error && (
        <Alert variant="error" visible={true} role="error-message">
          {error}
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-3 justify-end">
        <Button
          variant="secondary"
          onClick={onDiscard}
          role="secondary-action"
          ariaLabel={t('booking-detail-failed.button-discard-aria')}
        >
          {t('booking-detail-failed.button-discard')}
        </Button>
        <Button
          variant="primary"
          onClick={handleRetry}
          disabled={retrying}
          role="primary-action"
          ariaLabel={t('booking-detail-failed.button-retry-aria')}
        >
          {retrying ? 'Retrying...' : t('booking-detail-failed.button-retry')}
        </Button>
      </div>
    </div>
  );
};
