// App.tsx
import React, { useState } from 'react';
import { Booking, ScreenId } from './types';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('bookings-list');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [failedNoteText, setFailedNoteText] = useState('');

  // Navigation handlers
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCurrentScreen('booking-detail');
  };

  const handleBackToBookings = () => {
    setCurrentScreen('bookings-list');
    setSelectedBooking(null);
    setFailedNoteText('');
  };

  const handleSaveSuccess = () => {
    setCurrentScreen('booking-detail');
    setFailedNoteText('');
  };

  const handleSaveFailed = (noteText: string) => {
    setFailedNoteText(noteText);
    setCurrentScreen('booking-detail-save-failed');
  };

  const handleRetrySuccess = () => {
    setCurrentScreen('booking-detail');
    setFailedNoteText('');
  };

  const handleRetryFailed = (noteText: string) => {
    setFailedNoteText(noteText);
    setCurrentScreen('booking-detail-save-failed');
  };

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={handleSelectBooking} />
      )}
      {currentScreen === 'booking-detail' && selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onBack={handleBackToBookings}
          onSaveSuccess={handleSaveSuccess}
          onSaveFailed={handleSaveFailed}
        />
      )}
      {currentScreen === 'booking-detail-save-failed' && selectedBooking && (
        <BookingDetailSaveFailed
          booking={selectedBooking}
          failedNoteText={failedNoteText}
          onBack={handleBackToBookings}
          onRetrySuccess={handleRetrySuccess}
          onRetryFailed={handleRetryFailed}
        />
      )}
    </div>
  );
};

export default App;
