import React, { useState, useCallback } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';
import { bookingsFixture, Booking } from './fixtures/bookings';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  noteText: string;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBookingId: null,
    noteText: '',
  });

  const selectedBooking = bookingsFixture.find(
    (b) => b.bookingId === state.selectedBookingId
  );

  // Navigation handlers
  const navigateToDetail = useCallback((bookingId: string) => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
      selectedBookingId: bookingId,
      noteText: '',
    }));
  }, []);

  const navigateToList = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      noteText: '',
    }));
  }, []);

  const navigateToSaveFailed = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
    }));
  }, []);

  const navigateBackToDetail = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
    }));
  }, []);

  // Binding handlers
  const handleUpdateNoteText = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      noteText: text,
    }));
  }, []);

  // Fixture: save-note binding
  // Simulates a 50/50 success/failure rate for demonstration
  const handleSaveNote = useCallback(() => {
    const willSucceed = Math.random() > 0.5;
    if (willSucceed) {
      // Success path: stay on booking-detail
      console.log('Note saved successfully:', state.noteText);
      setState((prev) => ({
        ...prev,
        currentScreen: 'booking-detail',
        noteText: '',
      }));
    } else {
      // Failure path: navigate to booking-detail-save-failed
      console.log('Note save failed');
      navigateToSaveFailed();
    }
  }, [state.noteText, navigateToSaveFailed]);

  // Fixture: retry-save-note binding
  // Also simulates 50/50 success/failure
  const handleRetryNote = useCallback(() => {
    const willSucceed = Math.random() > 0.5;
    if (willSucceed) {
      // Success path: navigate back to booking-detail
      console.log('Note saved successfully on retry:', state.noteText);
      setState((prev) => ({
        ...prev,
        currentScreen: 'booking-detail',
        noteText: '',
      }));
    } else {
      // Failure path: stay on booking-detail-save-failed
      console.log('Note save failed again on retry');
      // No state change; user remains on save-failed screen
    }
  }, [state.noteText]);

  // Render current screen
  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'bookings-list':
        return (
          <BookingsList
            bookings={bookingsFixture}
            onSelectBooking={navigateToDetail}
          />
        );
      case 'booking-detail':
        return selectedBooking ? (
          <BookingDetail
            booking={selectedBooking}
            currentNote={state.noteText}
            onNoteChange={handleUpdateNoteText}
            onSave={handleSaveNote}
          />
        ) : null;
      case 'booking-detail-save-failed':
        return selectedBooking ? (
          <BookingDetailSaveFailed
            booking={selectedBooking}
            currentNote={state.noteText}
            onNoteChange={handleUpdateNoteText}
            onRetry={handleRetryNote}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
