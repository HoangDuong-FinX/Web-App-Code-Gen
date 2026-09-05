import React, { useState } from 'react';
import { Booking } from '../types';
import { saveNote } from '../fixtures/saveNote';
import { Stack } from '../components/Stack';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Alert } from '../components/Alert';
import { t } from '../i18n/vi';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  noteText: string;
  onNoteChange: (text: string) => void;
  onRetrySuccess: () => void;
  onRetryFailure: () => void;
  onBack: () => void;
}

export function BookingDetailSaveFailed({
  booking,
  noteText,
  onNoteChange,
  onRetrySuccess,
  onRetryFailure,
  onBack,
}: BookingDetailSaveFailedProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const result = await saveNote(booking.bookingId, noteText);
      if (result.success) {
        onRetrySuccess();
      } else {
        onRetryFailure();
      }
    } catch (error) {
      console.error('Error retrying save:', error);
      onRetryFailure();
    } finally {
      setIsRetrying(false);
    }
  };

  const charCount = noteText.length;
  const maxChars = 200;

  return (
    <Stack direction="column" gap="4" className="booking-detail-save-failed">
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

      <Alert variant="error">{t('booking.saveFailed')}</Alert>

      <Text variant="label">{t('booking.noteLabel')}</Text>

      <TextArea
        value={noteText}
        onChange={(e) => onNoteChange(e.target.value)}
        maxLength={maxChars}
        placeholder={t('booking.notePlaceholder')}
        aria-label={t('booking.noteAriaLabel')}
        disabled={isRetrying}
      />

      <Text variant="body-small" color="secondary">
        {t('booking.charCount', { current: charCount, max: maxChars })}
      </Text>

      <Button
        variant="primary"
        onClick={handleRetry}
        disabled={isRetrying}
        aria-label={t('booking.retryButton')}
      >
        {isRetrying ? t('common.saving') : t('booking.retryButton')}
      </Button>
    </Stack>
  );
}