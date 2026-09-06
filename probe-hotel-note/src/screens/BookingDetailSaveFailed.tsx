import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ErrorIcon } from '../components/icons/ErrorIcon';
import './BookingDetailSaveFailed.css';

interface BookingDetailSaveFailedProps {
  onRetry: () => void;
  onCancel: () => void;
}

export function BookingDetailSaveFailed({
  onRetry,
  onCancel,
}: BookingDetailSaveFailedProps) {
  return (
    <div className="booking-detail-save-failed-screen">
      <div className="error-container">
        <ErrorIcon className="error-icon" role="error-icon" />

        <Text
          variant="heading-2"
          role="error-title"
          className="error-title"
        >
          Save Failed
        </Text>

        <Text
          variant="body-1"
          color="secondary"
          className="error-message"
          role="error-message"
        >
          Unable to save your note. Please try again.
        </Text>

        <div className="error-actions">
          <Button
            variant="primary"
            onClick={onRetry}
            aria-label="Retry saving the note"
            role="retry-button"
            className="retry-button"
          >
            Retry
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            aria-label="Cancel and return to bookings"
            role="cancel-button"
            className="cancel-button"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}