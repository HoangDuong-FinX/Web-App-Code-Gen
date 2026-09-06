// screens/BookingDetail.tsx
import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { saveNote } from '../fixtures';
import { t } from '../i18n';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Alert } from '../components/Alert';

interface BookingDetailProps {
  booking: Booking;
  onBack: () => void;
  onSaveSuccess: () => void;
  onSaveFailed: (noteText: string) => void;
}

export const BookingDetail: React.FC<BookingDetailProps> = ({
  booking,
  onBack,
  onSaveSuccess,
  onSaveFailed,
}) => {
  const [noteText, setNoteText] = useState(booking.noteText || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isEmptyOrUnchanged = !noteText.trim() || noteText === (booking.noteText || '');

  const handleSave = async () => {
    if (isEmptyOrUnchanged) return;
    setIsSaving(true);
    try {
      await saveNote(booking.referenceId, noteText);
      setShowSuccess(true);
      onSaveSuccess();
    } catch (err) {
      onSaveFailed(noteText);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Button
        variant="ghost"
        icon="chevron-left"
        ariaLabel={t('booking-detail.button-back')}
        onClick={onBack}
      />

      <Text variant="heading-lg">{t('booking-detail.title')}</Text>

      <Text variant="body-lg" role="booking-hotel-name">
        {booking.hotelName}
      </Text>

      <Text variant="body-md" role="booking-dates">
        {booking.checkInDate} – {booking.checkOutDate}
      </Text>

      <Text variant="body-sm" role="booking-reference-id">
        Reference: {booking.referenceId}
      </Text>

      <Text variant="label-md" htmlFor="note-input">
        {t('booking-detail.label-add-note')}
      </Text>

      <TextArea
        id="note-input"
        maxLength={200}
        placeholder={t('booking-detail.placeholder-note')}
        ariaLabel={t('booking-detail.aria-label-note')}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />

      <Text variant="caption-sm" role="character-count">
        {noteText.length} / 200
      </Text>

      <Button
        variant="primary"
        disabled={isEmptyOrUnchanged || isSaving}
        onClick={handleSave}
        aria-label={t('booking-detail.button-save')}
      >
        {t('booking-detail.button-save')}
      </Button>

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
