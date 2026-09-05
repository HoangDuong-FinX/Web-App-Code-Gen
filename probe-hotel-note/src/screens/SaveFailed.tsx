import React from 'react';
import { Booking } from '../types';
import { saveNoteFixture } from '../fixtures/bookings';
import Text from '../components/Text';
import Button from '../components/Button';
import Icon from '../components/Icon';
import './SaveFailed.css';

interface SaveFailedProps {
  booking: Booking;
  noteText: string;
  onRetry: () => void;
  onClose: () => void;
  isSaving: boolean;
  setSaving: (saving: boolean) => void;
}

const SaveFailed: React.FC<SaveFailedProps> = ({
  booking,
  noteText,
  onRetry,
  onClose,
  isSaving,
  setSaving,
}) => {
  const handleRetry = async () => {
    try {
      setSaving(true);
      await saveNoteFixture(booking.bookingId, noteText);
      onRetry();
    } catch (err) {
      setSaving(false);
    }
  };

  return (
    <div className="save-failed-screen">
      <div className="save-failed-content">
        <Icon name="error-circle" size="large" color="error" role="error-icon" />
        <Text variant="title" role="error-title">
          Save Failed
        </Text>
        <Text variant="body" role="error-message">
          Unable to save your note. Please check your connection and try again.
        </Text>
      </div>

      <div className="save-failed-actions">
        <Button
          variant="primary"
          onClick={handleRetry}
          disabled={isSaving}
          ariaLabel="Retry saving the note"
        >
          {isSaving ? 'Retrying...' : 'Retry'}
        </Button>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isSaving}
          ariaLabel="Close error and return to booking detail"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default SaveFailed;