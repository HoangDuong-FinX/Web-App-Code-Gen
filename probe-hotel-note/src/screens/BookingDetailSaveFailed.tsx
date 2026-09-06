// screens/BookingDetailSaveFailed.tsx
import React, { useState } from 'react';
import { Booking } from '../types';
import { saveNote } from '../fixtures';
import { t } from '../i18n';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Alert } from '../components/Alert';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  failedNoteText: string;
  onBack: () => void;
  onRetrySuccess: () => void;
  onRetryFailed: (noteText: string) => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  booking,
  failedNoteText,
  onBack,
  onRetrySuccess,
  onRetryFailed,
}) => {
  const [noteText, setNoteText] = useState(failedNoteText);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRetry = async () => {
    setIsSaving(true);
    try {
      await saveNote(booking.referenceId, noteText);
      setShowSuccess(true);
      onRetrySuccess();
    } catch (err) {
      onRetryFailed(noteText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    onBack();
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Button
        variant="ghost"
        icon="chevron-left"
        ariaLabel={t('booking-detail-save-failed.button-back')}
        onClick={onBack}
      />

      <Text variant="heading-lg">{t('booking-detail-save-failed.title')}</Text>

      <Text variant="body-lg" role="booking-hotel-name">
        {booking.hotelName}
      </Text>

      <Text variant="body-md" role="booking-dates">
        {booking.checkInDate} – {booking.checkOutDate}
      </Text>

      <Text variant="body-sm" role="booking-reference-id">
        Reference: {booking.referenceId}
      </Text>

      <Alert variant="error" visible={true}>
        {t('booking-detail-save-failed.error-message')}
      </Alert>

      <Text variant="label-md" htmlFor="note-input-failed">
        {t('booking-detail-save-failed.label-add-note')}
      </Text>

      <TextArea
        id="note-input-failed"
        maxLength={200}
        placeholder={t('booking-detail-save-failed.placeholder-note')}
        ariaLabel={t('booking-detail-save-failed.aria-label-note')}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />

      <Text variant="caption-sm" role="character-count">
        {noteText.length} / 200
      </Text>

      <div className="flex gap-2">
        <Button
          variant="primary"
          disabled={isSaving}
          onClick={handleRetry}
          aria-label={t('booking-detail-save-failed.button-retry')}
        >
          {t('booking-detail-save-failed.button-retry')}
        </Button>
        <Button
          variant="secondary"
          disabled={isSaving}
          onClick={handleDiscard}
          aria-label={t('booking-detail-save-failed.button-discard')}
        >
          {t('booking-detail-save-failed.button-discard')}
        </Button>
      </div>

      {showSuccess && (
        <Alert
          variant="success"
          visible={showSuccess}
          onDismiss={() => setShowSuccess(false)}
          autoDismissMs={2500}
        >
          {t('booking-detail.success-message')}
        </Alert>
      )}
    </div>
  );
};
