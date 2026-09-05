import React from 'react';
import { loadBookingDetail } from '../fixtures/bookings';
import Text from '../components/Text';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { i18n } from '../i18n/vi';

interface BookingDetailSaveFailedProps {
  bookingId: string;
  noteText: string;
  onUpdateNoteText: (text: string) => void;
  onRetryNote: (bookingId: string, noteText: string) => void;
  errorMessage?: string | null;
}

export default function BookingDetailSaveFailed({
  bookingId,
  noteText,
  onUpdateNoteText,
  onRetryNote,
  errorMessage,
}: BookingDetailSaveFailedProps) {
  const booking = loadBookingDetail(bookingId);

  if (!booking) {
    return <Text variant="body-secondary">{i18n['error.booking_not_found']}</Text>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text variant="title">{i18n['screen.booking_detail.title']}</Text>
      <Text variant="body-strong">{booking.hotelName}</Text>
      <Text variant="body-secondary">
        {booking.checkInDate} – {booking.checkOutDate}
      </Text>
      <Text variant="body-secondary">{booking.location}</Text>
      <Text variant="body-secondary">{booking.roomInfo}</Text>
      <Text variant="body-secondary">
        {i18n['screen.booking_detail.confirmation']}: {booking.confirmationNumber}
      </Text>

      <Text variant="label">{i18n['screen.booking_detail.notes_label']}</Text>
      <TextInput
        ariaLabel={i18n['screen.booking_detail_save_failed.note_input_aria']}
        placeholder={i18n['screen.booking_detail.note_placeholder']}
        maxLength={200}
        multiline
        value={noteText}
        onChange={onUpdateNoteText}
      />
      <Text variant="caption">
        {noteText.length} / 200
      </Text>

      <Alert variant="error" ariaLabel={i18n['error.save_failed_aria']}>
        {errorMessage || i18n['error.save_note_failed']}
      </Alert>

      <Button
        variant="primary"
        ariaLabel={i18n['screen.booking_detail_save_failed.retry_button_aria']}
        onClick={() => onRetryNote(bookingId, noteText)}
      >
        {i18n['screen.booking_detail_save_failed.retry_button']}
      </Button>
    </div>
  );
}