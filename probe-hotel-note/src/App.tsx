import React, { useState } from 'react';
import { BookingsList } from './screens/BookingsList';
import { BookingDetail } from './screens/BookingDetail';
import { BookingDetailSaveFailed } from './screens/BookingDetailSaveFailed';
import { Booking } from './types';
import './App.css';

type ScreenId = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: ScreenId;
  selectedBookingId: string | null;
  noteText: string;
}

export function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBookingId: null,
    noteText: '',
  });

  const handleNavigateToBookingDetail = (bookingId: string, currentNote: string) => {
    setAppState({
      currentScreen: 'booking-detail',
      selectedBookingId: bookingId,
      noteText: currentNote,
    });
  };

  const handleNavigateToBookingsList = () => {
    setAppState({
      currentScreen: 'bookings-list',
      selectedBookingId: null,
      noteText: '',
    });
  };

  const handleNavigateToSaveFailed = () => {
    setAppState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
    }));
  };

  const handleRetry = () => {
    setAppState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
    }));
  };

  const handleUpdateNote = (text: string) => {
    setAppState((prev) => ({
      ...prev,
      noteText: text,
    }));
  };

  return (
    <div className="app-root" data-brand="vikki" data-theme="light">
      {appState.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={handleNavigateToBookingDetail} />
      )}
      {appState.currentScreen === 'booking-detail' && appState.selectedBookingId && (
        <BookingDetail
          bookingId={appState.selectedBookingId}
          initialNote={appState.noteText}
          onBack={handleNavigateToBookingsList}
          onSaveSuccess={handleNavigateToBookingsList}
          onSaveFailed={handleNavigateToSaveFailed}
          onNoteChange={handleUpdateNote}
        />
      )}
      {appState.currentScreen === 'booking-detail-save-failed' && (
        <BookingDetailSaveFailed
          onRetry={handleRetry}
          onCancel={handleNavigateToBookingsList}
        />
      )}
    </div>
  );
}

export default App;