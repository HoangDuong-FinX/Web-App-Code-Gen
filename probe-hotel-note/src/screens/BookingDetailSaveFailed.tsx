import React from 'react';
import { useTranslation } from '../i18n';
import { Booking } from '../types';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Stack } from '../components/Stack';
import { Alert } from '../components/Alert';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  noteText: string;
  currentCharCount: number;
  error?: string | null;
  retryPending: boolean;
  onNoteChange: (text: string) => void;
  onRetry: () => void;
  onDiscardChanges: () => void;
}

export function BookingDetailSaveFailed({
  booking,
  noteText,
  currentCharCount,
  error,
  retryPending,
  onNoteChange,
  onRetry,
  onDiscardChanges,
}: BookingDetailSaveFailedProps) {
  const { t, tWithParam } = useTranslation();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Stack direction="column" gap="lg" fullWidth>
        <Text variant="heading1" role="heading">
          {t('bookingDetailSaveFailed.title')}
        </Text>

        <Stack direction="column" gap="md" fullWidth>
          <Text variant="body-bold" role="hotel-name-display">
            {booking.hotelName}
          </Text>

          <Stack direction="row" gap="md" alignItems="flex-start" fullWidth>
            <Text variant="caption" color="text-secondary">
              {t('bookingDetail.checkInLabel')}
            </Text>
            <Text variant="body" role="check-in-date">
              {booking.checkInDate}
            </Text>
          </Stack>

          <Stack direction="row" gap="md" alignItems="flex-start" fullWidth>
            <Text variant="caption" color="text-secondary">
              {t('bookingDetail.checkOutLabel')}
            </Text>
            <Text variant="body" role="check-out-date">
              {booking.checkOutDate}
            </Text>
          </Stack>

          <Stack direction="row" gap="md" alignItems="flex-start" fullWidth>
            <Text variant="caption" color="text-secondary">
              {t('bookingDetail.referenceLabel')}
            </Text>
            <Text variant="body" role="booking-reference">
              {booking.bookingReference}
            </Text>
          </Stack>
        </Stack>

        <Text variant="body-bold" role="note-label">
          {t('bookingDetail.noteLabel')}
        </Text>

        <TextArea
          placeholder={t('bookingDetail.notePlaceholder')}
          maxLength={200}
          value={noteText}
          onChange={onNoteChange}
          role="note-input"
          ariaLabel={t('bookingDetail.noteLabel')}
        />

        <Text variant="caption" color="text-secondary" role="character-count">
          {tWithParam('bookingDetail.characterCount', { count: currentCharCount })}
        </Text>

        <Alert
          variant="error"
          visible={true}
          role="error-message"
          ariaLabel="Error message"
        >
          {error || t('bookingDetailSaveFailed.errorMessage')}
        </Alert>

        <Stack direction="row" gap="md" justifyContent="flex-end" fullWidth>
          <Button
            variant="secondary"
            onClick={onDiscardChanges}
            role="secondary-action"
            ariaLabel={t('bookingDetailSaveFailed.discardButton')}
          >
            {t('bookingDetailSaveFailed.discardButton')}
          </Button>
          <Button
            variant="primary"
            onClick={onRetry}
            disabled={retryPending}
            role="primary-action"
            ariaLabel={t('bookingDetailSaveFailed.retryButton')}
          >
            {retryPending ? 'Retrying...' : t('bookingDetailSaveFailed.retryButton')}
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default BookingDetailSaveFailed;
