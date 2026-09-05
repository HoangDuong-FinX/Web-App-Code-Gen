import React, { useState } from 'react';
import { Booking } from '../types';
import { saveNoteFixture } from '../fixtures/bookings';
import Text from '../components/Text';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Toast from '../components/Toast';
import './BookingDetail.css';

interface BookingDetailProps {
  booking: Booking;
  noteText: string;
  onNoteChange: (text: string) => void;
  onBack: () => void;
  onSaveFailed: (preservedNote: string) => void;
  onSaveSuccess: () => void;
  isSaving: boolean;
  setSaving: (saving: boolean) => void;
}

const BookingDetail: React.FC<BookingDetailProps> = ({
  booking,
  noteText,
  onNoteChange,
  onBack,
  onSaveFailed,
  onSaveSuccess,
  isSaving,
  setSaving,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(noteText.length);

  const handleNoteChange = (value: string) => {
    if (value.length <= 200) {
      onNoteChange(value);
      setCharCount(value.length);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveNoteFixture(booking.bookingId, noteText);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onSaveSuccess();
    } catch (err) {
      onSaveFailed(noteText);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="booking-detail-screen">
      <div className="booking-detail-header">
        <Button variant="ghost" icon="chevron-left" ariaLabel="Back to bookings list" onClick={onBack} />
        <Text variant="sectionTitle">Booking Details</Text>
      </div>

      <div className="booking-detail-content">
        <div className="booking-info">
          <Text variant="bodyStrong" role="booking-hotel-name">
            {booking.hotelName}
          </Text>
          <Text variant="body" role="booking-dates">
            {booking.checkInDate} – {booking.checkOutDate}
          </Text>
          <Text variant="body" role="booking-reference-number">
            Reference: {booking.bookingId}
          </Text>
          <Text variant="body" role="booking-guest-count">
            Guests: {booking.guestCount}
          </Text>
        </div>

        <div className="note-section">
          <Text variant="label">My Note</Text>
          <TextInput
            value={noteText}
            onChange={handleNoteChange}
            placeholder="Add a note (up to 200 characters)"
            ariaLabel="Note input field, maximum 200 characters"
            maxLength={200}
            multiline
            disabled={isSaving}
          />
          <Text variant="caption" role="character-count">
            {charCount} / 200
          </Text>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          ariaLabel="Save note to booking"
        >
          {isSaving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>

      <Toast
        visible={showSuccess}
        type="success"
        message="Note saved"
        ariaLabel="Note saved successfully"
      />
    </div>
  );
};

export default BookingDetail;