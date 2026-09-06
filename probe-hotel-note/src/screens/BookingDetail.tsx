import React, { useState, useEffect } from 'react';
import { loadBookingDetail, saveBookingNote } from '../fixtures/bookings';
import { Booking } from '../types';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { TextArea } from '../components/TextArea';
import { Alert } from '../components/Alert';
import { ChevronLeftIcon } from '../components/icons/ChevronLeftIcon';
import './BookingDetail.css';

interface BookingDetailProps {
  bookingId: string;
  initialNote: string;
  onBack: () => void;
  onSaveSuccess: () => void;
  onSaveFailed: () => void;
  onNoteChange: (text: string) => void;
}

export function BookingDetail({
  bookingId,
  initialNote,
  onBack,
  onSaveSuccess,
  onSaveFailed,
  onNoteChange,
}: BookingDetailProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [noteText, setNoteText] = useState(initialNote);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = loadBookingDetail(bookingId);
    setBooking(data);
    setNoteText(data.note);
  }, [bookingId]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, 200);
    setNoteText(text);
    onNoteChange(text);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveBookingNote(bookingId, noteText);
      if (result.success) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          onSaveSuccess();
        }, 1500);
      } else {
        onSaveFailed();
      }
    } catch (error) {
      onSaveFailed();
    } finally {
      setIsSaving(false);
    }
  };

  if (!booking) {
    return <div className="booking-detail-loading">Loading...</div>;
  }

  const charCount = noteText.length;

  return (
    <div className="booking-detail-screen">
      <div className="booking-detail-container">
        <Button
          variant="ghost"
          onClick={onBack}
          aria-label="Back to bookings"
          role="back-button"
          className="back-button"
        >
          <ChevronLeftIcon />
        </Button>

        <Text
          variant="heading-2"
          role="booking-hotel-name"
          className="detail-hotel-name"
        >
          {booking.hotelName}
        </Text>

        <Text
          variant="body-1"
          color="secondary"
          role="booking-dates"
          className="detail-dates"
        >
          {booking.checkInDate} – {booking.checkOutDate}
        </Text>

        <Text
          variant="body-1"
          color="secondary"
          role="booking-location"
          className="detail-location"
        >
          {booking.location}
        </Text>

        <Text
          variant="body-2"
          color="tertiary"
          role="booking-confirmation-number"
          className="detail-confirmation"
        >
          Confirmation: {booking.confirmationNumber}
        </Text>

        <Text
          variant="label"
          role="note-input-label"
          className="note-label"
        >
          Note
        </Text>

        <TextArea
          maxLength={200}
          placeholder="Add a note about your stay..."
          aria-label="Note for this booking, maximum 200 characters"
          role="note-input"
          value={noteText}
          onChange={handleNoteChange}
          className="note-textarea"
        />

        <Text
          variant="caption"
          color="secondary"
          role="character-count"
          className="character-count"
        >
          {charCount} / 200
        </Text>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save note"
          role="save-button"
          className="save-button"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {showSuccessAlert && (
          <Alert
            variant="success"
            role="success-message"
            className="success-alert"
          >
            Note saved successfully
          </Alert>
        )}
      </div>
    </div>
  );
}