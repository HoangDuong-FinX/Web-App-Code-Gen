import React, { useState } from 'react';
import BookingsList from './screens/BookingsList';
import BookingDetail from './screens/BookingDetail';
import BookingDetailSaveFailed from './screens/BookingDetailSaveFailed';
import { Booking } from './types';

type Screen = 'bookings-list' | 'booking-detail' | 'booking-detail-save-failed';

interface AppState {
  currentScreen: Screen;
  selectedBooking: Booking | null;
  noteText: string;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'bookings-list',
    selectedBooking: null,
    noteText: '',
  });

  const navigateToBookingDetail = (booking: Booking, currentNote: string) => {
    setState({
      currentScreen: 'booking-detail',
      selectedBooking: booking,
      noteText: currentNote,
    });
  };

  const navigateToSaveFailed = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail-save-failed',
    }));
  };

  const navigateBackToDetail = () => {
    setState((prev) => ({
      ...prev,
      currentScreen: 'booking-detail',
    }));
  };

  const navigateBackToList = () => {
    setState({
      currentScreen: 'bookings-list',
      selectedBooking: null,
      noteText: '',
    });
  };

  const updateNoteText = (text: string) => {
    setState((prev) => ({
      ...prev,
      noteText: text,
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {state.currentScreen === 'bookings-list' && (
        <BookingsList onSelectBooking={navigateToBookingDetail} />
      )}
      {state.currentScreen === 'booking-detail' && state.selectedBooking && (
        <BookingDetail
          booking={state.selectedBooking}
          noteText={state.noteText}
          onNoteChange={updateNoteText}
          onSaveSuccess={navigateBackToList}
          onSaveFailed={navigateToSaveFailed}
          onBack={navigateBackToList}
        />
      )}
      {state.currentScreen === 'booking-detail-save-failed' && state.selectedBooking && (
        <BookingDetailSaveFailed
          booking={state.selectedBooking}
          noteText={state.noteText}
          onNoteChange={updateNoteText}
          onRetrySaveSuccess={navigateBackToDetail}
          onRetrySaveFailed={() => {}}
          onContinueEditing={navigateBackToDetail}
          onBack={navigateBackToList}
        />
      )}
    </div>
  );
}