import React from 'react';
import { loadBookingDetail } from '../fixtures/bookings';
import Text from '../components/Text';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { i18n } from '../i18n/vi';

interface BookingDetailProps {
  bookingId: string;
  noteText: string;
  onUpdateNoteText: (text: string) => void;
  onSaveNote: (bookingId: string, noteText: string) => void;
}

export default function BookingDetail({
  bookingId,
  noteText,
  onUpdateNoteText,
  onSaveNote,
}: BookingDetailProps) {
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
        ariaLabel={i18n['screen.booking_detail.note_input_aria']}
        placeholder={i18n['screen.booking_detail.note_placeholder']}
        maxLength={200}
        multiline
        value={noteText}
        onChange={onUpdateNoteText}
      />
      <Text variant="caption">
        {noteText.length} / 200
      </Text>

      <Button
        variant="primary"
        ariaLabel={i18n['screen.booking_detail.save_button_aria']}
        onClick={() => onSaveNote(bookingId, noteText)}
      >
        {i18n['screen.booking_detail.save_button']}
      </Button>
    </div>
  );
}