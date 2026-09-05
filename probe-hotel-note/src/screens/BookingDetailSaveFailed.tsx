import React, { useState } from 'react';
import { Booking } from '../types';
import { t } from '../i18n';
import { saveNoteFixture } from '../fixtures/bookings';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Alert } from '../components/Alert';

interface BookingDetailSaveFailedProps {
  booking: Booking;
  errorMessage: string;
  onBack: () => void;
  onRetry: () => void;
  onRetrySave: (error: string) => void;
}

export const BookingDetailSaveFailed: React.FC<BookingDetailSaveFailedProps> = ({
  booking,
  errorMessage,
  onBack,
  onRetry,
  onRetrySave,
}) => {
  const [note, setNote] = useState(booking.note || '');
  const [isSaving, setIsSaving] = useState(false);
  const [noteLength, setNoteLength] = useState((booking.note || '').length);
  const [currentError, setCurrentError] = useState(errorMessage);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value.slice(0, 200);
    setNote(newNote);
    setNoteLength(newNote.length);
  };

  const handleRetry = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const result = await saveNoteFixture(booking.id, note);
      if (result.success) {
        // Update booking note in parent state
        booking.note = note;
        onRetry();
      } else {
        const newError = result.message || 'Failed to save note. Please try again.';
        setCurrentError(newError);
        onRetrySave(newError);
      }
    } catch (error) {
      const newError = 'Network error: Unable to save note';
      setCurrentError(newError);
      onRetrySave(newError);
    } finally {
      setIsSaving(false);
    }
  };

  const isNoteValid = noteLength <= 200;
  const isRetryDisabled = isSaving || !isNoteValid;

  return (
    <div style={styles.container}>
      <Button
        variant="ghost"
        onClick={onBack}
        style={styles.backButton}
        aria-label={t('booking-detail.back')}
      >
        {t('booking-detail.back')}
      </Button>

      <div style={styles.bookingHeader}>
        <Text variant="subtitle" style={styles.hotelName}>
          {booking.hotelName}
        </Text>
        <Text variant="body" style={styles.dates}>
          {booking.checkIn} — {booking.checkOut}
        </Text>
        <Text variant="caption" style={styles.location}>
          {booking.location}
        </Text>
      </div>

      <Text variant="label" style={styles.noteLabel}>
        {t('booking-detail.note-label')}
      </Text>

      <TextArea
        value={note}
        onChange={handleNoteChange}
        placeholder={t('booking-detail.note-placeholder')}
        aria-label={t('booking-detail.note-aria')}
        maxLength={200}
        style={styles.textArea}
      />

      <Text variant="caption" style={styles.charCount}>
        {noteLength} / 200
      </Text>

      <Alert
        type="error"
        style={styles.alert}
        aria-label="Save failed error message"
      >
        {currentError}
      </Alert>

      <Button
        variant="primary"
        onClick={handleRetry}
        disabled={isRetryDisabled}
        style={styles.retryButton}
        aria-label={t('booking-detail-save-failed.retry-aria')}
      >
        {isSaving ? t('booking-detail.saving') : t('booking-detail-save-failed.retry')}
      </Button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    padding: '1rem',
    maxWidth: '100%',
  },
  backButton: {
    alignSelf: 'flex-start' as const,
    marginBottom: '0.5rem',
  },
  bookingHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e0e0e0',
  },
  hotelName: {
    marginBottom: '0.25rem',
  },
  dates: {
    marginBottom: '0.25rem',
  },
  location: {
    color: '#666',
  },
  noteLabel: {
    marginTop: '1rem',
    fontWeight: '600',
  },
  textArea: {
    width: '100%',
    minHeight: '120px',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    resize: 'vertical' as const,
  },
  charCount: {
    color: '#666',
    fontSize: '0.875rem',
  },
  alert: {
    marginTop: '0.5rem',
  },
  retryButton: {
    marginTop: '1rem',
    alignSelf: 'flex-start' as const,
  },
};
